var request = require ("request");

var config = {
	API_BASE_URL: "https://api.mercadolibre.com",
	MIME_JSON: "application/json",
	MIME_FORM: "application/x-www-form-urlencoded"
};

MP = function (clientId, clientSecret) {
	this.__clientId = clientId;
	this.__clientSecret = clientSecret;
	this.__proxy = null;

	this.proxy = function (proxy) {
		this.__proxy = proxy;

		return this;
	};

	this.__getAccessToken = function () {
		var __self = this;

		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		if (!next) {
			throw new Error ("No callback function defined");
			return;
		}

		request({
			"uri": config.API_BASE_URL + "/oauth/token",
			"method": "POST",
			"form": {
				"client_id": this.__clientId,
				"client_secret": this.__clientSecret,
				"grant_type": "client_credentials"
			},
			"headers": {
				"Accept": config.MIME_JSON
			},
			"proxy": __self.__proxy
		}, function(error, response, body) {
			(typeof body == "string") && (body = JSON.parse(body));

			if (error) {
				next (error);
			} else if (response.statusCode != 200) {
				next (body)
			} else {
				next (null, body.access_token);
			}
		});
	};

	/**
	Get information for specific payment
	@param id
	@return json
	*/    
	this.getPaymentInfo = function (id) {
		var __self = this;

		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		if (!next) {
			throw new Error ("No callback function defined");
			return;
		}

		this.__getAccessToken (function (err, accessToken){
			if (err) {
				next (err);
				return;
			}

			request({
				"uri": config.API_BASE_URL + "/collections/notifications/"+id+"?access_token="+accessToken,
				"method": "GET",
				"json": true,
				"proxy": __self.__proxy
			}, function(error, response, body) {
				if (error) {
					next (error);
				} else {
					next (null, {
								"status": response.statusCode,
								"response": body
							});
				}
			});
		});
	};

	/**
	Refund accredited payment
	@param id
	@return json
	*/    
	this.refundPayment = function (id) {
		var __self = this;

		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		if (!next) {
			throw new Error ("No callback function defined");
			return;
		}

		this.__getAccessToken (function (err, accessToken){
			if (err) {
				next (err);
				return;
			}

			request({
				"uri": config.API_BASE_URL + "/collections/"+id+"?access_token="+accessToken,
				"method": "PUT",
				"json": {
					"status": "refunded"
				},
				"proxy": __self.__proxy
			}, function(error, response, body) {
				if (error) {
					next (error);
				} else {
					next (null, {
								"status": response.statusCode,
								"response": body
							});
				}
			});
		});
	};

	/**
	Cancel pending payment
	@param id
	@return json
	*/    
	this.cancelPayment = function (id) {
		var __self = this;

		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		if (!next) {
			throw new Error ("No callback function defined");
			return;
		}

		this.__getAccessToken (function (err, accessToken){
			if (err) {
				next (err);
				return;
			}

			request({
				"uri": config.API_BASE_URL + "/collections/"+id+"?access_token="+accessToken,
				"method": "PUT",
				"json": {
					"status": "cancelled"
				},
				"proxy": __self.__proxy
			}, function(error, response, body) {
				if (error) {
					next (error);
				} else {
					next (null, {
								"status": response.statusCode,
								"response": body
							});
				}
			});
		});
	};

	/**
	Search payments according to filters, with pagination
	@param filters
	@param offset
	@param limit
	@return json
	*/
	this.searchPayment = function (filters, offset, limit) {
		var __self = this;

		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		if (!next) {
			throw new Error ("No callback function defined");
			return;
		}

		this.__getAccessToken (function (err, accessToken){
			if (err) {
				next (err);
				return;
			}

			request({
				"uri": config.API_BASE_URL + "/collections/search?"+this.__build_query(filters),
				"method": "GET",
				"json": true,
				"proxy": __self.__proxy
			}, function(error, response, body) {
				if (error) {
					next (error);
				} else {
					next (null, {
								"status": response.statusCode,
								"response": body
							});
				}
			});
		});
	};

    /**
    Create a checkout preference
    @param preference
    @return json
    */
    this.createPreference = function (preference){
		var __self = this;

		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		if (!next) {
			throw new Error ("No callback function defined");
			return;
		}

		this.__getAccessToken (function (err, accessToken){
			if (err) {
				next (err);
				return;
			}

			request({
				"uri": config.API_BASE_URL + "/checkout/preferences?access_token="+accessToken,
				"method": "POST",
				"json": preference,
				"proxy": __self.__proxy
			}, function(error, response, body) {
				if (error) {
					next (error);
				} else {
					next (null, {
								"status": response.statusCode,
								"response": body
							});
				}
			});
		});
    };

	/**
	Update a checkout preference
	@param id
	@param preference
	@return json
	*/
	this.updatePreference = function (id, preference) {
		var __self = this;

		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		if (!next) {
			throw new Error ("No callback function defined");
			return;
		}

		this.__getAccessToken (function (err, accessToken){
			if (err) {
				next (err);
				return;
			}

			request({
				"uri": config.API_BASE_URL + "/checkout/preferences/"+id+"?access_token="+accessToken,
				"method": "PUT",
				"json": preference,
				"proxy": __self.__proxy
			}, function(error, response, body) {
				if (error) {
					next (error);
				} else {
					next (null, {
								"status": response.statusCode,
								"response": body
							});
				}
			});
		});
	};

	/**
	Update a checkout preference
	@param id
	@param preference
	@return json
	*/
	this.getPreference = function (id) {
		var __self = this;

		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		if (!next) {
			throw new Error ("No callback function defined");
			return;
		}

		this.__getAccessToken (function (err, accessToken){
			if (err) {
				next (err);
				return;
			}

			request({
				"uri": config.API_BASE_URL + "/checkout/preferences/"+id+"?access_token="+accessToken,
				"method": "GET",
				"json": true,
				"proxy": __self.__proxy
			}, function(error, response, body) {
				if (error) {
					next (error);
				} else {
					next (null, {
								"status": response.statusCode,
								"response": body
							});
				}
			});
		});
	};

	/*************************************************************************/
	this.__build_query = function (params) {
		var elements = []

		for (var key in params) {
			if (params[key] == null) {
				params[key] = "";
			}

			elements.push(key+"="+escape(params[key]));
		}

		return elements.join("&");
	}
}

module.exports = MP;