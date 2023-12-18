/**
 * Adds a Piazzanalytics button to the navbar.
 */
function add_navbar_button() {
  let site_nav = document.getElementById("site-nav");
  if (site_nav) {
    let new_button = `<li><button type="button" class="btn btn-primary btn btn-primary piazzanalytics_button"><span>Piazzanalytics</span></button></li>`;
    site_nav.insertAdjacentHTML("beforeend", new_button);
  }

  let collapsed_nav = document.querySelector("#qaMenuId_menu > div");
  if (collapsed_nav) {
    let new_button = `<button data-id="dropdownItem_idx5" class="dropdown-item piazzanalytics_button">Piazzanalytics</button>`;
    collapsed_nav.insertAdjacentHTML("beforeend", new_button);
  }
}

/**
 * Adds a Piazzanalytics button to the feed.
 */
function add_feed_button() {
  let action_bar = document.getElementById("actionBar");
  if (action_bar) {
    let new_button = `<div class="col-auto ml-auto"><button aria-label="Piazzanalytics" type="button" class="btn btn-link btn-sm piazzanalytics_button"><span>Piazzanalytics</span></button></div>`;
    action_bar.insertAdjacentHTML("beforeend", new_button);
  }
}

/**
 * Displays a hidden DOM object.
 * @param {Object} element - DOM element.
 */
function show_element(element) {
  element.classList.remove("d-none");
  element.classList.add("d-block");
  element.setAttribute("aria-hidden", "false");
}

/**
 * Hides a visible DOM object.
 * @param {Object} element - DOM element.
 */
function hide_element(element) {
  element.classList.remove("d-block");
  element.classList.add("d-none");
  element.setAttribute("aria-hidden", "true");
}

/**
 * Sets the progress bar state.
 * @param {number|null} progress - Processed post count. Can be set to null to make no changes.
 * @param {number} percentage - Progress percentage between 0-100.
 * @param {number|null} max - Maximum number of posts that will be processed. Can be set to null to make no changes.
 */
function set_bar_progress(progress, percentage, max) {
  let bar = document.getElementById("piazzanalytics_progress");
  bar.setAttribute("aria-valuenow", percentage);
  bar.style.width = `${percentage}%`;
  if (progress) {
    document.getElementById("piazzanalytics_progress_current").innerText =
      progress;
  }
  if (max) {
    document.getElementById("piazzanalytics_progress_max").innerText = max;
  }
}

/**
 * Retrieves all post buckets and expands all collapsed buckets to retrieve all post IDs. Calls itself until there is no
 * change.
 * @param {number} current_posts - Number of posts currently accessible. If the number of accessible posts is the same,
 *   it means the posts are ready to be collected. It should be set to 0 when it is called for the first time.
 */
function prepare_all_posts(current_posts) {
  document
    .querySelectorAll(
      "div[data-id=post_group] div[role=button]:not([aria-expanded=true]"
    )
    .forEach((element) => element.click());
  let load_all = document.querySelector("button[id=load-all-button]");
  if (load_all) {
    load_all.click();
    setTimeout(function () {
      document
        .querySelectorAll(
          "div[data-id=post_group] div[role=button]:not([aria-expanded=true]"
        )
        .forEach((element) => element.click());
    }, 1000);
  }

  let new_post_count = document.querySelectorAll(
    'button[aria-label^="Feed Item Actions for Post"]'
  ).length;
  if (new_post_count === current_posts) {
    setTimeout(function () {
      generate_statistics(true);
    }, 1000);
  } else {
    prepare_all_posts(new_post_count);
  }
}

/**
 * Makes the program sleep to delay execution of code.
 * @param {number} seconds - Number of seconds to sleep.
 * @returns {Promise} Promise needed by the program to continue the execution.
 */
function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Converts a given Date object or a date string to the user's detected timezone.
 * @param {Date|string} date - A date object or a string that can be parsed into a date object.
 * @returns {Date} Local date based on the user's detected timezone.
 */
function get_local_date(date) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  );
}

/**
 * Retrieves the day name from the given date object.
 * @param {Date} date - Date object.
 * @returns {string} Day name.
 */
function get_day_name(date) {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][date.getDay()];
}

/**
 * Calculates the day-hour bar index for a date for visualization. Currently not used but may be needed in the future.
 * @param {Date} date - Date object.
 * @param {number} hours_per_bar - Number of hours that will be aggregated by a bar. Must be a divisor of 24.
 * @returns {number} Bar index.
 */
