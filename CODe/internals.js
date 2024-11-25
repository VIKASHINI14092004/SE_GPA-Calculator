let regulations = {
    "2019": {
        "AI-DS": {
            "Semester 4": [
                {
                    "subject": "Optimization Techniques for AI",
                    "credit": 4
                },
                {
                    "subject": "Healthcare Analytics",
                    "credit": 3
                },
                {
                    "subject": "Principles of Artificial Intelligence",
                    "credit": 4
                },
                {
                    "subject": "Introduction to Data Analytics",
                    "credit": 4
                },
                {
                    "subject": "Database Management System",
                    "credit": 5
                }
            ]
        }
    }
};

const totalSemesterCredits = 21; // Total credits for Semester 4
const internalGPAContribution = 5; // Total internal GPA contribution out of 10

function updateCourses() {
    let regulation = document.getElementById("regulation").value;
    let courseDropdown = document.getElementById("course");

    courseDropdown.innerHTML = "";

    for (let course in regulations[regulation]) {
        let option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseDropdown.appendChild(option);
    }
    updateSemesters();
}

function updateSemesters() {
    let regulation = document.getElementById("regulation").value;
    let course = document.getElementById("course").value;
    let semesterDropdown = document.getElementById("semester");

    semesterDropdown.innerHTML = "";

    for (let semester in regulations[regulation][course]) {
        let option = document.createElement("option");
        option.value = semester;
        option.textContent = semester;
        semesterDropdown.appendChild(option);
    }
}

function goToSubjectsPage() {
    let regulation = document.getElementById("regulation").value;
    let course = document.getElementById("course").value;
    let semester = document.getElementById("semester").value;

    localStorage.setItem("selectedRegulation", regulation);
    localStorage.setItem("selectedCourse", course);
    localStorage.setItem("selectedSemester", semester);

    window.location.href = "subjects.html";
}

function populateSubjects() {
    let regulation = localStorage.getItem("selectedRegulation");
    let course = localStorage.getItem("selectedCourse");
    let semester = localStorage.getItem("selectedSemester");

    let subjects = regulations[regulation][course][semester];
    let container = document.getElementById("subjectsContainer");

    subjects.forEach((subjectObj, index) => {
        let subjectContainer = document.createElement("div");
        subjectContainer.classList.add("subject-container");

        // Subject label with credit
        let label = document.createElement("label");
        label.textContent = `${subjectObj.subject} (${subjectObj.credit} credits)`;
        subjectContainer.appendChild(label);

        // CAT and Assignment inputs (for all subjects except Soft Skills I)
        for (let i = 1; i <= 3; i++) {
            let catInput = document.createElement("input");
            catInput.type = "number";
            catInput.placeholder = `CAT ${i} Marks (out of 100)`;
            catInput.classList.add("cat-input");
            subjectContainer.appendChild(catInput);
        }

        for (let i = 1; i <= 5; i++) {
            let assignmentInput = document.createElement("input");
            assignmentInput.type = "number";
            assignmentInput.placeholder = `Assignment ${i} Marks (out of 10)`;
            assignmentInput.classList.add("assignment-input");
            subjectContainer.appendChild(assignmentInput);
        }

        // Calculate Internals Button for each subject
        let calcButton = document.createElement("button");
        calcButton.textContent = "Calculate Internals for this Subject";
        calcButton.onclick = function () {
            calculateSubjectInternal(subjectObj, subjectContainer, index);
        };
        subjectContainer.appendChild(calcButton);

        // Result display for internal contribution
        let resultDisplay = document.createElement("div");
        resultDisplay.classList.add("result-display");
        subjectContainer.appendChild(resultDisplay);

        container.appendChild(subjectContainer);
    });
}

function calculateSubjectInternal(subject, subjectContainer, index) {
    let subjectCredits = subject.credit;
    let subjectInternalContribution = (subjectCredits / totalSemesterCredits) * internalGPAContribution;

    let totalMarks = 0;
    let maxTotalMarks = 0;

    let catInputs = subjectContainer.querySelectorAll(".cat-input");
    let assignmentInputs = subjectContainer.querySelectorAll(".assignment-input");

    catInputs.forEach(input => {
        totalMarks += (Number(input.value) || 0);
    });
    maxTotalMarks += catInputs.length * 100; // 3 CATs out of 100 each

    assignmentInputs.forEach(input => {
        totalMarks += (Number(input.value) || 0);
    });
    maxTotalMarks += assignmentInputs.length * 10; // 5 assignments out of 10 each

    let scoredInternalGPA = (totalMarks / maxTotalMarks) * subjectInternalContribution;

    let resultDisplay = subjectContainer.querySelector(".result-display");
    resultDisplay.innerHTML = `
        <p>${subject.subject} is contributing ${subjectInternalContribution.toFixed(2)} points to your total internal GPA of ${internalGPAContribution}.</p>
        <p>In this contribution, you have scored approximately ${scoredInternalGPA.toFixed(2)} points based on your marks.</p>
    `;
}

function calculateGPA() {
    let subjects = regulations[localStorage.getItem("selectedRegulation")][localStorage.getItem("selectedCourse")][localStorage.getItem("selectedSemester")];
    let totalGradePoints = 0;
    let totalCredits = 0;

    let subjectDivs = document.getElementById("subjectsContainer").children;
    Array.from(subjectDivs).forEach((subjectDiv, index) => {
        let subject = subjects[index];
        let gradePoints = 0;

        let catInputs = subjectDiv.querySelectorAll(".cat-input");
        let assignmentInputs = subjectDiv.querySelectorAll(".assignment-input");

        let totalCatMarks = 0;
        catInputs.forEach(input => {
            totalCatMarks += Number(input.value) || 0;
        });

        let totalAssignmentMarks = 0;
        assignmentInputs.forEach(input => {
            totalAssignmentMarks += Number(input.value) || 0;
        });

        let totalInternal = (totalCatMarks / 3) * 0.4 + (totalAssignmentMarks / 5) * 0.6;
        gradePoints = totalInternal * subject.credit;

        totalGradePoints += gradePoints;
        totalCredits += subject.credit;
    });

    let gpa = totalGradePoints / totalCredits;
    let ele = document.getElementById("result");
    ele.innerHTML = `<span>Your GPA:</span> ${gpa.toFixed(3)}`;
    ele.scrollIntoView();
}

// Initialize dropdowns and populate subjects
if (window.location.pathname.includes("internals")) {
    updateCourses();
}
if (window.location.pathname.includes("subjects.html")) {
    populateSubjects();
}
