var template_request_body = `
    <div data-v-1c326b38="" class="up-alert up-alert-success">
        <div class="up-alert-icon">
            <div class="up-icon sm"></div>
        </div> 
        <div data-test="alert-content" role="alert" class="up-alert-content break">
            <div class="d-none d-md-block">
                <p data-v-1c326b38="" class="m-0">What template did you use?
                <select id="templates" name="templates">
                  <option value="stafforhourly1">stafforhourly1</option>
                  <option value="feprop">Front-End</option>
                  <option value="nftprop">NFT</option>
                  <option value="tokenprop">ERC20</option>
                  <option value="gamedevprop">gamedev</option>
                  <option value="dApp1">dApp1</option>
                  <option value="analytics1">Analysis tool1</option>
                  <option value="mmbased1">Metamask-based1</option>
                  <option value="simplegame1">Simple game1</option>
                  <option value="dex1">DEX1</option>
                  <option value="hithere">Main Letter</option>
                  <option value="custom">Custom</option>
                </select>
                </p>
            </div>
        </div> 
            <button type="button" class="up-btn-reset up-alert-close" onclick="send_template_data ()">
                <span class="sr-only">Close the <!----> alert</span> 
                <div class="up-icon sm">
                </div>
            </button>
    </div> 
`;

function write_log (otpt) {
	console.log("write log start")
	const log_line = document.createElement("li");
	log_line.className="list-group-item"
	log_line.innerHTML = otpt;
	console.log(log_line)

//	output the result
//	let pdlt_log = document.getElementsByClassName("pdlt_log");
//	pdlt_log[0].appendChild(log_line);

	console.log("write log finish");
}




function wait_proposal () {
	console.log('wait_proposal start');
	var proposal_check = document.querySelector(".m-0").innerText;
	if (proposal_check.includes("submitted") != null) {
		let url = document.URL;
			var proposal_id = url.substring(
				url.lastIndexOf('/') + 1,
				url.indexOf("?"), 
				);

		var sales_person = document.querySelector(".up-fe-proposal-brief-info a").innerText;
		var payment_method = "N/A";
			if (document.querySelector("#payment-method-not-verified-trigger") == null) {
				payment_method = document.querySelector("#fe-payment-verified-text").innerText; }
				else {
					payment_method = document.querySelector("#payment-method-not-verified-trigger").innerText;
				};
		var date_posted = document.querySelector(".list-inline.mb-10 span").innerText;
		if (document.querySelector(".m-0-bottom strong")) {
			var connects = document.querySelector(".m-0-bottom strong").innerText;
		} 
		if (document.querySelector(".pull-right.m-0.d-none.d-md-block.text-right span") == null) {
			var budget = "hourly";
		}
			else {
				var budget = document.querySelector(".pull-right.m-0.d-none.d-md-block.text-right span").innerText;
			};

	console.log(proposal_check);
	console.log(proposal_id);
	console.log(sales_person); 
	console.log(payment_method);
	console.log(date_posted);
	console.log(connects);
	console.log(budget);
	}

	console.log('wait_proposal finish');

	input_template();
	}

setTimeout(wait_proposal, 3000);

function input_template () {
	let alert_area = document.querySelector(".alerts");
	let popup = document.createElement("div");
		popup.className="up-alert-content break";
		popup.innerHTML = template_request_body;
	console.log (alert_area);
	alert_area.appendChild(popup);
}

function send_template_data () {
	var select = document.getElementById('templates');
	var template = select.options[select.selectedIndex].value;
	
	console.log(value); 
}


//m-0

