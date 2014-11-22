var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
Backbone.LocalStorage = require("backbone.localstorage");


(function($){

	var Todo = Backbone.Model.extend({});

	var TodoList = Backbone.Collection.extend({

		model: Todo,
		localStorage: new Backbone.LocalStorage("todos-backbone")
	})

	var todos = new TodoList;

	var ListView = Backbone.View.extend({

		tagName: "li",

		template: _.template($('#todo-template').html()),
		
		initialize: function() {
			this.render();
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			$("#todo-list").append(this.$el);
			return this;
		}, 

		events: {
			"click .delete" : "delete",
			"dblclick .view" : "edit",
			"blur .edit" : "close",
			"keypress .edit"  : "updateOnEnter",
		},

		delete: function() {
			this.model.destroy();
		}, 

		edit: function() {
			this.$el.addClass("editing");
      		this.$(".edit").focus();
		},

		close: function() {
			var value = this.$(".edit").val();
			this.model.save({name: value});
        	this.$el.removeClass("editing");
		},

		updateOnEnter: function(e) {
			if (e.keyCode == 13) {
				this.close();
			}
		}
	});

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

