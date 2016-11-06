var slideIndex = 0;
var quoteIndex = 0;
//global array for cart
var Cart = [];

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
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
		//app.loadPage("home-page");
    },
	
	expandNav: function() {
		var x = document.getElementById("navigation");
		if (x.className === "navigation") {
			x.className += " responsive";
		} else {
			x.className = "navigation";
		}
	},
	
	carousel: function () {
		var i;
		var x = document.getElementsByClassName("coInfo");
		
		for (i = 0; i < x.length; i++) {
		  x[i].style.display = "none"; 
		}
		
		slideIndex++;
		console.log("and the banner advances to "+slideIndex);
		if (slideIndex > x.length) {slideIndex = 1} 
		x[(slideIndex-1)].style.display = "block"; 
		setTimeout(this.carousel, 3000); // Change image every 3 seconds
	},

	//to make div's visibile/hidden
	loadPage: function(page) {
		//finding old div's id
		var oldDiv = document.getElementsByClassName("active");
		console.log(oldDiv);
		if(oldDiv.length == 0) {
			var oldDivID = "undefined";
		}else{
			var oldDivID = oldDiv[0].getAttribute("id") + "-page";
		}
		
		//make old div invisible
		if (oldDivID != "undefined") {
			document.getElementById(oldDivID).style.display = "none";
		}else{
			//incase it's the book-page
			document.getElementById("book-page").style.display = "none";
			//incase purchase page
			document.getElementById("purchase-page").style.display = "none";
		}

		//run particular scripts
		if(page=="tradeIn-page")
			app.getTradeInRequest(sessionStorage.id, "",  "ti-past", "customer");
		
		//make this div visible
		console.log("this div to make visible "+page);
		document.getElementById(page).style.display = "block";
			
		//need to take -page off the end to updateActive
		page= page.slice(0, -5);
		app.updateActive(page);
	},

	//to change the background color of navbar link to be current page
	updateActive: function (current) {
		var oldPgId;
		var oldPg = document.getElementsByClassName("active");
		if (oldPg.length == 0) {
			oldPgId = "undefined";
		}else{
			oldPgId = oldPg[0].getAttribute("id");
		}
		var curPg = document.getElementById(current);
		
		if (oldPgId !== "undefined")
			document.getElementById(oldPgId).removeAttribute("class");
		if (curPg != null){
			console.log("should be updating class to active for "+curPg);
			curPg.setAttribute("class", "active");
		}
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
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/getRecentBk.php?date=" + dateSQL, true);
		xhr.send();
	},

	displayQuotes: function () {
		var i;
		var x = document.getElementsByClassName("aQuote");
		for (i = 0; i < x.length; i++) {
		  x[i].style.display = "none"; 
		}
		quoteIndex++;
		if (quoteIndex > x.length) {quoteIndex = 1} 
		x[(quoteIndex-1)].style.display = "block"; 
		setTimeout(this.displayQuotes, 10000); // Change image every 10 seconds
	},
	
	getBookDetail: function (bookID) {
		//finding old div's id
		var oldDiv = document.getElementsByClassName("active");
		var oldDivID = oldDiv[0].getAttribute("id") + "-page";
		
		//make old div invisible
		document.getElementById(oldDivID).style.display = "none";
		//need to make a backBtn to oldDivID
		var backBtn = "<button type='button' onclick='javascript:app.loadPage(\""+oldDivID+"\")'>Continue Browsing</button>";
		
		//make this div visible
		document.getElementById("book-page").style.display = "block";
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var result = xhr.responseText;
				
				document.getElementById("book-page").innerHTML = result + backBtn;
			}
		}
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/getBookDetail.php?bookID=" + bookID, true);
		xhr.send();
	},
	
	getAccountDetailsByStored: function () {		
		var username = sessionStorage.username;  		
		var id = sessionStorage.id;  		
				
		console.log("username = "+username);		
		console.log("id = "+id);		
				
		app.getAccountInfo(username, id);		
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
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/getAccountDetails.php?username="+username+"&id="+id, true);		
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
			app.updateAccountDetails(sessionStorage.username, st, sub, state, pc, ph, e);		
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
				
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/updateAccountDetails.php?username="+username+"&st="+st+"&sub="+sub+"&state="+state+"&pc="+pc+"&ph="+ph+"&e="+e, true);		
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
			app.updatePWD(nPW);		
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
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/updatePwd.php?nPwd="+nPwd+"&username="+sessionStorage.username, true);		
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
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/customerSearch.php?username="+username+"&lastname="+lastname+"&phone="+phone, true);		
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
			xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/updateBalance.php?username="+sessionStorage.thisCustUN+"&id="+sessionStorage.thisCustID+"&newBal="+newCB, true);		
			xhr.send();	
		}
	},
	
	//checks to see if book is in stock.
	//if yes, add to and update cart count, else display error message
	 addCart: function(bookID){
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
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/inStock.php?bookID=" + bookID, true);
		xhr.send();
	},
	
	clearCart: function() {
		//clear cart count on screen
		document.getElementById("cart").innerHTML = "Cart";

		//reduce book quantity by 1 for each book in cart
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if(xhr.readyState == 4 && xhr.status == 200) {
			}
		}
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/bookSold.php?Cart=" + JSON.stringify(Cart), true);
		xhr.send();

		//clear the cart
		while(Cart.length)
			Cart.pop();
	},
	
	remove: function(bookID) {
		//make sure bookID is an integer
		var number = app.parseInt(bookID);
	
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
		app.displayCart();
	},

	displayCart: function() {
		console.log("Viewing cart");

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if(xhr.readyState == 4 && xhr.status == 200) {
				var result = xhr.responseText;
				document.getElementById("showCart").innerHTML = result;
			}
		}
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/showCart.php?Cart=" + JSON.stringify(Cart), true);
        xhr.send();
	},

	//checks that user is logged in as a customer
	checkLogin: function(total){
		var name = sessionStorage.user;

		//if not customer, move to login screen
		if(name == "customer")
			app.checkout(total);
		else{
			alert("Please login as a Customer to continue with your purchase.");

			//make cart invisible
            document.getElementById("cart-page").style.display = "none";

            //navigate to home page
            document.getElementById("LIR-page").style.display = "block";
            app.updateActive("LIR");
		}
	},

	//shows checkout/purchase page
	checkout: function(totalPrice) {
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
	},

	//handles the payment form
	//checks for correct input before processing
	purchase: function() {
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
			app.clearCart();

			//clear form for next time
			document.getElementById("purchasing").reset();

	        //make old div invisible
	        document.getElementById("purchase-page").style.display = "none";

	        //navigate to home page after delay
	        document.getElementById("home-page").style.display = "block";
			app.updateActive("home");
		}
	},

	//register to site
	register: function() {
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
			xhr.open("POST", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/register.php", true);
	
			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
			xhr.send(data);
		}
	},

	//login as a staff or customer
	login: function(username, password) {
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
        		    document.getElementById("account").style.display="block";
					document.getElementById("LO").style.display="block";
		            document.getElementById("LIR").style.display="none";
	
					sessionStorage.setItem('user', user);
						
					//page functions & visibility
					//accounts page
					app.getAccountDetailsByStored();
				}
				//signed in as a staff member
				if(user == "staff"){
					document.getElementById("logFail").innerHTML = "Successfully logged in as Staff.";
					console.log("in staff if statement");
                                
					//navbar button visibility
                    document.getElementById("account").style.display="block";
					document.getElementById("LO").style.display="block";
                    document.getElementById("LIR").style.display="none";

					sessionStorage.setItem('user', user);

                    //page parts visibility (add staff elements to account & trade in pages)
					//accounts page
					document.getElementById("accSearch").style.display="block";
					document.getElementById("passwordChange").style.display="none";
				}
			}
		}
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/login.php?username="+username+"&password="+password, true);
		xhr.send();
	},

	//search for books (genres[0] - genres[18] [19 genres])
	search: function() {
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
		xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/search.php?checked=" + JSON.stringify(checked), true);
		xhr.send();
	},

	//search for a string of text in database
	searchText: function(){
		var str = document.getElementById("SearchBox").searchBox.value;
	
		var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4 && xhr.status == 200) {
                var result = xhr.responseText;
                document.getElementById("searchBooks").innerHTML = result;
            }
        }
        xhr.open("GET", "http://ceto.murdoch.edu.au/~32672684/assignment2/php/searchtext.php?str=" + str, true);
        xhr.send();
	},

};

app.initialize();

//function calls written by PHP script therefore difficult to change without breaking website
function addCart(bookID) {
	app.addCart(bookID);
}
function checkLogin(total){
	app.checkLogin(total);
}
function validateAccDetsChange(formObj) {
	app.validateAccDetsChange(formObj);
}
function getBookDetail(bookID) {
	app.getBookDetail(bookID);
}
function remove(bookID) {
	app.remove(bookID);
}