function get_day_hour_index(date, hours_per_bar) {
  const valid_hours = [1, 2, 3, 4, 6, 8, 12, 24];

  if (!valid_hours.includes(hours_per_bar)) {
    throw new Error(
      "hours_per_bar must be one of the following values: 1, 2, 3, 4, 6, 12, 24"
    );
  }

  const day_of_week = date.getDay(); // Starts with Sunday
  const hour_of_day = date.getHours();

  const bars_per_day = 24 / hours_per_bar;
  const bar_index =
    day_of_week * bars_per_day + Math.floor(hour_of_day / hours_per_bar);

  return bar_index;
}

/**
 * Calculates the hour bar index for a given date for visualization.
 * @param {Date} date - Date object.
 * @param {number} hours_per_bar - Number of hours that will be aggregated by a bar. Must be a divisor of 24.
 * @returns {number} Bar index.
 */
function get_hour_index(date, hours_per_bar) {
  const valid_hours = [1, 2, 3, 4, 6, 8, 12, 24];

  if (!valid_hours.includes(hours_per_bar)) {
    throw new Error(
      "hours_per_bar must be one of the following values: 1, 2, 3, 4, 6, 8, 12, 24"
    );
  }

  const hour_of_day = date.getHours();
  const bar_index = Math.floor(hour_of_day / hours_per_bar);
  return bar_index;
}

/**
 * Generates day-hour labels for visualization. Currently not used but may be needed in the future.
 * @param {number} hours_per_bar - Number of hours that will be aggregated by a bar. Must be a divisor of 24.
 * @returns {Array} Label array.
 */
function generate_day_hour_labels(hours_per_bar) {
  if (![1, 2, 3, 4, 6, 8, 12, 24].includes(hours_per_bar)) {
    throw new Error(
      "hours_per_bar must be one of the following values: 1, 2, 3, 4, 6, 8, 12, 24"
    );
  }

  const labels = [];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  days.forEach((day) => {
    for (let hour = 0; hour < 24; hour += hours_per_bar) {
      const end_hour = hour + hours_per_bar - 1;
      labels.push(
        `${day} ${hour.toString().padStart(2, "0")}:00 - ${end_hour
          .toString()
          .padStart(2, "0")}:59`
      );
    }
  });

  return labels;
}

/**
 * Generates hour labels for visualization.
 * @param {Date} hours_per_bar - Number of hours that will be aggregated by a bar. Must be a divisor of 24.
 * @returns {Array} Label array.
 */
function generate_hour_labels(hours_per_bar) {
  if (![1, 2, 3, 4, 6, 8, 12, 24].includes(hours_per_bar)) {
    throw new Error(
      "hours_per_bar must be one of the following values: 1, 2, 3, 4, 6, 8, 12, 24"
    );
  }

  const labels = [];

  for (let hour = 0; hour < 24; hour += hours_per_bar) {
    const end_hour = hour + hours_per_bar - 1;
    labels.push(
      `${hour.toString().padStart(2, "0")}:00 - ${end_hour
        .toString()
        .padStart(2, "0")}:59`
    );
  }

  return labels;
}

/**
 * Retrieves a color to be used in a visualization based on a given index.
 * @param {number} i - Index that will deterministically define the color. It is used with modulo, so guarantees unique
 *   colors only between indices between 0 and 13.
 * @param {string|undefined} alpha_hex - Hexadecimal alpha value that will be concatenated to the color.
 * @returns {string} Color in hexadecimal format, like #FF0000 or #FF000000 (if an alpha value is provided).
 */
function get_chart_color(i, alpha_hex) {
  let colors = [
    "#3498db",
    "#e74c3c",
    "#1abc9c",
    "#e67e22",
    "#9b59b6",
    "#f1c40f",
    "#34495e",
    "#2980b9",
    "#c0392b",
    "#16a085",
    "#d35400",
    "#8e44ad",
    "#f39c12",
    "#2c3e50",
  ];
  return (
    colors[i % colors.length] +
    (typeof alpha_hex !== "undefined" ? alpha_hex : "")
  );
}

/**
 * Plots a line chart that shows the daily post counts.
 * @param {Object} history_data - History data that aggregates post counts by day.
 * @returns {Chart} Chart.js chart.
 */
