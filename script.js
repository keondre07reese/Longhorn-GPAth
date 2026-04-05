const gradePoints = {
  "A": 4.0,
  "A-": 3.67,
  "B+": 3.33,
  "B": 3.0,
  "B-": 2.67,
  "C+": 2.33,
  "C": 2.0,
  "C-": 1.67,
  "D+": 1.33,
  "D": 1.0,
  "F": 0.0
};

const coursesContainer = document.getElementById("coursesContainer");
const addCourseBtn = document.getElementById("addCourseBtn");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const errorMessage = document.getElementById("errorMessage");

function createCourseRow() {
  const courseRow = document.createElement("div");
  courseRow.classList.add("course-row");

  courseRow.innerHTML = `
    <label>Course Name</label>
    <input type="text" class="course-name" placeholder="e.g. I 301" />

    <label>Credit Hours</label>
    <input type="number" class="course-credits" step="1" min="1" placeholder="e.g. 3" />

    <label>Expected Grade</label>
    <select class="course-grade">
      <option value="">Select Grade</option>
      <option value="A">A</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B">B</option>
      <option value="B-">B-</option>
      <option value="C+">C+</option>
      <option value="C">C</option>
      <option value="C-">C-</option>
      <option value="D+">D+</option>
      <option value="D">D</option>
      <option value="F">F</option>
    </select>

    <button type="button" class="remove-course-btn">Remove Course</button>
  `;

  const removeBtn = courseRow.querySelector(".remove-course-btn");
  removeBtn.addEventListener("click", () => {
    courseRow.remove();
  });

  coursesContainer.appendChild(courseRow);
}

function calculateGPA() {
  errorMessage.textContent = "";

  const currentGPA = parseFloat(document.getElementById("currentGPA").value);
  const completedCredits = parseFloat(document.getElementById("completedCredits").value);
  const targetGPAInput = document.getElementById("targetGPA");
  const targetGPA = targetGPAInput ? parseFloat(targetGPAInput.value) : NaN;

  if (isNaN(currentGPA) || isNaN(completedCredits)) {
    errorMessage.textContent = "Please enter your current GPA and completed credit hours.";
    return;
  }

  if (currentGPA < 0 || currentGPA > 4.0) {
    errorMessage.textContent = "Please enter a current GPA between 0.00 and 4.00.";
    return;
  }

  if (completedCredits < 0) {
    errorMessage.textContent = "Completed credit hours cannot be negative.";
    return;
  }

  if (!isNaN(targetGPA) && (targetGPA < 0 || targetGPA > 4.0)) {
    errorMessage.textContent = "Please enter a target GPA between 0.00 and 4.00.";
    return;
  }

  const courseRows = document.querySelectorAll(".course-row");

  if (courseRows.length === 0) {
    errorMessage.textContent = "Please add at least one course.";
    return;
  }

  let totalSemesterQualityPoints = 0;
  let totalSemesterCredits = 0;

  for (const row of courseRows) {
    const credits = parseFloat(row.querySelector(".course-credits").value);
    const grade = row.querySelector(".course-grade").value;

    if (isNaN(credits) || !grade) {
      errorMessage.textContent = "Please fill out credit hours and expected grade for every course.";
      return;
    }

    if (credits <= 0) {
      errorMessage.textContent = "Each course must have at least 1 credit hour.";
      return;
    }

    totalSemesterCredits += credits;
    totalSemesterQualityPoints += gradePoints[grade] * credits;
  }

  const semesterGPA = totalSemesterQualityPoints / totalSemesterCredits;
  const cumulativeGPA =
    ((currentGPA * completedCredits) + totalSemesterQualityPoints) /
    (completedCredits + totalSemesterCredits);

  const gpaChange = cumulativeGPA - currentGPA;

  document.getElementById("semesterGPAResult").textContent = semesterGPA.toFixed(2);
  document.getElementById("cumulativeGPAResult").textContent = cumulativeGPA.toFixed(2);
  document.getElementById("semesterCreditsResult").textContent = totalSemesterCredits;

  let changeText = "";

  if (gpaChange > 0) {
    changeText = `an increase of ${gpaChange.toFixed(2)}`;
  } else if (gpaChange < 0) {
    changeText = `a decrease of ${Math.abs(gpaChange).toFixed(2)}`;
  } else {
    changeText = "no change";
  }

  let summaryMessage =
    `If you earn these grades, your cumulative GPA would change from ${currentGPA.toFixed(2)} to ${cumulativeGPA.toFixed(2)} — ${changeText}.`;

  if (!isNaN(targetGPA)) {
  const totalCreditsAfter = completedCredits + totalSemesterCredits;
  const requiredTotalQualityPoints = targetGPA * totalCreditsAfter;
  const currentQualityPoints = currentGPA * completedCredits;
  const neededThisSemester = requiredTotalQualityPoints - currentQualityPoints;
  const requiredSemesterGPA = neededThisSemester / totalSemesterCredits;

  if (requiredSemesterGPA > 4.0) {
    summaryMessage += ` Reaching a ${targetGPA.toFixed(2)} this semester would not be possible with the grades available.`;
  } else if (requiredSemesterGPA < 0) {
    summaryMessage += ` You have already exceeded the GPA needed to reach ${targetGPA.toFixed(2)}.`;
  } else {
    // Determine grade mix
    let gradeBreakdown = "";

    if (requiredSemesterGPA >= 3.9) {
      gradeBreakdown = "mostly all A's";
    } else if (requiredSemesterGPA >= 3.7) {
      gradeBreakdown = "mostly A's with maybe one A-";
    } else if (requiredSemesterGPA >= 3.5) {
      gradeBreakdown = "a mix of A's and A-'s";
    } else if (requiredSemesterGPA >= 3.3) {
      gradeBreakdown = "A's, A-'s, and some B+'s";
    } else if (requiredSemesterGPA >= 3.0) {
      gradeBreakdown = "mostly B+'s and A-'s";
    } else {
      gradeBreakdown = "a mix of B's and higher";
    }

    summaryMessage += ` To reach a ${targetGPA.toFixed(2)}, you would need about a ${requiredSemesterGPA.toFixed(2)} semester GPA — ${gradeBreakdown}.`;
  }
}

  document.getElementById("summaryText").textContent = summaryMessage;
}

function resetApp() {
  document.getElementById("currentGPA").value = "";
  document.getElementById("completedCredits").value = "";

  const targetGPAInput = document.getElementById("targetGPA");
  if (targetGPAInput) {
    targetGPAInput.value = "";
  }

  coursesContainer.innerHTML = "";
  errorMessage.textContent = "";
  document.getElementById("semesterGPAResult").textContent = "--";
  document.getElementById("cumulativeGPAResult").textContent = "--";
  document.getElementById("semesterCreditsResult").textContent = "--";
  document.getElementById("summaryText").textContent = "";

  createCourseRow();
}

addCourseBtn.addEventListener("click", createCourseRow);
calculateBtn.addEventListener("click", calculateGPA);
resetBtn.addEventListener("click", resetApp);

createCourseRow();