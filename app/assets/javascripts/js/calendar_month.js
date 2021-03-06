/* ============================================================
 * Calendar
 * This is a Demo App that was created using Pages Calendar Plugin
 * We have demonstrated a few function that are useful in creating
 * a custom calendar. Please refer docs for more information
 * ============================================================ */

(function ($) {

    'use strict';

    $(document).ready(function () {

        $('#lbltoTime')

        function edit_event(event) {
            $.ajax({
                url: '/home/edit_event',
                type: 'post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(event),
                dataType: "json",
                success: function () {
                }
            });
        }

        var selectedEvent;

        var mycal = $('#myCalendar_month');
        mycal.pagescalendar({
            //Loading Dummy EVENTS for demo Purposes, you can feed the events attribute from
            //Web Service
            events: [],
            view: "month",
            onViewRenderComplete: function () {
                //You can Do a Simple AJAX here and update
            },
            onEventClick: function (event) {
                //Open Pages Custom Quick View
                if (!$('#calendar-event').hasClass('open'))
                    $('#calendar-event').addClass('open');

                selectedEvent = event;

                $.ajax({
                    url: '/home/current_load_event/' + selectedEvent.other.id,
                    type: 'post',
                    success: function (data) {
                        var e = {};
                        e.other = { id: data.id, desc: data.content};
                        e.title = data.title;
                        e.content = data.content;
                        e.class = 'bg-success-lighter';
                        e.start = data.start_date;
                        e.end = data.end_date;
                        $('#txteventname').val(e.title);
                        $('#txteventdesc').val(e.content);
                    }
                });

                setEventDetailsToForm(selectedEvent);
            },
            onEventDragComplete: function (event) {
                selectedEvent = event;
                edit_event(selectedEvent);
                setEventDetailsToForm(selectedEvent);
            },
            onTimeSlotDblClick: function (timeSlot) {
                $('#calendar-event').removeClass('open');
                //Adding a new Event on Slot Double Click
                var newEvent = {
                    title: 'my new event',
                    class: 'bg-success-lighter',
                    start: timeSlot.date,
                    end: moment(timeSlot.date).add(1, 'hour').format(),
                    allDay: false,
                    other: {
                        desc: '',
                        //You can have your custom list of attributes here
                    }
                };
                selectedEvent = newEvent;

                //초기 이벤트 생성시 저장
                $.ajax({
                    url: '/home/create_event',
                    type: 'post',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(selectedEvent),
                    dataType: "json",
                    success: function (data) {
                        $.ajax({
                            url: '/home/new_load_event',
                            type: 'post',
                            success: function (data) {
                                var e = {};
                                e.other = { id: data.id, desc: data.content};
                                e.title = data.title;
                                e.class = 'bg-success-lighter';
                                e.start = data.start_date;
                                e.end = data.end_date;
                                mycal.pagescalendar('addEvent', e);
                            }
                        });
                    }
                });

                setEventDetailsToForm(selectedEvent);
            }
        });

        // Some Other Public Methods That can be Use are below \
        //console.log($('body').pagescalendar('getEvents'))
        //get the value of a property
        //console.log($('body').pagescalendar('getDate','MMMM'));

        $('#eventExit').click(function () {
            $('#calendar-event').removeClass('open');
        });

        function setEventDetailsToForm(event) {
            $('#eventIndex').val();
            $('#txtEventName').val();
            $('#txtEventDesc').val();
            //Show Event date
            $('#event-date').html(moment(event.start).format('MMM, D dddd'));

            $('#lblfromTime').html(moment(event.start).format('h:mm A'));
            $('#lbltoTime').html(moment(event.end).format('h:mm A'));

            //Load Event Data To Text Field
            $('#eventIndex').val(event.index);
            $('#txtEventName').val(event.title);
            $('#txtEventDesc').val(event.other.desc);

            $('#txtEventStartDate').val(moment(event.start).format('YYYY-MM-DDThh:mm'));
            $('#txtEventEndDate').val(moment(event.end).format('YYYY-MM-DDThh:mm'));
        }

        $('#eventSave_month').on('click', function () {
            selectedEvent.title = $('#txtEventName').val();

            //You can add Any thing inside "other" object and it will get save inside the plugin.
            //Refer it back using the same name other.your_custom_attribute

            selectedEvent.other.desc = $('#txtEventDesc').val();

            selectedEvent.start = $('#txtEventStartDate').val();
            selectedEvent.end = $('#txtEventEndDate').val();

            mycal.pagescalendar('updateEvent', selectedEvent);

            edit_event(selectedEvent);

            $('#calendar-event').removeClass('open');
        });

        $('#eventDelete_month').on('click', function () {
            mycal.pagescalendar('removeEvent', $('#eventIndex').val());

            //삭제
            $.ajax({
                url: '/home/delete_event',
                type: 'post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(selectedEvent),
                dataType: "json",
                success: function () {
                }
            });
            $('#calendar-event').removeClass('open');
        });

        //처음 이벤트 로드 데이터 불러오기 -> pagescalender에 저장
        $.ajax({
            url: '/home/load_event',
            type: 'post',
            success: function (data) {
                for (var idx in data) {
                    var e = {};
                    e.other = {id: data[idx].id, desc: data[idx].content};
                    e.title = data[idx].title;
                    e.class = 'bg-success-lighter';
                    e.start = data[idx].start_date;
                    e.end = data[idx].end_date;
                    mycal.pagescalendar('addEvent', e);
                }
            }
        });

    });
})(window.jQuery);