function plot_history(history_data) {
  const sorted_keys = Object.keys(history_data).sort();
  const sorted_history_data = {};
  for (const key of sorted_keys) {
    sorted_history_data[key] = history_data[key];
  }
  let chart_history = new Chart(document.getElementById("chart_history"), {
    type: "line",
    data: {
      labels: Object.keys(sorted_history_data),
      datasets: [
        {
          label: "Posts",
          data: Object.values(sorted_history_data),
          backgroundColor: get_chart_color(0),
          borderColor: get_chart_color(0),
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Post activity",
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
          },
          ticks: {
            source: "data",
          },
          time: {
            unit: "day",
          },
        },
        y: {
          title: {
            display: true,
            text: "Posts",
          },
          ticks: {
            precision: 0,
            beginAtZero: true,
          },
        },
      },
    },
  });

  return chart_history;
}

/**
 * Plots a stacked bar chart that shows the daily post counts and posting hours.
 * @param {Object} daily_hourly_data - Dataset that aggregates post counts by day-hour groups.
 * @param {Array} hour_labels - A label array that has the hour group names.
 * @returns {Chart} Chart.js chart.
 */
function plot_daily_counts(daily_hourly_data, hour_labels) {
  let day_wise_data = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [],
  };
  let hour_index = 0;
  hour_labels.forEach((hour_label) => {
    let hour_data = [];
    day_wise_data.labels.forEach((day_label) => {
      hour_data.push(daily_hourly_data[day_label][hour_label]);
    });
    day_wise_data["datasets"].push({
      label: hour_label,
      data: hour_data,
      backgroundColor: get_chart_color(hour_index),
    });
    hour_index += 1;
  });
  let chart_daily = new Chart(document.getElementById("chart_daily"), {
    type: "bar",
    data: day_wise_data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Day-wise post counts",
        },
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Day",
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Posts",
          },
          ticks: {
            precision: 0,
            beginAtZero: true,
          },
        },
      },
    },
  });

  return chart_daily;
}

/**
 * Plots a stacked bar chart that shows the hourly post counts and posting days.
 * @param {Object} daily_hourly_data - Dataset that aggregates post counts by hour-day groups.
 * @param {Array} hour_labels - A label array that has the hour group names.
 * @returns {Chart} Chart.js chart.
 */
function plot_hourly_counts(daily_hourly_data, hour_labels) {
  let days = Object.keys(daily_hourly_data);
  let hour_wise_data = {
    labels: hour_labels,
    datasets: [],
  };

  hour_wise_data.datasets = days.map((day, index) => ({
    label: day,
    data: Object.values(daily_hourly_data[day]),
    backgroundColor: get_chart_color(index),
  }));

  let chart_hourly = new Chart(document.getElementById("chart_hourly"), {
    type: "bar",
    data: hour_wise_data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Hour-wise post counts",
        },
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Hour",
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Posts",
          },
          ticks: {
            precision: 0,
            beginAtZero: true,
          },
        },
      },
    },
  });

  return chart_hourly;
}

/**
 * Plots a bar chart that shows the tag popularities.
 * @param {Object} tag_data - Dataset that aggregates post counts by tag.
 * @returns {Chart} Chart.js chart.
 */
function plot_tag_counts(tag_data) {
  const sorted_tag_kv = Object.entries(tag_data).sort((a, b) => b[1] - a[1]);
  const sorted_tag_keys = sorted_tag_kv.map((entry) => entry[0]);
  const sorted_tag_values = sorted_tag_kv.map((entry) => entry[1]);

  let chart_tags = new Chart(document.getElementById("chart_tags"), {
    type: "bar",
    data: {
      labels: sorted_tag_keys,
      datasets: [
        {
          label: "Posts",
          data: sorted_tag_values,
          backgroundColor: Array.from(
            { length: sorted_tag_keys.length },
            (_, i) => get_chart_color(i)
          ),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Tag popularity",
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Tag",
          },
        },
        y: {
          title: {
            display: true,
            text: "Posts",
          },
          ticks: {
            precision: 0,
            beginAtZero: true,
          },
        },
      },
    },
  });

  return chart_tags;
}

/**
 * Plots a box plot that shows the waiting time distribution for posts until an instructor or a student (who later gets
 * an instructor endorsment) answers the question based on the posting day.
 * @param {Object} daily_time_to_answer_data - Dataset that aggregates waiting times by day.
 * @returns {Chart} Chart.js chart.
 */
