NodeSystem.AddNodeType("condition",function(){
	this.header = document.createElement("h2")
	
	this.headerIcon = document.createElement("img")
	this.headerIcon.setAttribute("src","images/icons/condition.png")
	this.titleElement = document.createTextNode("Condition Title")
	this.bodyElement = document.createElement("p")
	this.bodyElement.innerHTML = "Test"
	
	$(this.header)
		.append(this.headerIcon)
		.append(this.titleElement)
	this.elementQuery
		.append(this.header)
		.append(this.bodyElement)
	
	this.AddInPin(-20,4)
	this.AddOutPin(this.elementQuery.width()+Settings.outPinOffset, 4 )
	this.AddOutPin(this.elementQuery.width()+Settings.outPinOffset, 26 )
		
},true)

