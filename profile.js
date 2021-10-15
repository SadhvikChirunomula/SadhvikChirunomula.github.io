//MY WORKS SLIDER
var slideIndex = 1;
showSlides(slideIndex);
function plusSlides(n) {
showSlides(slideIndex += n);
}
function currentSlide(n) {
showSlides(slideIndex = n);
}
function showSlides(n) {
var i;
var slides = document.getElementsByClassName("mySlides");
var dots = document.getElementsByClassName("dot");
if (n > slides.length) {slideIndex = 1}    
if (n < 1) {slideIndex = slides.length}
for (i = 0; i < slides.length; i++) {
slides[i].style.display = "none";  
}
for (i = 0; i < dots.length; i++) {
dots[i].className = dots[i].className.replace(" active", "");
}
slides[slideIndex-1].style.display = "block";  
dots[slideIndex-1].className += " active";
}




//NAVIGATION
var count=0;
function opennav(){
if(count==0){
document.getElementById("nav").style.height="260px";
document.getElementById("icon").style.color="#3399ff";
document.getElementById("nav").style.borderRadius="0px";
count++;
}else{
document.getElementById("nav").style.height="45px";
document.getElementById("icon").style.color="#000";
document.getElementById("nav").style.borderRadius="40px";
count=0;
}
}








//CONTACT FORM
function validate(){
var a=document.getElementById("name");
var b=document.getElementById("email");
var c=document.getElementById("message");
var popup=document.getElementById("snackbar");
var popup2=document.getElementById("snackbar2");
if(a.value=="" || b.value=="" ||c.value==""){
popup.innerHTML="<i class='fa fa-exclamation-circle'></i> All fields are mandatory";
mySnackbar();
return 1;
}
else{
var url = "contactform.php"; 
$.ajax({
type: "POST",
url: url,
data: $("#contactform").serialize(),
success: function(data)
{   
if(data!="success"){
popup.innerHTML="<i class='fa fa-exclamation-circle'></i> Successfull";
mySnackbar();
return 1;
}else{
popup2.innerHTML="<i class='fa fa-check-circle-o'></i> "+data;
mySnackbar2();
return 1;
}}
}); 
return false;
}
}







//POPUP
function mySnackbar() {
var x = document.getElementById("snackbar");
x.className = "show";
setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
function mySnackbar2() {
var x = document.getElementById("snackbar2");
x.className = "show";
setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}