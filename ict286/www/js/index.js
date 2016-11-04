var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
		this.slideIndex = 0;
		this.quoteIndex = 0;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		app.carousel();
		app.showBookOfWk(11111111);
		app.showRecentBooks();
		app.displayQuotes();
		app.loadPage();
    },
	carousel: function () {
		var i;
		var x = document.getElementsByClassName("coInfo");
		
		console.log(x.length);
		console.log(x);
		console.log(x[0]);
		
		for (i = 0; i < x.length; i++) {
		  x[i].style.display = "none"; 
		  console.log("checking elements " + x[i]);
		}
		this.slideIndex++;
		if (this.slideIndex > x.length) {this.slideIndex = 1} 
		var temp = x[this.slideIndex-1];
		console.log(temp)
		temp.style.display = "block"; 
		setTimeout(this.carousel, 3000); // Change image every 3 seconds
	},

	//to make div's visibile/hidden
	loadPage: function(page) {
		//finding old div's id
		var oldDiv = document.getElementsByClassName("active");
		var oldDivID = oldDiv[0].getAttribute("id") + "-page";
		
		//make old div invisible
		document.getElementById(oldDivID).style.display = "none";
		//incase it's the book-page
		document.getElementById("book-page").style.display = "none";
		//incase purchase page
		document.getElementById("purchase-page").style.display = "none";

		//run particular scripts
		if(page=="tradeIn-page")
			app.getTradeInRequest(sessionStorage.id, "",  "ti-past", "customer");
		
		//make this div visible
		thisdiv = document.getElementById(page);
		thisdiv.style.display = "block";
			
		//need to take -page off the end to updateActive
		page= page.slice(0, -5);
		app.updateActive(page);
	},

	//to change the background color of navbar link to be current page
	updateActive: function (current) {
		var oldPg = document.getElementsByClassName("active");
		var oldPgId = oldPg[0].getAttribute("id");
		var curPg = document.getElementById(current);
		
		document.getElementById(oldPgId).removeAttribute("class");
		curPg.setAttribute("class", "active");
	}, 
	
	showBookOfWk: function (bookID) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200){
				var result = xhr.responseText;
				
				document.getElementById("bookOfWk").innerHTML = "<h1>Book of the Week</h1>" + result;
			}
		}
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/getBook.php?bookID=" + bookID, true);
		xhr.send();
	},

	showRecentBooks: function () {
		var date = new Date(); //today's date
			
		//convert date to string for sql
		var dM = date.getMonth() + 1;
		var dateSQL = date.getFullYear() +"-"+ dM +"-" + date.getDate();
				
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var result = xhr.responseText;
				
				document.getElementById("recentBooks").innerHTML = "<h1>Recently Added Books</h1>"+result;
				delete date;
			}
		}
		xhr.open("GET", "assignment2/php/getRecentBk.php?date=" + dateSQL, true);
		xhr.send();
	},

	displayQuotes: function () {
		var i;
		var x = document.getElementsByClassName("aQuote");
		for (i = 0; i < x.length; i++) {
		  x[i].style.display = "none"; 
		}
		this.quoteIndex++;
		if (this.quoteIndex > x.length) {this.quoteIndex = 1} 
		x[(this.quoteIndex-1)].style.display = "block"; 
		setTimeout(this.displayQuotes, 10000); // Change image every 10 seconds
	}
};

app.initialize();

//global array for cart
var Cart = [];

//for banner
var banner = {
	
};

//***** start functions for home page *****
var homepage = {
	
};
//***** end functions for home page *****

//***** start functions for book-page *****
var bookpage = {
	getBookDetail: function (bookID) {
		//finding old div's id
		var oldDiv = document.getElementsByClassName("active");
		var oldDivID = oldDiv[0].getAttribute("id") + "-page";
		
		//make old div invisible
		document.getElementById(oldDivID).style.display = "none";
		//need to make a backBtn to oldDivID
		var backBtn = "<button type='button' onclick='javascript:loadPage(\""+oldDivID+"\")'>Continue Browsing</button>";
		
		//make this div visible
		document.getElementById("book-page").style.display = "block";
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var result = xhr.responseText;
				
				document.getElementById("book-page").innerHTML = result + backBtn;
			}
		}
		xhr.open("GET", "php/getBookDetail.php?bookID=" + bookID, true);
		xhr.send();
	}
};
//***** end functions for book-page *****

