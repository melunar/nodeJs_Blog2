/**
 * Created by haoyong on 2017/6/23.
 */
$(function() {

	$(".register-box .submit").on("click", function() {
		$.ajax({
			type: "post",
			url: "/api/user/register/",
			data: {
				username: $(".register-box .username").val(),
				password: $(".register-box .password").val()
			},
			dataType: "json",
			success: function(result) {
				console.log(result);
			}
		});
	});
});