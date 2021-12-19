import React, { useState, useEffect  } from 'react';
import axios from 'axios';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchTag, setSearchTag] = useState("");

  //Fetch students from API
  useEffect(() => {
    axios.get(`https://api.hatchways.io/assessment/students`)
    .then(res => {
        const students = res.data.students;
        setStudents(students);
      });
  }, []);

  //Calculate average score
  function avg(grades){
    var sum = 0;
    for(let i = 0; i < grades.length; i++ ){
        sum += parseInt(grades[i]);
    }
    var avg = sum/grades.length;

    return avg;
  }

  //Handle tag input submit
  function addTag(e){
    let studentIndex = e.target.inputID.value - 1;

    // Make copies of the state array an the target student
    let newArr = [...students];
    let newData = newArr[studentIndex];

    // Create new tags property if the student currently has no tags
    // Push the tag input to the exisiting tags array
    if(newData.hasOwnProperty("tags")){
      newData.tags.push(e.target.tagName.value);
    } else {
      newData.tags = [];
      newData.tags.push(e.target.tagName.value);
    }

     newArr[studentIndex] = newData;
     setStudents(newArr);
     e.preventDefault();
  }


  //Display each student properties
  const studentRows = students
      // eslint-disable-next-line
      .filter((student) => {
        if(searchName !== ""){
          let fullName = student.firstName + student.lastName;

          if (fullName.toLowerCase().includes(searchName.toLowerCase())){
            return student
          }
        } else {
          return student;
        }
      })
      // eslint-disable-next-line
      .filter((student) =>{
        if(searchTag !== ""){
          //Only check if the student has tags
          if(student.hasOwnProperty("tags")){
            for( let i = 0; i < student.tags.length; i++){
              if(student.tags[i].toLowerCase().includes(searchTag.toLowerCase())){
                return student;
              }
            }
          }
        } else {
          return student;
        }
      })
      .map((student) =>
        <div className="row border-bottom pt-3 pb-3" key={student.id}>
            <div className="col-3 ps-1">
              <img src={student.pic} className="rounded-circle border border-dark mx-auto d-block w-75" alt="Student pic" />
            </div>
            <div className="col-8">
              <h1 className="name row text-uppercase">{student.firstName} {student.lastName}</h1>
              <div className="row ps-3">
                <div className="row">Email: {student.email}</div>
                <div className="row">Company: {student.company}</div>
                <div className="row">Skill: {student.skill}</div>
                <div className="row">Average: {avg(student.grades)}%</div>
                <div className="collapse pt-2" id={student.id}>
                    {student.grades.map((grade, index) =>
                      <div key={index} className="row">{"Test " + (index + 1) + ": " + grade}</div>
                    )}
                </div>

                <div className="row">
                  {student.hasOwnProperty("tags") ? (
                    student.tags.map((tag, index) =>
                      <div key={index} className="col-2 btn btn-secondary mt-2 me-1" disabled>{tag}</div>
                    )
                  ) : (
                    null
                  )}

                </div>

                <div className="row ps-0 mt-3">
                  <div className="col-5 ps-0">
                    <form onSubmit={e => addTag(e)}>
                      <div className="form-group">
                            <input type="text" className="form-control sticky-top border-0 border-bottom rounded-0" name="tagName" id="tagName" placeholder="Add a tag.."/>
                            <input type="hidden" id="inputID" name="inputID" value={student.id} />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-1">
              <button className="btn btn-light border border-dark" type="button" data-toggle="collapse" data-target={"#" + student.id} aria-expanded="false" aria-controls="collapseExample">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
              </button>
            </div>
        </div>
      );

    return (
      <div className="wrapper">
        <div className="students rounded border border-dark position-absolute">
          <div className="row sticky-top ps-3 pe-3">
            <input type="text" className="form-control form-control-lg border-0 border-bottom rounded-0" id="searchName" placeholder="Search by name.." value={searchName} required onChange={e => setSearchName( e.target.value )}/>
            <input type="text" className="form-control form-control-lg border-0 border-bottom rounded-0" id="searchTag" placeholder="Search by tag.." value={searchTag} required onChange={e => setSearchTag( e.target.value )}/>
          </div>
          <div id="studentDisplay">
          {studentRows}
          </div>
        </div>
      </div>
    );
};

export default StudentList;