function plot_daily_time_to_answer(daily_time_to_answer_data) {
  let canvas = document.getElementById("chart_daily_time_to_answer");
  show_element(canvas.parentNode);
  let chart_daily_time_to_answer = new Chart(canvas.getContext("2d"), {
    type: "boxplot",
    data: {
      labels: Object.keys(daily_time_to_answer_data),
      datasets: [
        {
          data: Object.values(daily_time_to_answer_data),
          borderColor: "#000000",
          backgroundColor: Array.from(
            { length: Object.keys(daily_time_to_answer_data).length },
            (_, i) => get_chart_color(i)
          ),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Time to answer depending on the posting day",
        },
        legend: {
          display: false,
        },
      },
      maxStats: "whiskerMax", // The chart does not necessarily show the outliers for efficient space use
      scales: {
        x: {
          title: {
            display: true,
            text: "Day",
          },
        },
        y: {
          title: {
            display: true,
            text: "Wait (hours)",
          },
        },
      },
    },
  });

  return chart_daily_time_to_answer;
}

/**
 * Plots a box plot that shows the waiting time distribution for posts until an instructor or a student (who later gets
 * an instructor endorsment) answers the question based on the posting hour.
 * @param {Object} hourly_time_to_answer_data - Dataset that aggregates waiting times by hour group.
 * @returns {Chart} Chart.js chart.
 */
function plot_hourly_time_to_answer(hourly_time_to_answer_data) {
  let canvas = document.getElementById("chart_hourly_time_to_answer");
  show_element(canvas.parentNode);
  let chart_hourly_time_to_answer = new Chart(canvas.getContext("2d"), {
    type: "boxplot",
    data: {
      labels: Object.keys(hourly_time_to_answer_data),
      datasets: [
        {
          data: Object.values(hourly_time_to_answer_data),
          borderColor: "#000000",
          backgroundColor: Array.from(
            { length: Object.keys(hourly_time_to_answer_data).length },
            (_, i) => get_chart_color(i)
          ),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Time to answer depending on the posting hour",
        },
        legend: {
          display: false,
        },
      },
      maxStats: "whiskerMax",
      scales: {
        x: {
          title: {
            display: true,
            text: "Hour",
          },
        },
        y: {
          title: {
            display: true,
            text: "Wait (hours)",
          },
        },
      },
    },
  });

  return chart_hourly_time_to_answer;
}

/**
 * Generates statistics and visualizations for the posts.
 * @param {boolean} ready - Indicates whether posts are ready for collection (initially set to false until the program
 *   can handle gathering the post IDs).
 */
