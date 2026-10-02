/* =====================================================
   TASK STORAGE
===================================================== */

let tasks =
    JSON.parse(
        localStorage.getItem("myTimetableTasks")
    ) || [];



/* =====================================================
   PAGE START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showDate();

        updateClock();

        displayTasks();

        setInterval(
            updateClock,
            1000
        );

        setInterval(
            checkAlarms,
            1000
        );

    }
);



/* =====================================================
   DATE
===================================================== */

function showDate() {

    const dateElement =
        document.getElementById(
            "todayDate"
        );


    const today =
        new Date();


    const options = {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric"

    };


    dateElement.textContent =
        today.toLocaleDateString(
            "en-IN",
            options
        );
}



/* =====================================================
   CLOCK
===================================================== */

function updateClock() {

    const now =
        new Date();


    let hours =
        now.getHours();

    const minutes =
        now.getMinutes()
            .toString()
            .padStart(2, "0");

    const seconds =
        now.getSeconds()
            .toString()
            .padStart(2, "0");


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12 || 12;


    document.getElementById(
        "clock"
    ).textContent =
        `${hours}:${minutes}:${seconds} ${period}`;

}



/* =====================================================
   ADD TASK
===================================================== */

function addTask() {

    const taskName =
        document.getElementById(
            "taskInput"
        ).value.trim();


    const taskTime =
        document.getElementById(
            "timeInput"
        ).value;


    const category =
        document.getElementById(
            "categoryInput"
        ).value;


    const reminder =
        Number(
            document.getElementById(
                "reminderInput"
            ).value
        );


    if (taskName === "") {

        alert(
            "Please enter a task 📝"
        );

        return;

    }


    if (taskTime === "") {

        alert(
            "Please select a time ⏰"
        );

        return;

    }


    const task = {

        id:
            Date.now(),

        name:
            taskName,

        time:
            taskTime,

        category:
            category,

        reminder:
            reminder,

        completed:
            false,

        alarmTriggered:
            false

    };


    tasks.push(task);


    tasks.sort(
        (a, b) =>
            a.time.localeCompare(
                b.time
            )
    );


    saveTasks();

    displayTasks();


    document.getElementById(
        "taskInput"
    ).value = "";


    document.getElementById(
        "timeInput"
    ).value = "";


    /* Small success animation */

    showSuccessMessage();

}



/* =====================================================
   SUCCESS MESSAGE
===================================================== */

function showSuccessMessage() {

    const button =
        document.querySelector(
            ".add-button"
        );


    const original =
        button.innerHTML;


    button.innerHTML =
        "✅ Task Added!";


    button.style.background =
        "linear-gradient(135deg,#16a34a,#22c55e)";


    setTimeout(
        function () {

            button.innerHTML =
                original;

            button.style.background =
                "";

        },
        1200
    );

}



/* =====================================================
   SAVE
===================================================== */

function saveTasks() {

    localStorage.setItem(
        "myTimetableTasks",
        JSON.stringify(tasks)
    );

}



/* =====================================================
   DISPLAY
===================================================== */

function displayTasks() {

    const taskList =
        document.getElementById(
            "taskList"
        );


    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    taskList.innerHTML =
        "";


    if (tasks.length === 0) {

        emptyMessage.style.display =
            "block";

        updateStatistics();

        return;

    }


    emptyMessage.style.display =
        "none";


    tasks.forEach(
        function (task) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "task-card";


            if (task.completed) {

                card.classList.add(
                    "completed"
                );

            }


            card.innerHTML = `

                <div class="task-time">

                    ⏰
                    ${formatTime(task.time)}

                </div>


                <div>

                    <div class="task-name">

                        ${escapeHTML(task.name)}

                    </div>


                    <span class="task-category">

                        ${getCategoryIcon(task.category)}

                        ${escapeHTML(task.category)}

                    </span>


                    <span class="task-category">

                        🔔

                        ${
                            task.reminder === 0
                            ? "At task time"
                            : task.reminder +
                              " min before"
                        }

                    </span>

                </div>


                <div class="task-actions">

                    <button
                        class="complete-button"
                        onclick="completeTask(${task.id})"
                    >

                        ${
                            task.completed
                            ? "↩ Undo"
                            : "✓ Done"
                        }

                    </button>


                    <button
                        class="delete-button"
                        onclick="deleteTask(${task.id})"
                    >

                        🗑 Delete

                    </button>

                </div>

            `;


            taskList.appendChild(
                card
            );

        }
    );


    updateStatistics();

}