//***** start functions for account page *****		
var accountpage = {
	getAccountDetailsByStored: function () {		
		var username = sessionStorage.username;  		
		var id = sessionStorage.id;  		
				
		console.log("username = "+username);		
		console.log("id = "+id);		
				
	getAccountInfo(username, id);		
	},
		
	getAccountInfo: function (cUsername, cId) {		
		var username = cUsername; // customer username		
		var id = cId;  //customer id		
				
		console.log("username = "+username);		
		console.log("id = "+id);		
				
		var xhr= new XMLHttpRequest();		
		xhr.onreadystatechange = function () {		
			if(xhr.readyState == 4 && xhr.status == 200) {		
				var result = xhr.responseText.split("^");		
						
				document.getElementById("accDetails").innerHTML = result[0];		
				document.getElementById("aWelcome").innerHTML = result[1];		
				sessionStorage.forChecking = result[2];		
						
				console.log("forchecking "+result[2]);		
						
				sessionStorage.balance = result[3];		
						
				console.log("balance "+result[3]);		
					
			}		
		}		
		xhr.open("GET", "php/getAccountDetails.php?username="+username+"&id="+id, true);		
		xhr.send();		
	},
		
	validateAccDetsChange: function (formObj) {		
		var st = formObj[0].value;		
		var sub = formObj[1].value;		
		var state = formObj[2].value;		
		var pc = formObj[3].value;		
		var ph = formObj[4].value;		
		var e = formObj[5].value;		
				
		console.log("validating Account Details change ");		
			
		//if any null discontinue		
		if(st==""||sub==""||state==""||pc==""||ph==""||e=="")		
		{		
			alert("All fields must be complete");		
		}		
		else {		
			updateAccountDetails(sessionStorage.username, st, sub, state, pc, ph, e);		
		}		
	},
			
	updateAccountDetails: function (username, st, sub, state, pc, ph, e) {		
					
		var xhr= new XMLHttpRequest();		
			
		xhr.onreadystatechange = function () {		
			if(xhr.readyState == 4 && xhr.status == 200) {		
				var result = xhr.responseText;		
						
				console.log(result);		
				document.getElementById("accUpdated").innerHTML = result;		
			}		
		}		
				
		xhr.open("GET", "php/updateAccountDetails.php?username="+username+"&st="+st+"&sub="+sub+"&state="+state+"&pc="+pc+"&ph="+ph+"&e="+e, true);		
		xhr.send();		
	},
			
	validatePasswordChange: function (formObj) {		
		var oPW = formObj[0].value;		
		var nPW = formObj[1].value;		
		var nPWA = formObj[2].value;		
				
		console.log(formObj);		
		console.log(formObj[0].value);		
		console.log(formObj[1].value);		
		console.log(formObj[2].value);		
			
		console.log("will be comparing "+oPW+" to "+sessionStorage.forChecking);		
				
		if(oPW != sessionStorage.forChecking)		
		{		
			alert("If you have forgotten your password please contact our friendly staff during office hours");		
		}		
		else if (nPW==oPW) //failed attempt		
		{		
			alert("Please choose a new password");		
		}		
		else if (nPW != nPWA) 		
		{		
			alert("Please make sure the two new passwords are the same");		
		}		
		else //success, update db		
		{		
			updatePWD(nPW);		
		}		
				
	},
		
	updatePWD: function (nPwd) {		
		var nPwd = nPwd;		
				
		var xhr= new XMLHttpRequest();		
		xhr.onreadystatechange = function () {		
			if(xhr.readyState == 4 && xhr.status == 200) {		
			var result = xhr.responseText;		
					
			document.getElementById("passwordChange").innerHTML = result;		
			}		
		}		
		xhr.open("GET", "php/updatePwd.php?nPwd="+nPwd+"&username="+sessionStorage.username, true);		
		xhr.send();		
	},

	customerSearch: function (csUN, csLN, csPH) {
		var username = csUN;
		var lastname = csLN;
		var phone = csPH;
		
		var xhr= new XMLHttpRequest();		
		xhr.onreadystatechange = function () {		
			if(xhr.readyState == 4 && xhr.status == 200) {		
				var result = xhr.responseText.split('^');		
				
				console.log("customer search accDets = "+result[0]);
				console.log("customer search UN = "+result[1]);
				console.log("customer search id = "+result[2]);
				
				if (result != "no result")
				{
					document.getElementById("accDetails").innerHTML = result[0];
					
					if(!(typeof result[1] === "undefined"))
					{
					sessionStorage.thisCustUN = result[1];
					sessionStorage.thisCustID = result[2];
					document.getElementById("updateCB").style.display="block";
					}
				}
				else 
				{
					document.getElementById("aWelcome").innerHTML = "<p>There were no results for your search.</p>";
					document.getElementById("accDetails").innerHTML = "";
					
				}	
			}	
		}		
		xhr.open("GET", "php/customerSearch.php?username="+username+"&lastname="+lastname+"&phone="+phone, true);		
		xhr.send();	
	},

	updateCredit: function (newCredBal) {
		var newCB = newCredBal;
		
		console.log("update credit, new credit is "+newCB);
		
		if (newCB >20 || newCB < -10)
		{
			alert("Those values are beyond the accepted limits");
		}
		else 
		{
			var xhr= new XMLHttpRequest();		
			xhr.onreadystatechange = function () {		
				if(xhr.readyState == 4 && xhr.status == 200) {		
					var result = xhr.responseText;		
					
					console.log("customer update bal = "+result);
									
					document.getElementById("newBal").innerHTML = result;
					
						
				}	
			}		
			xhr.open("GET", "php/updateBalance.php?username="+sessionStorage.thisCustUN+"&id="+sessionStorage.thisCustID+"&newBal="+newCB, true);		
			xhr.send();	
		}
	}
};
//***** end functions for account page *****		
		
