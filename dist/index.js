'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var BASE = "https://hacker-news.firebaseio.com";
var HACKERNEWS_COMPONENT = 'com.robinmalfait.hn';

exports.default = function (robot) {
  var List = robot.cards.List;
  var _robot$UI = robot.UI;
  var Icon = _robot$UI.Icon;
  var A = _robot$UI.A;


  var HN = _react2.default.createClass({
    displayName: 'HN',
    getDefaultProps: function getDefaultProps() {
      return {
        itemsToShow: 20
      };
    },
    getInitialState: function getInitialState() {
      var itemsToShow = this.props.itemsToShow;


      return {
        itemsToShow: itemsToShow,
        loading: true,
        items: []
      };
    },
    componentDidMount: function componentDidMount() {
      var _this = this;

      setTimeout(function () {
        var _state = _this.state;
        var itemsToShow = _state.itemsToShow;
        var loading = _state.loading;


        if (loading) {
          _this.fetchTopStories(function (items) {
            _this.setState({ loading: false });
            items.slice(0, itemsToShow).forEach(function (id) {
              _this.fetchStory(id, function (story) {
                var items = _this.state.items;


                items.push(story);

                _this.setState({ items: items });
              });
            });
          });
        }
      }, 800);
    },
    fetchStory: function fetchStory(id, done) {
      robot.fetchJson(BASE + '/v0/item/' + id + '.json').then(function (data) {
        done({
          url: data.url,
          title: data.title,
          by: data.by,
          favicon: robot.faviconUrl(data.url)
        });
      });
    },
    fetchTopStories: function fetchTopStories(done) {
      robot.fetchJson(BASE + '/v0/topstories.json').then(function (data) {
        return done(data);
      });
    },
    renderItem: function renderItem(story) {
      return _react2.default.createElement(
        A,
        { target: '_blank', href: story.url },
        story.favicon ? _react2.default.createElement('img', { style: { width: '16px', height: '16px' }, src: story.favicon, alt: story.title }) : _react2.default.createElement(Icon, { icon: 'globe' }),
        ' ',
        story.title,
        ' - ',
        story.by
      );
    },
    render: function render() {
      var other = _objectWithoutProperties(this.props, []);

      var loading = this.state.loading;


      var items = loading ? [_react2.default.createElement(
        'h3',
        null,
        'Loading...'
      )] : this.state.items.map(this.renderItem);

      return _react2.default.createElement(List, _extends({}, other, { title: 'Hackernews', items: items }));
    }
  });

  robot.registerComponent(HN, HACKERNEWS_COMPONENT);

  robot.listen(/^hn ?(.*)?$/, {
    description: "Hackernews",
    usage: 'hn <items_to_show?>'
  }, function (res) {
    robot.addCard(HACKERNEWS_COMPONENT, {
      itemsToShow: res.matches[1] || 20
    });
  });
};