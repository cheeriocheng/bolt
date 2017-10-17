// get all data in form and return object
function getFormData() {
  var elements = document.getElementById("nl-form").elements; // all form elements
  var fields = Object.keys(elements).map(function(k) {
    if(elements[k].name !== undefined) {
      return elements[k].name;
      // special case for Edge's html collection
    }else if(elements[k].length > 0){
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  console.log("everything is fine");
  fields.forEach(function(k){
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
    // it to be appended to for each item in the loop
    if(elements[k].type === "checkbox"){ // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append 
      // the current checked value to 
      // the end of it, along with 
      // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space 
      // from the  string to make the output 
      // prettier in the spreadsheet
    }else if(elements[k].length){
      for(var i = 0; i < elements[k].length; i++){
        if(elements[k].item(i).checked){
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });
  console.log(data);
  return data;
}

// for reference:
// https://stackoverflow.com/questions/26193702/three-js-how-can-i-make-a-2d-snapshot-of-a-scene-as-a-jpg-image
function saveFile(strData, filename) {
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link); //Firefox requires the link to be in the body
    link.download = filename;
    link.href = strData;
    link.click();
    document.body.removeChild(link); //remove the link when done
  } else {
    location.replace(uri);
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  getImageData = true;
  render();
  saveFile(imgData, "bolt");
  // we are submitting via xhr below
  // var data = getFormData();
  // var url = event.target.action;
  // var xhr = new XMLHttpRequest();
  // xhr.open('POST', url, false);
  // // xhr.withCredentials = true;
  // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // xhr.onreadystatechange = function() {
  //     console.log( xhr.status, xhr.statusText );
  //     console.log(xhr.responseText);
  //     $('#nl-form')[0].reset();
  //     return;
  // }
  // // url encode form data for sending as post data
  // var encoded = Object.keys(data).map(function(k) {
  //     return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
  // }).join('&');
  // xhr.send(encoded,"actionCode=2");
  // var superpower = $( '#superpowers ul li.selected a' );
  // var location = $( '#locations ul li.selected a' );
  // if(superpower.attr("class") == "jobDepartmentCode") {
  //     window.location=`https://careers.walmart.com/results?q=*&jobDepartmentCode=${ $( superpower ).attr("id")}&sort=rank&jobState=${$( location ).attr("id")}`;
  // } else {
  //     window.location=`https://careers.walmart.com/results?q=${$( superpower ).attr("id")}&sort=rank&jobState=${$( location ).attr("id")}`;
  // }
}

jQuery(document).ready(function loaded() {
  console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  var form = document.getElementById('nl-form');
  form.addEventListener("submit", handleFormSubmit, false);
});