//***** start functions for cart *****

//checks to see if book is in stock.
//if yes, add to and update cart count, else display error message
function addCart(bookID){
	//check that book is in stock
	var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if(xhr.readyState == 4 && xhr.status == 200) {
                        var result = xhr.responseText;

			//add book to cart if in stock
			if(result == "inStock") {
				 console.log("Book added");

			        //make sure bookID is integer
			        var number = parseInt(bookID);

			        //add book to cart if not already in there
			        if(Cart.indexOf(number) == -1)
                			Cart.push(number);

        			//get number of books in cart and display in header
        			var num = Cart.length;

        			if(Cart.length == 0) {
        			        document.getElementById("cart").innerHTML = "Cart";
        			}
        			else {
        			        document.getElementById("cart").innerHTML = "Cart (" + num + ")";
        			}
			}
			//display error message if out of stock
			else {
				console.log("out of stock");
				alert("Book is currently out of stock. We apologize for the inconvenience");
			}
                }
        }
        xhr.open("GET", "php/inStock.php?bookID=" + bookID, true);
        xhr.send();
}

function clearCart() {
	//clear cart count on screen
	document.getElementById("cart").innerHTML = "Cart";

	//reduce book quantity by 1 for each book in cart
	var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if(xhr.readyState == 4 && xhr.status == 200) {
		}
	}
	xhr.open("GET", "php/bookSold.php?Cart=" + JSON.stringify(Cart), true);
        xhr.send();

	//clear the cart
	while(Cart.length)
		Cart.pop();
}

function remove(bookID) {
	//make sure bookID is an integer
	var number = parseInt(bookID);
	
	//find index of book to remove, remove it
	var index = Cart.indexOf(number);
	Cart.splice(index, 1);
	
	//get number of books in cart and display in header
        var num = Cart.length;

        if(Cart.length == 0) {
                document.getElementById("cart").innerHTML = "Cart";
        }
        else {
                document.getElementById("cart").innerHTML = "Cart (" + num + ")";
        }
	
	//redisplay the cart
	displayCart();
}

function displayCart() {
	console.log("Viewing cart");

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if(xhr.readyState == 4 && xhr.status == 200) {
                        var result = xhr.responseText;
			document.getElementById("showCart").innerHTML = result;
		}
	}
	xhr.open("GET", "php/showCart.php?Cart=" + JSON.stringify(Cart), true);
        xhr.send();
}

//checks that user is logged in as a customer
function checkLogin(total){
	var name = sessionStorage.user;

	//if not customer, move to login screen
	if(name == "customer")
		checkout(total);
	else{
		alert("Please login as a Customer to continue with your purchase.");

		//make cart invisible
                document.getElementById("cart-page").style.display = "none";

                //navigate to home page
                document.getElementById("LIR-page").style.display = "block";
                updateActive("LIR");
	}
}

//shows checkout/purchase page
function checkout(totalPrice) {
	//remove any previous notifications
        document.getElementById("payError").innerHTML = "";

	//finding old div's id
        var oldDiv = document.getElementsByClassName("active");
        var oldDivID = oldDiv[0].getAttribute("id") + "-page";
        //make old div invisible
        document.getElementById(oldDivID).style.display = "none";

        //make this div visible
	document.getElementById("purchase-page").style.display = "block";
	
	document.getElementById("payForm").innerHTML = "Total price = $" + totalPrice;
}

