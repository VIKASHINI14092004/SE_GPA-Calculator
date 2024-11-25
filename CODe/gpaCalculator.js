// gpaCalculator.js
function calculateGPA(subjects) {
    let totalGradePoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
        totalGradePoints += subject.gradePoints;
        totalCredits += subject.credit;
    });

    return totalGradePoints / totalCredits;
}
module.exports = { calculateGPA };
