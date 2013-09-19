$(document).ready(function () {
	var divs = ["#spinner-right", "#spinner-left", 
							"#flames", "#email-me", "#sendmail",
							"#counter", "#mchammer", "#dog",
							"#dancingbaby", "#new"];
	$("#geocities-button").click(function () {
		$(this).text('Keep it coming');
		var div = _.sample(divs);
		divs.splice(_.indexOf(divs, div), 1);
		$(div).removeClass("invisible");
	});
});