//handles the payment form
//checks for correct input before processing
function purchase() {
	var error = "Error!<br />"
	var err;
	var success = "Payment Successful!";

	//ensure a card has been selected
	var card = document.getElementById("purchasing").method;
	var cardSelect;

	for (var i=0;i<card.length; i++) {
		if (card[i].checked) {
			cardSelect = card[i].value;
			break;
		}
	} 

	//add to error message if card not selected
	if(cardSelect == undefined){
		err = "Please select a Payment Method <br />";
		error = error.concat(err);
	}

	//check all text fields
	var fname = document.getElementById("purchasing").fName.value;
	var lname = document.getElementById("purchasing").lName.value;

	if(fname.length == 0){
		err = "Please input a First Name <br />";
                error = error.concat(err);
	}
	if(lname.length == 0){
		err = "Please input a Last Name <br />";
                error = error.concat(err);
        }

	//check card details (crad must = 16 digits, CVV must = 3 digits)
	var card = document.getElementById("purchasing").cardNum.value;
        var cvv = document.getElementById("purchasing").cvv.value;
	if(card.toString().length !== 16) {
		err = "Please input a valid Card Number <br />";
                error = error.concat(err);
	}
	if(cvv.toString().length !== 3){
		err = "Please input a valid CVV <br />";
                error = error.concat(err);
	}	

	//expiration must be => current date
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	var index;
	var cardDay = document.getElementById("purchasing").expDay;
	var cardMonth = document.getElementById("purchasing").expMonth;
	var cardYear = document.getElementById("purchasing").expYear;

	index = cardYear.selectedIndex;
	var y = cardYear.options[index].text;
	if(y > year){}//do nothing
	else{
		index = cardMonth.selectedIndex;
                if(index > month+1) {}//do nothing
                else {
			index = cardDay.selectedIndex;
                        if(index < day-1){
                                err = "Please input a valid expiration date <br />";
                                error = error.concat(err);
                        }
                }
	}

	//show errors or success message and navigate back to home page
	if(error.length > 12)//initial size of error
		document.getElementById("payError").innerHTML = error;
	else{
		alert(success);

		//call function to remove 1 quantity of each book just purchased, and clear cart
		clearCart();

		//clear form for next time
		document.getElementById("purchasing").reset();

	        //make old div invisible
	        document.getElementById("purchase-page").style.display = "none";

	        //navigate to home page after delay
	        document.getElementById("home-page").style.display = "block";
		updateActive("home");
	}
}

//register to site
function register() {
	var error = "Error!<br />"
        var err;

	//ensure all required fields have input
	var username = document.getElementById("register").regUsername.value;
	var pw = document.getElementById("register").regPassword.value;
	var fn = document.getElementById("register").fname.value;
	var ln = document.getElementById("register").lname.value;
	var str = document.getElementById("register").street.value;
	var sub = document.getElementById("register").suburb.value;
	var sta = document.getElementById("register").state.value;
	var pc = document.getElementById("register").postcode.value;
	var em = document.getElementById("register").email.value;
        var ph = document.getElementById("register").phone.value;

	if(username.length == 0){
                err = "Please input a Username <br />";
                error = error.concat(err);
        }
	if(pw.length == 0){
                err = "Please input a Password <br />";
                error = error.concat(err);
        }
	if(fn.length == 0){
                err = "Please input a First Name <br />";
                error = error.concat(err);
        }
	if(ln.length == 0){
                err = "Please input a Last Name <br />";
                error = error.concat(err);
        }
	if(str.length == 0){
                err = "Please input a Street <br />";
                error = error.concat(err);
        }
	if(sub.length == 0){
                err = "Please input a Suburb <br />";
                error = error.concat(err);
        }
	if(sta.length == 0){
                err = "Please input a State <br />";
                error = error.concat(err);
        }
	if(pc.length == 0){
                err = "Please input a Postcode <br />";
                error = error.concat(err);
        }

	//display errors OR send data to database
	if(error.length > 12)//initial size of error
                document.getElementById("regFail").innerHTML = error;
        else{
		data = "un="+username+"&pw="+pw+"&fn="+fn+"&ln="+ln+"&str="+str+"&sub="+sub+"&sta="+sta+"&pc="+pc+"&em="+em+"&ph="+ph;
		var xhr = new XMLHttpRequest();
        	xhr.onreadystatechange = function () {
                	if(xhr.readyState == 4 && xhr.status == 200) {
				var result = xhr.responseText;
				
				if(result == "taken")
					document.getElementById("regFail").innerHTML = "Error!<br /> Username taken, please choose another one";
				else
					document.getElementById("regFail").innerHTML = result;
			}
		}
		xhr.open("POST", "php/register.php", true);
	
		//Send the proper header information along with the request
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
		xhr.send(data);
	}
}

