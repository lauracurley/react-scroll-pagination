(function () {
	"use strict";

	var ScrollPagination = window.ScrollPagination;

	var Main = React.createClass({
		displayName: "Main",

		render: function () {
			return ScrollPagination({
				loadNextPage: this.props.loadNextPage,
				loadPrevPage: this.props.loadPrevPage,
				unloadPage: this.props.unloadPage,
				hasNextPage: this.props.hasNextPage,
				hasPrevPage: this.props.hasPrevPage,
				pageIds: this.props.pages.map(function (page) { return page.id; })
			}, this.props.pages.map(function (page) {
				return page.items.map(function (item) {
					return React.DOM.div({ key: item.id }, item.text);
				}.bind(this));
			}.bind(this)));
		}
	});

	var pages = [];
	var loadedPages = [];
	var pageItems = function (pageId) {
		var items = [];
		for (var i = 0; i < 20; i++) {
			items.push({
				id: pageId +"_item-"+ (i+1),
				text: "Item "+ pageId.replace(/\D*/, '') +" - "+ (i+1)
			});
		}
		return items;
	};
	for (var i = 0; i < 1000; i++) {
		pages.push({
			id: "page-"+ (i+1),
			items: pageItems("page-"+ (i+1))
		});
	}

	var hasNextPage = function () {
		if (loadedPages[loadedPages.length-1] === pages[pages.length-1]) {
			return false;
		}
		return true;
	};

	var hasPrevPage = function () {
		if (loadedPages[0] === pages[0]) {
			return false;
		}
		return true;
	};

	var loadNextPage = function () {
		setTimeout(function () {
			var lastLoadedPage = loadedPages[loadedPages.length-1];
			var index = pages.indexOf(lastLoadedPage);
			var page = pages[index+1];
			if (page) {
				loadedPages.push(page);
			} else {
				throw new Error("Invalid attempt to load next page!");
			}

			view.setProps({
				pages: loadedPages,
				hasNextPage: hasNextPage()
			});
		}, 0);
	};

	var loadPrevPage = function () {
		setTimeout(function () {
			var firstLoadedPage = loadedPages[0];
			var index = pages.indexOf(firstLoadedPage);
			var page = pages[index-1];
			if (page) {
				loadedPages.unshift(page);
			} else {
				throw new Error("Invalid attempt to load prev page!");
			}

			view.setProps({
				pages: loadedPages,
				hasPrevPage: hasPrevPage()
			});
		}, 0);
	};

	var unloadPage = function (pageId) {
		setTimeout(function () {
			var page = null;
			var index = null;
			for (var i = 0, len = loadedPages.length; i < len; i++) {
				if (loadedPages[i].id === pageId) {
					page = loadedPages[i];
					index = i;
					break;
				}
			}

			if (page === null) {
				throw new Error("Invalid attempt to unload page: "+ pageId);
			}

			loadedPages = loadedPages.slice(0, index).concat(loadedPages.slice(index+1, loadedPages.length));
			view.setProps({
				pages: loadedPages,
				hasNextPage: hasNextPage(),
				hasPrevPage: hasPrevPage()
			});
		}, 0);
	};

	var el = document.getElementById("main");
	var view = React.renderComponent(Main({
		pages: loadedPages,
		loadNextPage: loadNextPage,
		loadPrevPage: loadPrevPage,
		unloadPage: unloadPage,
		hasNextPage: true,
		hasPrevPage: false
	}), el);

	loadNextPage();
})();
