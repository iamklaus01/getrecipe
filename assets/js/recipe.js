//Variables
let apiKey = "0c0852749af149d9bbd9d8bd403d298d";
let src = " ";
let mealInfos = [];
let l = mealInfos.length;
let mealTotal = [];
let meal = " ";
let id=0;
let position = 1;
let showAll = "first";
let loading = true;

//Selectors
const complexSearch = document.querySelector(".headers a");
const searchBtn = document.querySelector(".search button");
let seeMore = document.querySelector(".btn-primary");
let resBox = document.querySelector(".result-box");
let resBox1 = document.querySelector(".card");
let img_to_print = document.querySelector(".print-content img");
const goLeft = document.querySelector(".left");
const goRight = document.querySelector(".right");
const goBack = document.querySelector(".btn-dark");
const getCard = document.querySelector(".toPrint")
let liste = document.querySelector("ul");
let element = document.createElement("li");

//Listeners
searchBtn.addEventListener("click" , getInfo);
seeMore.addEventListener("click" , seemore);
goLeft.addEventListener("click" , go_back);
goRight.addEventListener("click" , goAhead);
goBack.addEventListener("click" , play_back);
getCard.addEventListener("click" , get_card);
complexSearch.addEventListener("click" , (e)=>{
	e.preventDefault();
	show_message(4);
});
document.querySelector(".searchTerm").addEventListener("keyup" , (e)=>{
	if(e.keyCode == 13)
		searchBtn.click();
});
$(".print-content img").on('load', ()=>{
	$(".spinner-content").css("display" , "none");
	window.print();
});

//functions
function getInfo(e){
	if(resBox.classList.contains("show")){
		resBox.classList.remove("show");
	}
	meal = document.querySelector(".searchTerm").value;
	showAll = "first";
	position=1;
	get1();
	resBox1.style.display="block";
}
function seemore(e){
	e.preventDefault();
	resBox1.style.display="none";
	goLeft.classList.remove("appear");
	goRight.classList.remove("appear");
	showAll = "second";
	resBox.classList.add("show");
	document.querySelector(".set-of-button").classList.add("not-hidden");
	get2(); 
}
function get1(){
	fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${meal}`)
	.then(function(res){
		if(res.ok){
			return res.json();
		}
	})
	.then(function(value){
		console.log(value.results);
		mealInfos = value.results;
		l=mealInfos.length;
		if(l>1){
			goRight.classList.add("appear");
		}
		putIn();
	})
	.catch(function(err){
		show_message(1);
	});
}
function get2(){
	fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`)
	.then(function(response){
		if(response.ok){
			return response.json();
		}
	})
	.then(function(value){
		console.log(value);
		mealTotal=value;
		putIn();
	})
	.catch(function(err){
		show_message(1);
	});
}
function get3(){
	fetch(`https://api.spoonacular.com/recipes/${id}/card?apiKey=${apiKey}`)
	.then(response =>{
		if(response.ok) 
			return response.json();
	})
	.then(value =>{
		src = value.url;
		if(src != undefined){
			console.log(src)
			document.querySelector(".weglot-container").classList.add("d-print-none");
			document.querySelector(".print-content img").src = src;
			$(".spinner-content").css("display" , "block");
		}else{
			show_message(2);
		}
	})
	.catch(err =>{
		show_message(1);
	})
}
function goAhead(e){
	position++;
    if(l == position){
        goRight.classList.remove("appear");
    }
	putIn();
    goLeft.classList.add("appear");
    
}
function go_back(e){
	position--;
    if(position==1){
        goLeft.classList.remove("appear");
    }
	putIn();
	goRight.classList.add("appear");
}
function play_back(e){
	showAll = "first";
	resBox.classList.remove("show");
	document.querySelector(".set-of-button").classList.remove("not-hidden");
	resBox1.style.display = "block";
	if(position == 1){
		goRight.classList.add("appear");
	}else if(position < l){
		goRight.classList.add("appear");
		goLeft.classList.add("appear");
	}else{
		goLeft.classList.add("appear");
	}
	putIn();
}
function get_card(e){
	get3();
	play_back();
}
function show_message(n){
	switch (n) {
		case 1:{
			$(".modal-title").text("An Error is occured");
			$(".modal-body").text("An error occurred during data recovery. Please try again later.");
			break;
		}
		case 2:{
			$(".modal-title").text("An Error is occured");
			$(".modal-body").text("This recipe's card is no available.");
			break;
		}
		case 3:{
			$(".modal-title").text("No Matches");
			$(".modal-body").text("No matches were found between the meal name entered and the recipes database.");
			break;
		}
		case 4:{
			$(".modal-title").text("Admin");
			$(".modal-body").text("This feature is under development");
			break;
		}
		default:
			break;
	}
	$(".btn-hidden").css("pointer-events" , "all");
	$(".btn-hidden").trigger("click");
	$(".btn-hidden").css("pointer-events" , "none");
}
function putIn(){
	if(mealInfos.length > 0){
		switch (showAll) {
			case "first":{
				id = mealInfos[position-1].id;
				document.querySelector(".card-img-top").setAttribute("src" , mealInfos[position-1].image);
				document.querySelector(".card-title").innerText=mealInfos[position-1].title;
				break;
			}
			case "second":{
				document.querySelector(".card-img-top-2").setAttribute("src" , mealTotal.image);
				document.querySelector(".card-title-2").innerText=mealTotal.title;
				document.querySelector(".duration span.data").innerText=mealTotal.readyInMinutes;
				document.querySelector(".servings span.data").innerText=mealTotal.servings;
				document.querySelector(".healthScore span.data").innerText=mealTotal.healthScore;
				document.querySelector(".url a").setAttribute("href" , mealTotal.sourceUrl);
				liste.innerHTML='';
				for(let i of mealTotal.extendedIngredients){
					element.innerText=i.original;
					liste.appendChild(element);
					element=document.createElement("li")
				}
				break;
			}
			case "third":{

				break;
			}
			default:
				break;
		}
		
	}else{
		show_message(3);
	}

}
    Weglot.initialize({
        api_key: 'wg_263cf3110af8f6ccc0d4919327fd5a324'
    });