//login as a staff or customer
function login(username, password) {
	var staffMember = "staff";
	var cust = "customer";	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if(xhr.readyState == 4 && xhr.status == 200) {
			var result = xhr.responseText;
			//display error if incorrect data
			document.getElementById("logFail").innerHTML = "Incorrect Username or Password.";
			
			//return user (customer or staff), username, and ID
			var comma = result.search(",");
			var user = result.substr(0,comma);
			var id = result.substr(comma+1, 8);
			var name = result.substr(comma+10);

			//set session storage
			sessionStorage.setItem('username', name);
			sessionStorage.setItem('id', id);

			//signed in as a customer
			if(user == "customer"){
				document.getElementById("logFail").innerHTML = "Successfully logged in as Customer.";
				console.log("in user if statement");
                		//navbar button visibility
                		document.getElementById("tradeIn").style.display="block";
        		        document.getElementById("account").style.display="block";
				document.getElementById("LO").style.display="block";
		                document.getElementById("LIR").style.display="none";
	
				sessionStorage.setItem('user', user);
						
				//page functions & visibility
				//accounts page
				getAccountDetailsByStored();
			}
			//signed in as a staff member
			if(user == "staff"){
				document.getElementById("logFail").innerHTML = "Successfully logged in as Staff.";
				console.log("in staff if statement");
                                
				//navbar button visibility
                                document.getElementById("tradeIn").style.display="block";
                                document.getElementById("AED").style.display="block";
                                document.getElementById("account").style.display="block";
				document.getElementById("LO").style.display="block";
                                document.getElementById("LIR").style.display="none";

				sessionStorage.setItem('user', user);

                                //page parts visibility (add staff elements to account & trade in pages)
								//accounts page
								document.getElementById("accSearch").style.display="block";
								document.getElementById("passwordChange").style.display="none";
								document.getElementById("ti-request").style.display="none";
								document.getElementById("ti-past").style.display="none";
								document.getElementById("ti-accept").style.display="block";
			}
		}
	}
	xhr.open("GET", "php/login.php?username="+username+"&password="+password, true);
	xhr.send();
}

//search for books (genres[0] - genres[18] [19 genres])
function search() {
	//find which genres were checked
	var genre;
	var genres = document.getElementById("SearchForm").elements;
	var checked = [];
	//document.writeln(checked);
	for (var i = 0; i < genres.length; i++) {
		if(genres[i].checked) {
			//add checked genres to array
			genre = genres[i].value;
			checked.push(genre);
		}
	}

	//get books with checked genres from database and display them
	var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if(xhr.readyState == 4 && xhr.status == 200) {
			var result = xhr.responseText;
			document.getElementById("searchBooks").innerHTML = result;
		}
	}
	xhr.open("GET", "php/search.php?checked=" + JSON.stringify(checked), true);
	xhr.send();
}

//search for a string of text in database
function searchText(){
	var str = document.getElementById("SearchBox").searchBox.value;
	
	var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if(xhr.readyState == 4 && xhr.status == 200) {
                        var result = xhr.responseText;
                        document.getElementById("searchBooks").innerHTML = result;
                }
        }
        xhr.open("GET", "php/searchtext.php?str=" + str, true);
        xhr.send();
}

function aedFunc() {
	//find which option selected
        var option = document.getElementById("formAED").aedRadio;
        var select;

        for (var i=0;i<option.length; i++) {
                if (option[i].checked) {
                        select = option[i].value;
                        break;
                }
        }

	var bookName = "<label> Book Title: </label><input type = \"text\" id = \"findName\" name = \"findName\" />";
	var ISBN = "<label> ISBN: </label><input type = \"text\" id = \"findISBN\" name = \"findISBN\" />";
	addButton = "<button type = \"button\" onclick = \"javascript:findBookAdd()\">Search</button>";
	editButton = "<button type = \"button\" onclick = \"javascript:findBookEdit()\">Search</button>";
	deleteButton = "<button type = \"button\" onclick = \"javascript:findBookDelete()\">Search</button>";	

	//clear all divs that arent needed
	if(select == "Add"){
		document.getElementById("add").innerHTML = ISBN + " " + addButton;
                document.getElementById("edit").innerHTML = "";
                document.getElementById("delete").innerHTML = "";
		document.getElementById("aedInfo").innerHTML = "";
		document.getElementById("aedInfo2").innerHTML = "";
	}
	if(select == "Edit"){
		document.getElementById("aedInfo").innerHTML = "";
		document.getElementById("aedInfo2").innerHTML = "";
                document.getElementById("add").innerHTML = "";
                document.getElementById("edit").innerHTML = bookName + " " + editButton;
                document.getElementById("delete").innerHTML = "";
	}
	if(select == "Delete"){
		document.getElementById("aedInfo").innerHTML = "";
		document.getElementById("aedInfo2").innerHTML = "";
                document.getElementById("add").innerHTML = "";
                document.getElementById("edit").innerHTML = "";
                document.getElementById("delete").innerHTML = bookName + " " + deleteButton;
	}
}

