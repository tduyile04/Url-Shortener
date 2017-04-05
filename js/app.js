{

	'use strict'

	angular.module('urlShortener', [])
	.controller('urlShortenerController', urlShortenerController);

	urlShortenerController.$inject = ['$scope'];

	function urlShortenerController($scope) {
		
		$scope.longUrl = "";
		$scope.shortUrl = "";

		$scope.displayShortenUrl = function() {

			let temp = encode($scope.longUrl);
			$scope.shortUrl = temp;
		}
	}



	/**
	 *	@params	longUrl
	 *	testUrl    https://news.ycombinator.com/?item_id=135953
	 *	converts the longUrl into a corresponding compact url
	 */
	function encode(longUrl) {

		const webProtocol = "https://";
		const shortContentUrl = "tolu.dl";

		//temporary method for retrieving the key value
		//to be replaced with regex matching patterns
		let item_id = longUrl.split("?")[1].split("=")[1];

		let base62 = list_encode_id_base62(item_id);
		let result = map_to_char(base62);

		return webProtocol + shortContentUrl + "/" + result;
	}

	/**
	 *	@params	item_id
	 *	converts the unique id num from the query into a list of digits in base 62
	 */
	function list_encode_id_base62(num) {
		let digits = []
		const base = 62
		let temp = 0

		while (num > 0) {
			temp = num % base;
			digits.push(temp); 
			num = Math.trunc(num/base);
		}

		digits = digits.reverse();
		return digits;
	}

	/**
	 *	@params	digits
	 *	converts the digits in base 62 into a corresponding character/number value
	 *	and joins them to form a single string character
	 */
	function map_to_char(digits) {
		let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q",
							  "r","s","t","u","v","w","x","y","z"]
		let numbers = ["0","1","2","3","4","5","6","7","8","9"]

		//const BASE_DIGIT_LOWER = 0
		const BASE_DIGIT_UPPER = 26
		const BASE_DIGIT_NUM = 52

		let result = []
		let convert = ""

		if (typeof digits === 'object') {

			digits.forEach(digit => {
				if (digit <= 25) {
					convert = alphabet[digit];
					result.push(convert);
				}
				else if (digit > 25 && digit <= 51) {
					convert = alphabet[digit - BASE_DIGIT_UPPER].toUpperCase();
					result.push(convert);
				}
				else {
					convert = alphabet[digit - BASE_DIGIT_NUM];
					result.push(convert);
				}
			})

		convert = result.join('');
		return convert;
		}
	}

	function decode (convertUrl) {

		//const BASE_DIGIT_LOWER = 0
		const BASE_DIGIT_UPPER = 26
		const BASE_DIGIT_NUM = 52

		let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q",
							  "r","s","t","u","v","w","x","y","z"]
		let upper_alpha = []
		let list = []
		
		alphabet.forEach(letter => {
		  upper_alpha.push(letter.toUpperCase())
		})
		
		let numbers = ["0","1","2","3","4","5","6","7","8","9"]

		//temporary method for retrieving the key value
		//to be replaced with regex matching patterns

		let keys = convertUrl.split("/")[3]

		keys = keys.split('');

		keys.forEach(key => {
			
			if (alphabet.indexOf(key) != -1) {
				list.push(alphabet.indexOf(key))
			}
			else if (upper_alpha.indexOf(key) != -1) {
				list.push(upper_alpha.indexOf(key) + BASE_DIGIT_UPPER)

			}
			else {
				list.push(numbers.indexOf(key) + BASE_DIGIT_NUM)
			}
		}) 

		//get base 62 digit e.g [51, 60, 2, 21]
		const BASE = 62
		let i = 1
		let total = 0

		list.forEach(digit => {
			let power = list.length - i;

			total += digit * Math.pow(BASE, power);
			i++;
		})

		return total;

	}

}