backupApp.service('EditUriBackendConfig', function(AppService, AppUtils, SystemInfo) {

	var self = this;

	// All backends with a custom UI must register here
	this.templates = { };

	// Loaders are a way for backends to request extra data from the server
	this.loaders = { };

	// Parsers take a decomposed uri input and sets up the scope variables
	this.parsers = { };

	// Builders take the scope and produce the uri output
	this.builders = { };

	// Validaters check the input and show the user an error or warning
	this.validaters = { };

	this.defaultbackend = 'file';
	this.defaulttemplate = 'templates/backends/generic.html';
	this.defaultbuilder = function(scope) {
		var opts = {};
		self.merge_in_advanced_options(scope, opts);

		var url = AppUtils.format('{0}{1}://{2}{3}/{4}{5}',
			scope.Backend.Key,
			(scope.SupportsSSL && scope.UseSSL) ? 's' : '',
			scope.Server || '',
			(scope.Port || '') == '' ? '' : ':' + scope.Port,
			scope.Path || '',
			AppUtils.encodeDictAsUrl(opts)
		);

		return url;
	};

	this.merge_in_advanced_options = function(scope, dict) {
		if (scope.Username != null && scope.Username != '')
			dict['auth-username'] = scope.Username;
		if (scope.Password != null && scope.Password != '')
			dict['auth-password'] = scope.Password;

		if (!AppUtils.parse_extra_options(scope.AdvancedOptions, dict))
			return false;

		for(var k in dict)
			if (k.indexOf('--') == 0) {
				dict[k.substr(2)] = dict[k];
				delete dict[k];
			}

		return true;

	};

	this.show_error_dialog = function(msg) {
		alert(msg);
		return false;
	}

	this.show_warning_dialog = function(msg) {
		return confirm(msg);
	}

	this.defaultvalidater = function(scope) {
		return true;
	};

	this.require_field = function(scope, field, label) {
		if ((scope[field] || '').trim().length == 0)
			return self.show_error_dialog('You must fill in ' + (label || field));

		return true;
	};

	this.require_server = function(scope) {
		if ((scope.Server || '').trim().length == 0)
			return self.show_error_dialog('You must fill in the server name or address');

		return true;
	};

	this.require_path = function(scope) {
		if ((scope.Path || '').trim().length == 0)
			return self.show_error_dialog('You must fill in the path');

		return true;
	};

	this.recommend_path = function(scope) {
		if ((scope.Path || '').trim().length == 0)
			return self.show_warning_dialog('If you do not enter a path, all files will be stored in the login folder.\nAre you sure this is what you want?');

		return true;
	};

	this.require_username_and_password = function(scope) {
		if ((scope.Username || '').trim().length == 0)
			return self.show_error_dialog('You must fill in the username');
		if ((scope.Password || '').trim().length == 0)
			return self.show_error_dialog('You must fill in the password');

		return true;
	};

});