//add book to database
function addBook(){
	var error = "Error!<br />"
        var err;

        //ensure all required fields have input
        var title = document.getElementById("formAdd").bookTitle.value;
        var au = document.getElementById("formAdd").bookAuthor.value;
        var isbn = document.getElementById("formAdd").bookISBN.value;
        var syn = document.getElementById("formAdd").bookSyn.value;
        var form = document.getElementById("formAdd").bookForm.value;
        var pri = document.getElementById("formAdd").bookPrice.value;
        var cov = document.getElementById("formAdd").bookCover.value;
        var type = document.getElementById("formAdd").bookType.value;

	//convert image path to right path
	var path = "images/bookCovers/";
	var x = cov.slice(12);
	cov = path.concat(x);

	if(title.length == 0){
                err = "Please input a Title <br />";
                error = error.concat(err);
        }
        if(au.length == 0){
                err = "Please input an Author <br />";
                error = error.concat(err);
        }
        if(isbn.length == 0){
                err = "Please input a ISBN <br />";
                error = error.concat(err);
        }
        if(form.length == 0){
                err = "Please input a Form <br />";
                error = error.concat(err);
        }
        if(pri <= 0){
                err = "Please input a Price <br />";
                error = error.concat(err);
        }
        if(type.length == 0){
                err = "Please input a Type <br />";
                error = error.concat(err);
        }

	//ensure at least 1 genre is selected
        var genres = document.getElementById("formAdd").elements;
        var check = 0;
	var genreArr = [];
	var genre;
        for (var i = 0; i < genres.length; i++) {
                if(genres[i].checked) {
                        check++;
			genre = genres[i].value;
			genreArr.push(genre);
                }
        }

	if(check == 0){
		err = "Please select at least ONE genre <br />";
                error = error.concat(err);
	}

	//display errors OR send data to database
        if(error.length > 12)//initial size of error
                document.getElementById("aedInfo").innerHTML = error;
        else{
		data = "title="+title+"&au="+au+"&isbn="+isbn+"&syn="+syn+"&form="+form+"&pri="+pri+"&cov="+cov+"&type="+type+"&genre="+genreArr+"&len="+check;
		var xhr = new XMLHttpRequest();
        	xhr.onreadystatechange = function () {
        	        if(xhr.readyState == 4 && xhr.status == 200) {
				var result = xhr.responseText;

				if(result == "added"){
					alert("Book added successfully!");

			                //clear all divs
        			        document.getElementById("aedInfo").innerHTML = "";
					document.getElementById("add").innerHTML = "";
                			document.getElementById("edit").innerHTML = "";
			                document.getElementById("delete").innerHTML = "";
					document.getElementById("aedInfo2").innerHTML = "";

        			        //make old div invisible
        			        document.getElementById("AED-page").style.display = "none";

        			        //navigate to home page after delay
        			        document.getElementById("home-page").style.display = "block";
        			        updateActive("home");
				}
				else{
					//document.getElementById("aedInfo").innerHTML = "Error. Failed to add book to database. Please check all details";
					document.getElementById("aedInfo").innerHTML = result;
				}
                	}
	        }
	xhr.open("POST", "php/addBook.php", true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.send(data);
	}
}

//show add book form
function addForm(){
	//keep ISBN from previous search
	var isbn = document.getElementById("findISBN").value;

	//message to display
	var msg =  "Book not found. Please enter book details. <br /><br />";

        var form = "<form id = \"formAdd\">";	
        var title = "<label> Title: </label><input type = \"text\" id = \"bookTitle\" name = \"bookTitle\" /><br />";
        var author = "<label> Author: </label><input type = \"text\" id = \"bookAuthor\" name = \"bookAuthor\" /><br />";
        var ISBN = "<label> ISBN: </label><input type = \"text\" id = \"bookISBN\" name = \"bookISBN\" /><br />";
        var Synopsis = "<label> Synopsis: </label><textarea id = \"bookSyn\" name = \"bookSyn\" cols = \"100\" rows = \"10\"></textarea><br />";
        var Form = "<label> Form: </label><input type = \"text\" id = \"bookForm\" name = \"bookForm\" /><br />";
        var Price = "<label> Price: </label><input type = \"number\" id = \"bookPrice\" name = \"bookPrice\" /><br />";
        var CoverImage ="<label> Cover Image: </label><input type = \"file\" id = \"bookCover\" name = \"bookCover\" accept = \"image/*\"/><br />";
        var Type = "<label> Type: </label><input type = \"text\" id = \"bookType\" name = \"bookType\" /><br /><br />";
	var genre = "<table><caption class = \"searchTable\" /><tbody><tr><td><label>Drama: <input type = \"checkbox\" value = \"11111111\" name = \"genre\" /></label>" +
               "</td><td><label>Fantasy: <input type = \"checkbox\" value = \"11111112\" name = \"genre\" /></label></td><td>" +
               "<label>Mystery: <input type = \"checkbox\" value = \"11111113\" name = \"genre\" /></label></td><td><label>Thriller: <input type = \"checkbox\" value = \"11111114\" name = \"genre\" /></label>" +
               "</td><td><label>Bildungsroman: <input type = \"checkbox\" value = \"111111115\" name = \"genre2\" /></label></td></tr><tr><td>" +
               "<label>Young Adult Fiction: <input type = \"checkbox\" value = \"11111116\" name = \"genre2\" /></label></td><td><label>Children's Fiction: <input type = \"checkbox\" value = \"11111117\" name = \"genre2\" /></label>" +
               "</td><td><label>Adventure: <input type = \"checkbox\" value = \"11111118\" name = \"genre2\" /></label></td><td><label>Animals: <input type = \"checkbox\" value = \"11111119\" name = \"genre2\" /></label>" +
               "</td><td><label>Humour: <input type = \"checkbox\" value = \"11111120\" name = \"genre2\" /></label></td></tr><tr><td><label>Classic: <input type = \"checkbox\" value = \"11111121\" name = \"genre2\" /></label>" +
               "</td><td><label>Short Stories: <input type = \"checkbox\" value = \"11111122\" name = \"genre2\" /></label></td><td><label>Traditional: <input type = \"checkbox\" value = \"11111123\" name = \"genre2\" /></label>" +
               "</td><td><label>Children's: <input type = \"checkbox\" value = \"11111124\" name = \"genre2\" /></label></td><td><label>Historical Fiction: <input type = \"checkbox\" value = \"11111125\" name = \"genre2\" /></label>" +
               "</td></tr><tr><td><label>Philosophical Fiction: <input type = \"checkbox\" value = \"11111126\" name = \"genre2\" /></label></td><td>" +
               "<label>Science Fiction: <input type = \"checkbox\" value = \"11111127\" name = \"genre2\" /></label></td><td><label>Romance: <input type = \"checkbox\" value = \"11111128\" name = \"genre2\" /></label>" +
               "</td><td><label>Horror: <input type = \"checkbox\" value = \"11111129\" name = \"genre2\" /></label></td><td></td></tr></tbody></table><br />";
        addButton = "<button type = \"button\" onclick = \"javascript:addBook()\"\">Add Book</button>";
	var form2 = "</form>";

	//display message
	document.getElementById("aedInfo").innerHTML = msg;
        document.getElementById("add").innerHTML = form + title + author + ISBN + Synopsis + Form + Price + CoverImage + Type + genre + addButton + form2;

	//add ISBN to form
        document.getElementById("bookISBN").value = isbn;

}

//search for book in database before adding
//if found, increment InStock by 1, else call addBook function
function findBookAdd(){
        var ISBN = document.getElementById("findISBN").value;

	var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                        var result = xhr.responseText;
		
			if(result == "not found")
				addForm();
			else{
				document.getElementById("add").innerHTML = "Book already in database. Stock incremented by 1";
                		document.getElementById("edit").innerHTML = "";
                		document.getElementById("delete").innerHTML = "";
				document.getElementById("aedInfo").innerHTML = "";
				document.getElementById("aedInfo2").innerHTML = "";
			}
                }
        }
        xhr.open("GET", "php/bookInStock.php?ISBN=" + ISBN, true);
        xhr.send();
}