/* =====================================================
   TIME FORMAT
===================================================== */

function formatTime(time) {

    const [hours, minutes] =
        time.split(":");


    const date =
        new Date();


    date.setHours(
        Number(hours),

        Number(minutes),

        0
    );


    return date.toLocaleTimeString(
        "en-IN",
        {

            hour: "numeric",

            minute: "2-digit"

        }
    );

}



/* =====================================================
   CATEGORY ICON
===================================================== */

function getCategoryIcon(
    category
) {

    const icons = {

        College: "📚",

        Study: "📝",

        Fitness: "🏃",

        Personal: "🏠",

        Other: "📌"

    };


    return (
        icons[category]
        ||
        "📌"
    );

}



/* =====================================================
   COMPLETE
===================================================== */

function completeTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveTasks();

    displayTasks();

}



/* =====================================================
   DELETE
===================================================== */

function deleteTask(id) {

    const confirmation =
        confirm(
            "Delete this task? 🗑️"
        );


    if (!confirmation) {

        return;

    }


    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );


    saveTasks();

    displayTasks();

}



/* =====================================================
   NOTIFICATIONS
===================================================== */

function enableNotifications() {

    if (
        !("Notification" in window)
    ) {

        alert(
            "Your browser does not support notifications."
        );

        return;

    }


    Notification
        .requestPermission()
        .then(
            function(permission) {

                if (
                    permission ===
                    "granted"
                ) {

                    new Notification(
                        "🎉 Notifications Enabled!",
                        {

                            body:
                                "Your timetable assistant is ready."

                        }
                    );

                }

                else {

                    alert(
                        "Please allow notifications in your browser."
                    );

                }

            }
        );

}



/* =====================================================
   CHECK ALARMS
===================================================== */

function checkAlarms() {

    const now =
        new Date();


    const currentHours =
        now.getHours();


    const currentMinutes =
        now.getMinutes();


    tasks.forEach(
        function(task) {

            if (
                task.completed
            ) {

                return;

            }


            const [
                hours,
                minutes
            ] =
                task.time.split(":");


            const taskDate =
                new Date();


            taskDate.setHours(

                Number(hours),

                Number(minutes),

                0,

                0

            );


            const reminderTime =
                new Date(
                    taskDate.getTime()
                    -
                    task.reminder
                    *
                    60000
                );


            if (

                currentHours ===
                    reminderTime.getHours()

                &&

                currentMinutes ===
                    reminderTime.getMinutes()

                &&

                !task.alarmTriggered

            ) {

                triggerAlarm(task);


                task.alarmTriggered =
                    true;


                saveTasks();

            }

        }
    );

}



/* =====================================================
   TRIGGER ALARM
===================================================== */

function triggerAlarm(task) {

    document.getElementById(
        "alarmTaskName"
    ).textContent =
        task.name;


    document.getElementById(
        "alarmTaskCategory"
    ).textContent =
        `${getCategoryIcon(task.category)}
         ${task.category}`;


    document.getElementById(
        "alarmScreen"
    ).classList.add(
        "show"
    );


    /* Browser notification */

    if (

        "Notification" in window

        &&

        Notification.permission
            === "granted"

    ) {

        new Notification(
            "⏰ Time for your task!",
            {

                body:
                    `${task.name} — ${formatTime(task.time)}`

            }
        );

    }


    playAlarmSound();

}



/* =====================================================
   ALARM SOUND
===================================================== */

function playAlarmSound() {

    try {

        const AudioContext =
            window.AudioContext
            ||
            window.webkitAudioContext;


        const audio =
            new AudioContext();


        const oscillator =
            audio.createOscillator();


        const gain =
            audio.createGain();


        oscillator.connect(
            gain
        );


        gain.connect(
            audio.destination
        );


        oscillator.frequency.value =
            850;


        gain.gain.value =
            0.25;


        oscillator.start();


        setTimeout(
            function() {

                oscillator.stop();

                audio.close();

            },
            1200
        );

    }

    catch(error) {

        console.log(
            "Audio could not play."
        );

    }

}



/* =====================================================
   CLOSE ALARM
===================================================== */

function closeAlarm() {

    document.getElementById(
        "alarmScreen"
    ).classList.remove(
        "show"
    );

}



/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const pending =
        total -
        completed;


    document.getElementById(
        "totalTasks"
    ).textContent =
        total;


    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;


    document.getElementById(
        "pendingTasks"
    ).textContent =
        pending;

}



/* =====================================================
   SAFE TEXT
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}