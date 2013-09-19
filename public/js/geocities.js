$(document).ready(function () {
	var divs = ["#spinner-right", "#spinner-left", 
							"#flames", "#email-me", "#sendmail"];
	$("#geocities-button").click(function () {
		var div = _.sample(divs);
		divs.splice(_.indexOf(divs, div), 1);
		$(div).removeClass("invisible");
	});
});