async function generate_statistics(ready) {
  if (ready) {
    const class_name = document.getElementById(
      "topbar_current_class_number"
    ).innerText;
    
    // At the moment, hours of the day are grouped into six groups, having four hours per bar.
    const hours_per_bar = 4;
    const class_id = window.location.href
      .split("piazza.com/class/")[1]
      .split("/")[0];
    let post_ids = [
      ...document.querySelectorAll(
        'button[aria-label^="Feed Item Actions for Post"]'
      ),
    ]
      .map((element) => {
        const match = element.getAttribute("aria-label").match(/Post (\d+)/);
        return match ? match[1] : null;
      })
      .filter((id) => id !== null);
    let post_order = "descending";
    if (document.getElementById("date_to").value != "") {
      post_ids.reverse();
      post_order = "ascending";
    }
    let step = 100 / post_ids.length;
    let progress = 0;
    let percentage = 0;
    document.getElementById(
      "piazzanalytics_progress_message"
    ).innerHTML = `<span id="piazzanalytics_progress_current">0</span>/<span id="piazzanalytics_progress_max">${post_ids.length}</span>`;
    let tag_data = {};
    let daily_data = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };
    let hour_labels = generate_hour_labels(hours_per_bar);
    let hourly_data = {};
    hour_labels.forEach((label) => {
      hourly_data[label] = 0;
    });
    let daily_hourly_data = {
      Monday: { ...hourly_data },
      Tuesday: { ...hourly_data },
      Wednesday: { ...hourly_data },
      Thursday: { ...hourly_data },
      Friday: { ...hourly_data },
      Saturday: { ...hourly_data },
      Sunday: { ...hourly_data },
    };
    let history_data = {};
    let daily_time_to_answer_data = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };
    let hourly_time_to_answer_data = {};
    hour_labels.forEach((label) => {
      hourly_time_to_answer_data[label] = [];
    });
    let force_stop = false;
    for (const post_id of post_ids) {
      // Retrieves post details using the API
      fetch("https://piazza.com/logic/api?method=content.get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          Referrer: `https://piazza.com/class/${class_id}/post/${post_id}`,
          "Csrf-Token": document
            .querySelector('meta[name="csrf_token"]')
            .getAttribute("content"),
        },
        credentials: "include", // Ensures cookies are sent with the request
        body: JSON.stringify({
          method: "content.get",
          params: { cid: post_id, nid: class_id, student_view: null },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Skips posts outside the given timeframe and stop after a post's date goes out of the given timeframe
          let date = get_local_date(data.result.created);
          if (
            post_order == "ascending" &&
            document.getElementById("date_to").value != "" &&
            new Date(document.getElementById("date_to").value) < date
          ) {
            force_stop = true;
            return;
          } else if (
            post_order == "descending" &&
            document.getElementById("date_from").value != "" &&
            new Date(document.getElementById("date_from").value) > date
          ) {
            force_stop = true;
            return;
          } else if (
            (document.getElementById("date_from").value != "" &&
              new Date(document.getElementById("date_from").value) > date) ||
            (document.getElementById("date_from").value != "" &&
              new Date(document.getElementById("date_to").value) < date)
          ) {
            return;
          }

          // Skips unwanted types of posts
          if (
            (document.getElementById("post_type").value == "question" &&
              data.result.type != "question") ||
            (document.getElementById("post_type").value == "note" &&
              data.result.type != "note")
          ) {
            return;
          }

          let tags = data.result.folders;
          tags.forEach((tag) => {
            if (tag in tag_data) {
              tag_data[tag] += 1;
            } else {
              tag_data[tag] = 1;
            }
          });
          let day_name = get_day_name(date);
          daily_data[day_name] += 1;
          let hour_name = hour_labels[get_hour_index(date, hours_per_bar)];
          hourly_data[hour_name] += 1;
          daily_hourly_data[day_name][hour_name] += 1;
          let date_without_hour = new Date(date);
          date_without_hour.setHours(0, 0, 0, 0);
          let day_timestamp = date_without_hour.toISOString().split("T")[0];
          if (day_timestamp in history_data) {
            history_data[day_timestamp] += 1;
          } else {
            history_data[day_timestamp] = 1;
          }

          // If questions are not filtered out
          if (
            (document.getElementById("post_type").value == "question" ||
              document.getElementById("post_type").value == "any") &&
            data.result.type == "question"
          ) {
            let earliest_answer = null;
            // For all comments, checks if they have endorsers, and if so, checks if the endorser is an instructor
            data.result.children.forEach((comment) => {
              if (comment.type == "i_answer") {
                if (
                  earliest_answer == null ||
                  earliest_answer > comment.created
                ) {
                  earliest_answer = comment.created;
                }
              } else if ("tag_endorse" in comment) {
                comment.tag_endorse.forEach((endorsement) => {
                  if (
                    endorsement.admin == true &&
                    (earliest_answer == null ||
                      earliest_answer > comment.created)
                  ) {
                    earliest_answer = comment.created;
                  }
                });
              }
            });
            if (earliest_answer != null) {
              let earliest_answer_date = get_local_date(earliest_answer);
              let hours_to_answer =
                (earliest_answer_date.getTime() - date.getTime()) /
                (1000 * 60 * 60);
              daily_time_to_answer_data[day_name].push(hours_to_answer);
              hourly_time_to_answer_data[hour_name].push(hours_to_answer);
            }
          }
        })
        .catch((error) => console.error("Error:", error));

      progress += 1;
      percentage += step;
      if (force_stop) {
        set_bar_progress(null, 100, null);
        break;
      }
      set_bar_progress(progress, percentage, null);
      await sleep(document.getElementById("delay").value);
    }

    document.getElementById(
      "piazzanalytics_results"
    ).innerHTML = `<div class="col col-12 text-center mb-1" id="piazzanalytics_progress_message">Summarizing...</div><div class="col col-12"><div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" id="piazzanalytics_progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div></div></div>`;

    fetch(chrome.runtime.getURL("charts.html"), {
      headers: { "Content-Type": "text/html" },
    })
      .then((data) => data.text())
      .then(
        (data_text) =>
          (document.getElementById("piazzanalytics_results").innerHTML =
            data_text)
      )
      .then(() => {
        document.getElementById("piazzanalytics_report_title").innerText =
          class_name;

        if (Object.keys(history_data).length > 0) {
          plot_history(history_data);
          plot_daily_counts(daily_hourly_data, hour_labels);
          plot_hourly_counts(daily_hourly_data, hour_labels);
          plot_tag_counts(tag_data);

          if (
            document.getElementById("post_type").value == "question" ||
            document.getElementById("post_type").value == "any"
          ) {
            plot_daily_time_to_answer(daily_time_to_answer_data);
            plot_hourly_time_to_answer(hourly_time_to_answer_data);
          }
        } else {
          document.getElementById(
            "piazzanalytics_results"
          ).innerHTML = `<p>No results.</p>`;
        }

        show_element(document.getElementById("piazzanalytics_buttons"));
        hide_element(document.getElementById("piazzanalytics_generate"));
        show_element(document.getElementById("piazzanalytics_reset"));
        document
          .getElementById("piazzanalytics_reset")
          .classList.remove("d-block");
      });
  } else {
    hide_element(document.getElementById("piazzanalytics_options"));
    hide_element(document.getElementById("piazzanalytics_buttons"));
    prepare_all_posts(0);
    document.getElementById(
      "piazzanalytics_results"
    ).innerHTML = `<div class="col col-12 text-center mb-1" id="piazzanalytics_progress_message">Initializing...</div><div class="col col-12"><div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" id="piazzanalytics_progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div></div></div>`;
  }
}

