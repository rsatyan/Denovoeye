 Ext.define('kharidy.util.Util', {

 	singleton: true,
 	defaultMerchantLogo : "resources/images/merchant.png", 	

 	api : (function(){
 		return {
 			merchant : '/merchant'
 		}
 	})(), 

 	getRating : function(rating, max, hideRatingValue,totalcnt){
		if(rating !== undefined){
			var str = '<div class="ratings">';
			rating = parseFloat(rating);
			max = max || 5;

			for(var i=1; i<=max; i++){
				if(i <= rating){
						str += '<div class="star full-star"></div>';
				}

				if(i > rating){
						if(rating % 1 !== 0 && (i - rating) < 1 ){
										str += '<div class="star half-star"></div>';
						}else{
										str += '<div class="star no-star"></div>';
						}
				}
			}

			if(!hideRatingValue){
				str += '<div class="value">' + rating + ' (' + totalcnt  + ')</div>';
			}
			
			str += '</div>';
			console.log(str);
			return str;
		}

		return "Not rated";
	},

	formatCurrency : function(num) {
		    num = num.toString().replace(/\$|\,/g, '');
		    if (isNaN(num))
		        num = "0";
		    sign = (num == (num = Math.abs(num)));
		    num = Math.floor(num * 100 + 0.50000000001);
		    num = Math.floor(num / 100).toString();
		    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		        num = num.substring(0, num.length - (4 * i + 3)) + ','
		                + num.substring(num.length - (4 * i + 3));
		    return (((sign) ? '' : '-') + 'Rs. ' + num /*+ '.' + cents*/);
	}

 });