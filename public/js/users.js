/**
 * Created by haoyong on 2017/6/23.
 */
$(function() {

	$(".register-box .register").on("click", function() {
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
				if(result.code === 200) {
					$(".register-box").hide();
					$(".login-box").show();
					$(".api-result-box").html(result.message);
				} else {
					alert(result.message);
				}
			}
		});
	});

	$(".go-register-box").on("click", function() {
		$(".register-box").show();
		$(".login-box").hide();
	});
	$(".go-login-box").on("click", function() {
		$(".register-box").hide();
		$(".login-box").show();
	});
});