var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
Backbone.LocalStorage = require("backbone.localstorage");

(function($){

	var Todo = Backbone.Model.extend({});

	var todo = new Todo({ name: "Drink coffee", completed: false });

	var TodoList = Backbone.Collection.extend({

		model: Todo,
		localStorage: new Backbone.LocalStorage("todos-backbone")
	})

	var todos = new TodoList;

	var ListView = Backbone.View.extend({

		template: _.template("<%= name %>"),
		
		initialize: function() {
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			$('body').append(this.$el);
			return this;
		} 

		// events: {
		// 	"blur .edit" : "close"
		// },

		// close: function() {
		// 	var value = this.input.val();
		// 	// var todo = new Todo({ name: value });
		// 	this.model.save({name: value});
		// }
	});

	var list = new ListView({model: todo}); 

	var AppView = Backbone.View.extend({

		el: $("#todoapp"), 

		initialize: function() {
			this.listenTo(todos, 'add', this.addOne);
			todos.fetch();
		},

		events: {
			"keypress #new-todo" : "createonEnter"
		},

		addOne: function(todo) {
      		var list = new ListView({model: todo});
    	},

		createonEnter: function(e) {
			if (e.keyCode != 13) return;
			todos.create({name: this.$('#new-todo').val()});
			this.$('#new-todo').val('');
		}
	})

	var app = new AppView;


})($);

