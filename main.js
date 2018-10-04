// navigator.geolocation.getCurrentPosition(function(position) {
//     var pos = {
//       lat: position.coords.latitude,
//       lng: position.coords.longitude
//     };
//     console.log(pos);
// })
function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (10*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
$(document).ready(function() {

    if($("#cidadetopo").length > 0) {
        new dgCidadesEstados({
            cidade: document.getElementById('cidadetopo'),
            estado: document.getElementById('estadotopo')
        })
    }
    if($("#cidadeplano").length > 0) {
        new dgCidadesEstados({
            cidade: document.getElementById('cidadeplano'),
            estado: document.getElementById('estadoplano')
        })
    }

    $(".formestado").submit(function(e) {
		e.preventDefault();
		if($(this).find(".estadoselect").val()!="" && $(this).find(".cidadeselect").val()!="") {
			setCookie("estadoselecionado", $(this).find(".estadoselect").val())
    		setCookie("cidadeselecionada", $(this).find(".cidadeselect option:selected").text())
    		setCookie("ibgeselecionado", $(this).find(".cidadeselect").val())
			$("#modalestado").modal("hide");
			showplano($(this).find(".estadoselect").val(),$(this).find(".cidadeselect option:selected").text(),$(this).find(".cidadeselect").val());
		}
	})

    $("#cpf").inputmask("999.999.999-99");
    $("#cnpj").inputmask("99.999.999/9999-99");
    $("#cepgeral").inputmask("99999-999");
    $("#fone_dddgeral").inputmask("99");
    $("#fonegeral").inputmask({
        mask: ["9999-9999", "99999-9999"]
    });
    $("#celular_dddgeral").inputmask("99");
    $("#celulargeral").inputmask("99999-9999");
    //$("#data_nascimento").inputmask("99/99/9999");
    $("#cepbusca").inputmask("99999-999");

	$(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    // scroll body to 0px on click
    $('#back-to-top').click(function () {
        $('#back-to-top').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    $('#back-to-top').tooltip('show');

	/* Modal Escolhe estado */
	// var sPageURL = window.location.search.substring(1);
	// if(sPageURL=="min") {
	// 	$(".minimo").css("display","none");
	// } else {
	// 	$("#modalestado").modal({backdrop: 'static', keyboard: false});
	// }

	var estadoselecionado = getCookie("estadoselecionado");
	var cidadeselecionada = getCookie("cidadeselecionada");
	var ibgeselecionado = getCookie("ibgeselecionado");
    if (estadoselecionado == "") {
		//$("#modalestado").modal({backdrop: 'static', keyboard: false});
        if (window.navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition,showError);
        } else {
            $("#planos #selectplanos").css("display","block");
        }
    } else {
		showplano(estadoselecionado,cidadeselecionada,ibgeselecionado);
	}

    function showPosition(position) {
        var lat 	 = position.coords.latitude,
			lng 	 = position.coords.longitude,
			latlng 	 = new google.maps.LatLng(lat, lng),
			geocoder = new google.maps.Geocoder();
		geocoder.geocode({'latLng': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					for (var i = 0; i < results.length; i++) {
						if (results[i].types[0] === "locality") {
							var city = results[i].address_components[0].short_name;
							var state = results[i].address_components[2].short_name;

                			setCookie("estadoselecionado", state)
                    		setCookie("cidadeselecionada", city)

							console.log(city + ", " + state);
                            showplano(state,city);
						}
					}
				}
				else {$("#planos #selectplanos").css("display","block");}
			}
			else {$("#planos #selectplanos").css("display","block");}
		});
    }
    function showError(error) {
        $("#planos #selectplanos").css("display","block");
    }


	$(".tab-text .vermais").on("click", function() {
		$(".tab-text .vermais").remove();
		$(".more").css("display","block");
	})


	$(".tab-footer .bt-expand").on("click", function() {
	    if ($(this).hasClass("closed")) {
	        $(this).removeClass("closed");
	        $(this).addClass("open");
	        $(this).find("span").removeClass("glyphicon-menu-down");
	        $(this).find("span").addClass("glyphicon-menu-up");
	        $(this).prev().slideDown("slow");
	    } else {
	        $(this).removeClass("open");
	        $(this).addClass("closed");
	        $(this).find("span").removeClass("glyphicon-menu-up");
	        $(this).find("span").addClass("glyphicon-menu-down");
	        $(this).prev().slideUp("slow");
	    }
	})

	function showplano(estado,cidade,ibge) {
		$("#barratopo").css("display","block");
        $("#planos").css("display","block");
        $("#planos #selectplanos").css("display","none");
        $("#planos .nav").css("display","block");

        $(".al-ba-ce-pb-pe-rn-se").css("display","none");
        $(".df-es-go-ma-mt-mg-ms-pa-pr-pi-rj-rs-sc-sp").css("display","none");

		$("#barratopo p span.estado").text(cidade+" - "+estado);
		if( estado=="AL" ||
			estado=="BA" ||
			estado=="CE" ||
			estado=="PB" ||
			estado=="PE" ||
			estado=="RN" ||
			estado=="SE"){
			console.log("passou1: "+estado);
			$(".al-ba-ce-pb-pe-rn-se").css("display","block");
		} else if( estado=="DF" ||
			estado=="ES" ||
			estado=="GO" ||
			estado=="MA" ||
			estado=="MT" ||
			estado=="MG" ||
			estado=="MS" ||
			estado=="PA" ||
			estado=="PR" ||
			estado=="PI" ||
			estado=="RJ" ||
			estado=="RS" ||
			estado=="SC" ||
			estado=="SP"){
			console.log("passou1: "+estado);
			$(".df-es-go-ma-mt-mg-ms-pa-pr-pi-rj-rs-sc-sp").css("display","block");
		} else {
			$("#planos").css("display","none");
		}

        $.ajax({
			url : "inc_consultacidade.php",
            method : "POST",
			data : {estado: estado, cidade: cidade, ibge: ibge},
			cache : false,
			success:function(html) {
                console.log("sucesso");
                console.log(html);
                if (html == "error") {
                    $(".adesao1").text("Valor da adesÃ£o: consultar atravÃ©s do 0800 942 3090");
                    $(".adesao2").text("(consultar atravÃ©s do 0800 942 3090)");
                } else {
                    $(".adesao1").text("Valor da adesÃ£o: R$ "+html+",00 no CartÃ£o de CrÃ©dito ou Boleto BancÃ¡rio");
                    $(".adesao2").text("(R$ "+html+",00 no cartÃ£o de crÃ©dito ou boleto bancÃ¡rio)");
                }
            }
        })
	}

	$("a.btn.quero").click(function(event){
		event.preventDefault();
		var plano = $(this).data("plano");
		var download = $(this).data("download");
		var upload = $(this).data("upload");
		var principal = $(this).data("principal");
		var extra = $(this).data("extra");
		var total = $(this).data("total");

		$(".download").text(download);
		$(".upload").text(upload);
		$(".principal").text(principal);
		$(".extra").text(extra);
		$(".total").text(total);

		console.log(plano);
		if(plano=="res10noite"){
			$("#obs").val("Residencial 10 mega - noite");
			$(".nome").text("Noite 10 Mega");
		} else if(plano=="res15noite"){
			$("#obs").val("Residencial 15 mega - noite");
			$(".nome").text("Noite 15 Mega");
		} else if(plano=="res20noite"){
			$("#obs").val("Residencial 20 mega - noite");
			$(".nome").text("Noite 20 Mega");
		} else if(plano=="res15dia"){
			$("#obs").val("Residencial 15 mega - dia");
			$(".nome").text("Dia 15 Mega");
		} else if(plano=="res20dia"){
			$("#obs").val("Residencial 20 mega - dia");
			$(".nome").text("Dia 20 Mega");
		} else if(plano=="res25dia"){
			$("#obs").val("Residencial 25 mega - dia");
			$(".nome").text("Dia 25 Mega");
		} else if(plano=="com15"){
			$("#obs").val("Comercial 15 mega");
			$(".nome").text("Empresa 15 Mega");
		} else if(plano=="com20"){
			$("#obs").val("Comercial 20 mega");
			$(".nome").text("Empresa 20 Mega");
		} else if(plano=="com25"){
			$("#obs").val("Comercial 25 mega");
			$(".nome").text("Empresa 25 Mega");
		}


		$('#step2').fadeOut("slow");
		$('#step3').fadeIn("slow");
		$('#steps .st2 .numero').removeClass("active");
		$('#steps .st2 .texto').removeClass("active");
		$('#steps .st3 .numero').addClass("active");
		$('#steps .st3 .texto').addClass("active");
	});

	// $(".nav a.link, .assinar").click(function(event){
	// 	event.preventDefault();
	// 	if($(this).hasClass("resbas10noite")){
	// 		$("#obs").val("Residencial Basico 10 mega - noite");
	// 	} else if($(this).hasClass("res10noite")){
	// 		$("#obs").val("Residencial 10 mega - noite");
	// 	} else if($(this).hasClass("res20noite")){
	// 		$("#obs").val("Residencial 20 mega - noite");
	// 	} else if($(this).hasClass("res15dia")){
	// 		$("#obs").val("Residencial 15 mega - dia");
	// 	} else if($(this).hasClass("res20dia")){
	// 		$("#obs").val("Residencial 20 mega - dia");
	// 	} else if($(this).hasClass("res25dia")){
	// 		$("#obs").val("Residencial 25 mega - dia");
	// 	} else if($(this).hasClass("com15")){
	// 		$("#obs").val("Comercial 15 mega");
	// 	} else if($(this).hasClass("com20")){
	// 		$("#obs").val("Comercial 20 mega");
	// 	} else if($(this).hasClass("com25")){
	// 		$("#obs").val("Comercial 25 mega");
	// 	}
	// 	$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
	// });

	// $('.revenda').on('click', function(e) {
	// 	var src = $(this).attr('data-src');
	// 	var width = $(this).attr('data-width'); // larghezza dell'iframe se non impostato usa 640
	// 	var height = $(this).attr('data-height'); // altezza dell'iframe se non impostato usa 360
	//
	// 	var allowfullscreen = $(this).attr('data-video-fullscreen'); // impostiamo sul bottone l'attributo allowfullscreen se Ã¨ un video per permettere di passare alla modalitÃ  tutto schermo
	//
	// 	// stampiamo i nostri dati nell'iframe
	// 	$("#myModal iframe").attr({
	// 		'src': src,
	// 		'height': height,
	// 		'width': width,
	// 		'allowfullscreen':''
	// 	});
	// });

	// se si chiude la modale resettiamo i dati dell'iframe per impedire ad un video di continuare a riprodursi anche quando la modale Ã¨ chiusa
	$('#myModal').on('hidden.bs.modal', function(){
		$(this).find('iframe').html("");
		$(this).find('iframe').attr("src", "");
	});

	// $('#data_nascimento').datetimepicker({
	// 	format: 'DD/MM/YYYY'
	// });

	$("input[name='tipo']").on("change",function(){
		var radioValue = $("input[name='tipo']:checked").val();
		if(radioValue=="F"){
			$("#cpf").css("display","block");
			$("#cnpj").css("display","none");
			//$(".hide-empresa").css("display","block");

			$("#cnpj").val("");

			$("#cpf").prop('required',true);
			$("#cnpj").prop('required',null);
			// $("#sexo1").prop('required',true);
			// $("#nome_mae").prop('required',true);

			$("#cpf").inputmask("999.999.999-99");
		} else if(radioValue=="J"){
			$("#cpf").css("display","none");
			$("#cnpj").css("display","block");
			//$(".hide-empresa").css("display","none");

			$("#cpf").val("");

			$("#cpf").prop('required',null);
			$("#cnpj").prop('required',true);
			// $("#sexo1").prop('required',null);
			// $("#nome_mae").prop('required',null);

			$("#cnpj").inputmask("99.999.999/9999-99");
		}
	});

    // $("#cepform").submit(function(e) {
	// 	e.preventDefault();
	// 	var cepvalue = $("#cepbusca").val();
	// 	$.ajax({
	// 		url : "inc_consultacep.php",
    //         method : "POST",
	// 		data : {cep: cepvalue},
	// 		cache : false,
	// 		success:function(html) {
    //             if (html == "success") {
    //                 buscacepgoogle(cepvalue);
    //                 $("#cepbox").html('<h2>Seu endereÃ§o possui cobertura Giganet!</h2><a href="'+path+'/assinar" class="bt">Compre Agora</a>');
    //                 $('#step1').fadeOut("slow");
	// 				$('#step2').fadeIn("slow");
	// 				$('#steps .st1 .numero').removeClass("active");
	// 				$('#steps .st1 .texto').removeClass("active");
	// 				$('#steps .st2 .numero').addClass("active");
	// 				$('#steps .st2 .texto').addClass("active");
    //             } else {
    //             	//$("#modalsemcobertura").modal();
    //                 $("#cepbox").html('<h2>Para saber sobre a cobertura na sua cidade entre em contato atravÃ©s do </h2><p>81 98261 8870</p>');
    //             }
    //         }
    //     })
    // });

    $("#cepform").submit(function(e) {
		e.preventDefault();
		var cepvalue = $("#cepbusca").val();
        $.ajax({
			url : "https://maps.googleapis.com/maps/api/geocode/json",
			data : {address: cepvalue, key: "AIzaSyAnW3xoEiItei3zmFBLrjftpewQQOzodhY"},
			cache: false,
			success:function(html) {
				//console.log(html.results[0].address_components);
    			console.log(html);
				if (html.status == "OK") {
					var filtered_array = html.results[0].address_components.filter(function(address_component){
			            return address_component.types.includes("administrative_area_level_1");
			        });
			        var estado = filtered_array.length ? filtered_array[0].short_name: "";
					console.log(estado);

                    var filtered_array2 = html.results[0].address_components.filter(function(address_component){
			            return address_component.types.includes("administrative_area_level_2");
			        });
			        var cidade = filtered_array2.length ? filtered_array2[0].short_name: "";
					console.log(cidade);

                    $("#barratopo p span.estado").text(cidade+" - "+estado);
                    $("#barratopo").css("display","block");
                    showplano(estado,cidade);
            		setCookie("estadoselecionado", estado);
            		setCookie("cidadeselecionada", cidade);

                    $("#cepbox").html('<h2>Seu endereÃ§o possui cobertura Giganet!</h2><a href="'+path+'/assinar" class="bt">Compre Agora</a>');
                    $('#step1').fadeOut("slow");
					$('#step2').fadeIn("slow");
					$('#steps .st1 .numero').removeClass("active");
					$('#steps .st1 .texto').removeClass("active");
					$('#steps .st2 .numero').addClass("active");
					$('#steps .st2 .texto').addClass("active");

				} if (html.status == "ZERO_RESULTS") {
					$("#modalsemcobertura").modal();
                    $("#cepbox").html('<h2>Para saber sobre a cobertura na sua cidade entre em contato atravÃ©s do </h2><p>81 98261 8870</p>');
				}
			}
		});
    });

    function buscacepgoogle(cep) {
		var cepvalue = cep;
		$.ajax({
			url : "https://maps.googleapis.com/maps/api/geocode/json",
			data : {address: cepvalue, key: "AIzaSyAnW3xoEiItei3zmFBLrjftpewQQOzodhY"},
			cache: false,
			success:function(html) {
				//console.log(html.results[0].address_components);
    			console.log(html);
				if (html.status == "OK") {
					var filtered_array = html.results[0].address_components.filter(function(address_component){
			            return address_component.types.includes("administrative_area_level_1");
			        });
			        var estado = filtered_array.length ? filtered_array[0].short_name: "";
					console.log(estado);
			        var estadonome = filtered_array.length ? filtered_array[0].long_name: "";

                    $("#barratopo p span.estado").text(estadonome);
                    $("#barratopo").css("display","block");
                    showplano(estado);
            		setCookie("estadoselecionado", estado)

				} if (html.status == "ZERO_RESULTS") {
					$("#modalsemcobertura").modal();
				}
			}
		});
	}

	// $("#cepform").submit(function(e) {
	// 	e.preventDefault();
	// 	var cepvalue = $("#cepbusca").val();
	// 	$.ajax({
	// 		url : "https://maps.googleapis.com/maps/api/geocode/json",
	// 		data : {address: cepvalue, key: "AIzaSyAnW3xoEiItei3zmFBLrjftpewQQOzodhY"},
	// 		cache: false,
	// 		success:function(html) {
	// 			console.log(html);
	// 			if (html.status == "OK") {
	// 				var filtered_array = html.results[0].address_components.filter(function(address_component){
	// 		            return address_component.types.includes("administrative_area_level_1");
	// 		        });
	// 		        var estado = filtered_array.length ? filtered_array[0].short_name: "";
	// 				console.log(estado);
	// 				if (estado=="SP" ||
	// 					estado=="MS" ||
	// 					estado=="AL" ||
	// 					estado=="BA" ||
	// 					estado=="CE" ||
	// 					estado=="PB" ||
	// 					estado=="PE" ||
	// 					estado=="RN" ||
	// 					estado=="SE" ||
	// 					estado=="RS" ||
	// 					estado=="DF" ||
	// 					estado=="ES" ||
	// 					estado=="GO" ||
	// 					estado=="MA" ||
	// 					estado=="MT" ||
	// 					estado=="MG" ||
	// 					estado=="PA" ||
	// 					estado=="PR" ||
	// 					estado=="PI" ||
	// 					estado=="RJ" ||
	// 					estado=="SC" ) {
	// 					$("#cepbox").html('<h2>Seu endereÃ§o possui cobertura Giganet!</h2><a href="http://hughes.elsys.com.br/homolog/assinar" class="bt">Compre Agora</a>');
	// 					if( estado=="SP" ||
	// 						estado=="MS"){
	// 						console.log("passou1: "+estado);
	// 						$(".sp-ms").css("display","block");
	// 					} else if( estado=="AL" ||
	// 						estado=="BA" ||
	// 						estado=="CE" ||
	// 						estado=="PB" ||
	// 						estado=="PE" ||
	// 						estado=="RN" ||
	// 						estado=="SE" ||
	// 						estado=="RS"){
	// 						console.log("passou1: "+estado);
	// 						$(".al-ba-ce-pb-pe-rn-se-rs").css("display","block");
	// 					} else if( estado=="DF" ||
	// 						estado=="ES" ||
	// 						estado=="GO" ||
	// 						estado=="MA" ||
	// 						estado=="MT" ||
	// 						estado=="MG" ||
	// 						estado=="PA" ||
	// 						estado=="PR" ||
	// 						estado=="PI" ||
	// 						estado=="RJ" ||
	// 						estado=="SC"){
	// 						console.log("passou1: "+estado);
	// 						$(".df-es-go-ma-mt-mg-pa-pr-pi-rj-sc").css("display","block");
	// 					} else {
	// 						$("#planos").remove();
	// 					}
	// 					$('#step1').fadeOut("slow");
	// 					$('#step2').fadeIn("slow");
	// 					$('#steps .st1 .numero').removeClass("active");
	// 					$('#steps .st1 .texto').removeClass("active");
	// 					$('#steps .st2 .numero').addClass("active");
	// 					$('#steps .st2 .texto').addClass("active");
	// 				}
	// 			} if (html.status == "ZERO_RESULTS") {
	// 				$("#modalsemcobertura").modal();
	// 			}
	// 		}
	// 	});
	// })


    $("#register").submit(function(e) {
        e.preventDefault(); //STOP default action
        $('#obs').prop('disabled', false);
        var postData = $(this).serializeArray();
		console.log("postData1: ");
		console.log(postData);
        registerLead(postData);
    })

	function registerLead(postdata) {
		$(".loading").css("display","block");
		$('button.bt').prop('disabled', true);

		var postData = postdata;
		console.log("postData: ");
		console.log(postData);
		$.ajax({
			url : "ajaxsige.php",
			type: "POST",
			data : postData,
			cache: false,
			success:function(html) {
				$(".loading").css("display","none");
				$('button.bt').prop('disabled', false);
				console.log(html);
				if(html=="sucesso"){
					// ga('send', 'event', 'Hughes', 'CaptarLead');
					// ga('send', 'event', 'formulario', 'preenchido');
					dataLayer.push({
						'event':'formSend'
					});
					console.log("passou sucesso");
					$("#register").css("display","none");
					$(".sucesso").css("display","block");
					$(".cadastrado").css("display","none");
					$(".erro").css("display","none");
				} else {
					console.log("passou erro");
					$(".loading").css("display","none");
					$(".sucesso").css("display","none");
					$(".cadastrado").css("display","none");
					$(".erro").css("display","block");
				}
			}
		});
		//e.unbind(); //unbind. to stop multiple form submit.
	}

	window.Parsley.addValidator('validcpf', function (value, requirement) {
			var   cpf        = value.replace(/[^0-9]/g, '')
				, compareCPF = cpf.substring(0, 9)
				, add        = 0
				, i, u
				, invalidCPF = [
					'00000000000',
					'11111111111',
					'22222222222',
					'33333333333',
					'44444444444',
					'55555555555',
					'66666666666',
					'77777777777',
					'88888888888',
					'99999999999'
				]
				;


			if ( cpf.length < 11 || $.inArray(cpf, invalidCPF) !== -1 ) {
				return false;
			}

			for (i = 8, u = 2; i >= 0; i--, u++) {
				add = add + parseInt(cpf.substring(i, i+1)) * u;
			}

			compareCPF = compareCPF + ( (add % 11) < 2 ? 0 : 11 - (add % 11));
			add = 0

			for (i = 9, u = 2; i >= 0; i--, u++) {
				add = add + parseInt(cpf.substring(i, i+1)) * u;
			}

			compareCPF = compareCPF + ( (add % 11) < 2 ? 0 : 11 - (add % 11));

			if (compareCPF !== cpf) {
				return false;
			}

			return true;

	}, 32)
	.addMessage('pt-br', 'validcpf', 'Este campo deve ser um CPF vÃ¡lido.');


	window.Parsley.addValidator('validcnpj', function (value, requirement) {
			var   cnpj        = value.replace(/[^0-9]/g, '')
				, len         = cnpj.length - 2
				, numbers     = cnpj.substring(0,len)
				, digits      = cnpj.substring(len)
				, add         = 0
				, pos         = len - 7
				, invalidCNPJ = [
					'00000000000000',
					'11111111111111',
					'22222222222222',
					'33333333333333',
					'44444444444444',
					'55555555555555',
					'66666666666666',
					'77777777777777',
					'88888888888888',
					'99999999999999'
				]
				, result
				;


			if ( cnpj.length < 11 || $.inArray(cnpj, invalidCNPJ) !== -1 ) {
				return false;
			}

			for (i = len; i >= 1; i--) {
				add = add + parseInt(numbers.charAt(len - i)) * pos--;
				if (pos < 2) { pos = 9; }
			}

			result = (add % 11) < 2 ? 0 : 11 - (add % 11);
			if (result != digits.charAt(0)) {
				return false;
			}

			len = len + 1;
			numbers = cnpj.substring(0,len);
			add = 0;
			pos = len - 7;

			for (i = 13; i >= 1; i--) {
				add = add + parseInt(numbers.charAt(len - i)) * pos--;
				if (pos < 2) { pos = 9; }
			}

			result = (add % 11) < 2 ? 0 : 11 - (add % 11);
			if (result != digits.charAt(1)) {
				return false;
			}

			return true;

	}, 32)
	.addMessage('pt-br', 'validcnpj', 'Este campo deve ser um CNPJ vÃ¡lido.');

	Parsley.addMessages('pt-br', {
	  defaultMessage: "Este valor parece ser invÃ¡lido.",
	  type: {
	    email:        "Este campo deve ser um email vÃ¡lido.",
	    url:          "Este campo deve ser um URL vÃ¡lida.",
	    number:       "Apenas nÃºmeros.",
	    integer:      "Este campo deve ser um inteiro vÃ¡lido.",
	    digits:       "Este campo deve conter apenas dÃ­gitos.",
	    alphanum:     "Este campo deve ser alfa numÃ©rico."
	  },
	  notblank:       "Este campo nÃ£o pode ficar vazio.",
	  required:       "Campo obrigatÃ³rio.",
	  pattern:        "Este campo parece estar invÃ¡lido.",
	  min:            "Este campo deve ser maior ou igual a %s.",
	  max:            "Este campo deve ser menor ou igual a %s.",
	  range:          "Este campo deve estar entre %s e %s.",
	  minlength:      "Este campo Ã© pequeno demais. Ele deveria ter %s caracteres ou mais.",
	  maxlength:      "Este campo Ã© grande demais. Ele deveria ter %s caracteres ou menos.",
	  length:         "O tamanho deste campo Ã© invÃ¡lido. Ele deveria ter entre %s e %s caracteres.",
	  mincheck:       "VocÃª deve escolher pelo menos %s opÃ§Ãµes.",
	  maxcheck:       "VocÃª deve escolher %s opÃ§Ãµes ou mais",
	  check:          "VocÃª deve escolher entre %s e %s opÃ§Ãµes.",
	  equalto:        "Este valor deveria ser igual."
	});

	Parsley.setLocale('pt-br');


	function limpa_formulÃ¡rio_cep() {
	    // Limpa valores do formulÃ¡rio de cep.
	    $("#endereco").val("");
	    $("#bairro").val("");
		$("#estado option:contains('')").prop("selected", false);
		$("#cidade option:contains('')").prop("selected", false);
	}
	function enableFields() {
		$("#cidade").prop('disabled', false);
		$("#estado").prop('disabled', false);
	}
	function disableFields() {
		$("#cidade").prop('disabled', true);
		$("#estado").prop('disabled', true);
	}
	$("#cep").focus(function(){
		enableFields()
	})
	//Quando o campo cep perde o foco.
	temhughes = true;
	$("#cep").blur(function() {

	    //Nova variÃ¡vel "cep" somente com dÃ­gitos.
	    var cep = $(this).val().replace(/\D/g, '');

	    //Verifica se campo cep possui valor informado.
	    if (cep != "") {

	        //ExpressÃ£o regular para validar o CEP.
	        var validacep = /^[0-9]{8}$/;

	        //Valida o formato do CEP.
	        if(validacep.test(cep)) {

	            //Consulta o webservice viacep.com.br/
	            $.getJSON("//viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

	                if (!("erro" in dados)) {
	                    //Atualiza os campos com os valores da consulta.
						// console.log(dados);
						// disableFields();
						// $("#endereco").val(dados.logradouro);
	                    // $("#bairro").val(dados.bairro);
						// $("#estado option:contains(" + dados.uf + ")").prop('selected',true);
						// $("#estado-hidden").val(dados.uf);
						// cidades().done(function(){
		                //     $("#cidade option:contains(" + dados.localidade.toUpperCase() + ")").prop('selected', true);
						// 	$("#cidade-hidden").val(dados.localidade);
						// 	checkhughes();
					    // });
	                } //end if.
	                else {
	                    //CEP pesquisado nÃ£o foi encontrado.
						enableFields();
	                    $("#aviso2").modal("show");
						limpa_formulÃ¡rio_cep();
	                }
	            });
	        }
	    } else {
	        //cep sem valor, limpa formulÃ¡rio.
			enableFields();
	        limpa_formulÃ¡rio_cep();
	    }

	});

});