function editForm(book){
	//clear book list, and place form there
	document.getElementById("aedInfo2").innerHTML = "";


	var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                        var result = xhr.responseText;
				document.getElementById("aedInfo2").innerHTML = result
				document.getElementById("edit").innerHTML = "";
                        }
                }
   
        xhr.open("GET", "php/editForm.php?id=" + book, true);
        xhr.send();
}

//search for book in database to edit
function findBookEdit(){
	var book = document.getElementById("findName").value;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                        var result = xhr.responseText;

                        if(result == "not found"){
                                document.getElementById("add").innerHTML = "";
				document.getElementById("delete").innderHTML = "";
                                document.getElementById("aedInfo2").innerHTML = "No books found. Try another Title.";
                                document.getElementById("aedInfo").innerHTML = "";
                        }
                        else{
                                document.getElementById("aedInfo2").innerHTML = result;
                        }
                }
        }
        xhr.open("GET", "php/displayEditBooks.php?book=" + book, true);
        xhr.send();	
}

function editBook(book){
	var error = "Error!<br />"
        var err;

	//book details
	var title = document.getElementById("bookTitle").value;
        var author = document.getElementById("bookAuthor").value;
        var isbn = document.getElementById("bookISBN").value;
        var synopsis = document.getElementById("bookSyn").value;
        var form = document.getElementById("bookForm").value;
        var price = document.getElementById("bookPrice").value;
        var cover = document.getElementById("bookCover").value;
        var type = document.getElementById("bookType").value;
	var qty = document.getElementById("inStock").value;

	//convert image path to right path
        var path = "images/bookCovers/";
        var x = cover.slice(12);
        cover = path.concat(x);

	//ensure all required fields have data entered
	if(title.length == 0){
                err = "Please input a Title <br />";
                error = error.concat(err);
        }
        if(author.length == 0){
                err = "Please input an Author <br />";
                error = error.concat(err);
        }
        if(isbn.length == 0){
                err = "Please input a ISBN <br />";
                error = error.concat(err);
        }
        if(form.length == 0){
                err = "Please input a Form <br />";
                error = error.concat(err);
        }
        if(price <= 0){
                err = "Please input a Price <br />";
                error = error.concat(err);
        }
        if(type.length == 0){
                err = "Please input a Type <br />";
                error = error.concat(err);
        }

	if(qty < 0){
		err = "Quantity can't be less than 0 <br />";
                error = error.concat(err);
	}

        //ensure at least 1 genre is selected
        var genres = document.getElementById("formEdit").elements;
        var check = 0;
        var genreArr = [];
        var genre;
	for (var i = 0; i < genres.length; i++) {
                if(genres[i].checked) {
                        check++;
                        genre = genres[i].value;
                        genreArr.push(genre);
                }
        }

        if(check == 0){
                err = "Please select at least ONE genre <br />";
                error = error.concat(err);
        }

        //display errors OR send data to database
        if(error.length > 12)//initial size of error
                document.getElementById("aedInfo").innerHTML = error;
        else{
		data = "php/editBook.php?id="+book+"&title="+title+"&au="+author+"&isbn="+isbn+"&syn="+synopsis+"&form="+form+"&price="+price+"&cover="+cover+"&type="+type+"&qty="+qty+"&genres="+JSON.stringify(genreArr);
	        var xhr = new XMLHttpRequest();
	        xhr.onreadystatechange = function () {
	                if (xhr.readyState == 4 && xhr.status == 200) {
	                        var result = xhr.responseText;

	                        if(result == "error"){
	                                document.getElementById("add").innerHTML = "";
	                                document.getElementById("edit").innerHTML = "";
	                                document.getElementById("aedInfo").innerHTML = "Error. Failed to edit book. Please check all details.";
	                        }
	                        else{
					alert("Book edited successfully!");

					//clear all divs
				 	document.getElementById("aedInfo").innerHTML = "";
	                                document.getElementById("add").innerHTML = "";
	                                document.getElementById("edit").innerHTML = "";
	                                document.getElementById("delete").innerHTML = "";
        	                        document.getElementById("aedInfo2").innerHTML = "";

     	                        	//make old div invisible
	                                document.getElementById("AED-page").style.display = "none";

        	                        //navigate to home page after delay
	                                document.getElementById("home-page").style.display = "block";
        	                        updateActive("home");
                	        }
               		}
		}
        }
	xhr.open("GET", data, true);
        xhr.send();
}