/**
 * Opens the Piazzanalytics modal.
 */
function open_modal() {
  show_element(document.getElementById("piazzanalytics_modal"));
}

/**
 * Closes the Piazzanalytics modal.
 */
function close_modal() {
  hide_element(document.getElementById("piazzanalytics_modal"));
}

/**
 * Adds listeners needed for the modal to work, called after the modal code is injexted to the page.
 */
function modal_ready() {
  let close_buttons = document.getElementsByClassName("btn_modal_close");
  Array.from(close_buttons).forEach(function (elem) {
    elem.addEventListener("click", function () {
      close_modal();
    });
  });

  Array.from(document.getElementsByClassName("piazzanalytics_button")).forEach(
    function (elem) {
      elem.addEventListener("click", function () {
        open_modal();
      });
    }
  );

  document
    .getElementById("piazzanalytics_generate")
    .addEventListener("click", function () {
      generate_statistics(false);
    });

  document
    .getElementById("piazzanalytics_reset")
    .addEventListener("click", function () {
      reset_modal(true);
    });
}

/**
 * Fetches the modal code and injects it into the page.
 */
function add_modal() {
  fetch(chrome.runtime.getURL("modal.html"), {
    headers: { "Content-Type": "text/html" },
  })
    .then((data) => data.text())
    .then((data_text) =>
      document
        .getElementsByTagName("body")[0]
        .insertAdjacentHTML("afterbegin", data_text)
    )
    .then(() => {
      modal_ready();
    });
}

/**
 * Resets the modal's state.
 * @param {boolean|undefined} open - Indicates whether the modal will be opened after the reset. Otherwise, it closes.
 */
function reset_modal(open) {
  fetch(chrome.runtime.getURL("modal.html"), {
    headers: { "Content-Type": "text/html" },
  })
    .then((data) => data.text())
    .then(
      (data_text) =>
        (document.getElementById("piazzanalytics_modal").outerHTML = data_text)
    )
    .then(() => {
      modal_ready();
      if (open) {
        open_modal();
      }
    });
}

/**
 * Adds the Piazzanalytics button and relevant listeners back to the feed whenever it is expanded, which is detected
 * through click events. Otherwise, the button disappears after the feed is collapsed.
 * @param {Event} event - An click event.
 */
function collapse_button_refresh(event) {
  let element = event.target;
  if (element.innerText == "►") {
    add_feed_button();
    modal_ready();
  }
}

// Runs after the page is loaded.
window.onload = function () {
  // Piazzanalytics button should only show up in the Q & A page.
  if (window.location.href.indexOf("/class/") == -1) {
    return;
  }
  add_navbar_button();
  add_feed_button();
  add_modal();

  // Adds an event listener to clicks to detect the feed being expanded to add the button back.
  document.addEventListener("click", collapse_button_refresh);
};