//search for book in database to delete
function findBookDelete(){
        var book = document.getElementById("findName").value;
	var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                        var result = xhr.responseText;

                        if(result == "not found"){
                                document.getElementById("add").innerHTML = "";
                                document.getElementById("edit").innerHTML = "";
				document.getElementById("aedInfo2").innerHTML = "No books found. Try another Title.";
                                document.getElementById("aedInfo").innerHTML = "";
                        }
			else{
                                document.getElementById("aedInfo2").innerHTML = result;
                        }
                }
        }
        xhr.open("GET", "php/displayDeleteBooks.php?book=" + book, true);
        xhr.send();
}

function deleteBook(book) {
	var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                        var result = xhr.responseText;

			alert("Book deleted from database successfully!");

                        //clear all divs
                        document.getElementById("aedInfo").innerHTML = "";
                        document.getElementById("add").innerHTML = "";
                        document.getElementById("edit").innerHTML = "";
                        document.getElementById("delete").innerHTML = "";
                        document.getElementById("aedInfo2").innerHTML = "";

                        //make old div invisible
                        document.getElementById("AED-page").style.display = "none";

                        //navigate to home page after delay
                        document.getElementById("home-page").style.display = "block";
	                updateActive("home");
                }
        }
        xhr.open("GET", "php/deleteBook.php?book=" + book, true);
        xhr.send();
}