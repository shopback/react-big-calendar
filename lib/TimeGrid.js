'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDom = require('react-dom');

var _dates = require('./utils/dates');

var _dates2 = _interopRequireDefault(_dates);

var _localizer = require('./localizer');

var _localizer2 = _interopRequireDefault(_localizer);

var _DaySlot = require('./DaySlot');

var _DaySlot2 = _interopRequireDefault(_DaySlot);

var _EventRow = require('./EventRow');

var _EventRow2 = _interopRequireDefault(_EventRow);

var _TimeGutter = require('./TimeGutter');

var _TimeGutter2 = _interopRequireDefault(_TimeGutter);

var _BackgroundCells = require('./BackgroundCells');

var _BackgroundCells2 = _interopRequireDefault(_BackgroundCells);

var _class = require('dom-helpers/class');

var _class2 = _interopRequireDefault(_class);

var _width = require('dom-helpers/query/width');

var _width2 = _interopRequireDefault(_width);

var _scrollbarSize = require('dom-helpers/util/scrollbarSize');

var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);

var _messages = require('./utils/messages');

var _messages2 = _interopRequireDefault(_messages);

var _propTypes = require('./utils/propTypes');

var _helpers = require('./utils/helpers');

var _constants = require('./utils/constants');

var _accessors = require('./utils/accessors');

var _eventLevels2 = require('./utils/eventLevels');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MIN_ROWS = 2;

var TimeGrid = _react2.default.createClass({
  displayName: 'TimeGrid',


  propTypes: _extends({}, _DaySlot2.default.propTypes, _TimeGutter2.default.propTypes, {

    step: _react2.default.PropTypes.number,
    min: _react2.default.PropTypes.instanceOf(Date),
    max: _react2.default.PropTypes.instanceOf(Date),
    dayFormat: _propTypes.dateFormat,
    rtl: _react2.default.PropTypes.bool
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      step: 30,
      min: _dates2.default.startOf(new Date(), 'day'),
      max: _dates2.default.endOf(new Date(), 'day')
    };
  },
  componentWillMount: function componentWillMount() {
    this._gutters = [];
  },
  componentDidMount: function componentDidMount() {
    this._adjustGutter();
  },
  componentDidUpdate: function componentDidUpdate() {
    this._adjustGutter();
  },
  render: function render() {
    var _this = this;

    var _props = this.props;
    var events = _props.events;
    var start = _props.start;
    var end = _props.end;
    var messages = _props.messages;
    var startAccessor = _props.startAccessor;
    var endAccessor = _props.endAccessor;
    var allDayAccessor = _props.allDayAccessor;


    var addGutterRef = function addGutterRef(i) {
      return function (ref) {
        return _this._gutters[i] = ref;
      };
    };

    var range = _dates2.default.range(start, end, 'day');

    this._slots = range.length;

    var allDayEvents = [],
        rangeEvents = [];

    events.forEach(function (event) {
      if ((0, _eventLevels2.inRange)(event, start, end, _this.props)) {
        var eStart = (0, _accessors.accessor)(event, startAccessor),
            eEnd = (0, _accessors.accessor)(event, endAccessor);

        if ((0, _accessors.accessor)(event, allDayAccessor) || !_dates2.default.eq(eStart, eEnd, 'day') || _dates2.default.isJustDate(eStart) && _dates2.default.isJustDate(eEnd)) {
          allDayEvents.push(event);
        } else rangeEvents.push(event);
      }
    });

    allDayEvents.sort(function (a, b) {
      return (0, _eventLevels2.sortEvents)(a, b, _this.props);
    });

    var _endOfRange = (0, _eventLevels2.endOfRange)(range);

    var first = _endOfRange.first;
    var last = _endOfRange.last;


    var segments = allDayEvents.map(function (evt) {
      return (0, _eventLevels2.eventSegments)(evt, first, last, _this.props);
    });

    var _eventLevels = (0, _eventLevels2.eventLevels)(segments);

    var levels = _eventLevels.levels;


    return _react2.default.createElement(
      'div',
      { className: 'rbc-time-view' },
      _react2.default.createElement(
        'div',
        { ref: 'headerCell', className: 'rbc-time-header' },
        _react2.default.createElement(
          'div',
          { className: 'rbc-row' },
          _react2.default.createElement('div', { ref: addGutterRef(0), className: 'rbc-gutter-cell' }),
          this.renderHeader(range)
        ),
        _react2.default.createElement(
          'div',
          { className: 'rbc-row' },
          _react2.default.createElement(
            'div',
            { ref: addGutterRef(1), className: 'rbc-gutter-cell' },
            (0, _messages2.default)(messages).allDay
          ),
          _react2.default.createElement(
            'div',
            { ref: 'allDay', className: 'rbc-allday-cell' },
            _react2.default.createElement(_BackgroundCells2.default, {
              slots: range.length,
              container: function container() {
                return _this.refs.allDay;
              },
              selectable: this.props.selectable
            }),
            _react2.default.createElement(
              'div',
              { style: { zIndex: 1, position: 'relative' } },
              this.renderAllDayEvents(range, levels)
            )
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { ref: 'content', className: 'rbc-time-content' },
        _react2.default.createElement(_TimeGutter2.default, _extends({ ref: 'gutter' }, this.props)),
        this.renderEvents(range, rangeEvents)
      )
    );
  },
  renderEvents: function renderEvents(range, events) {
    var _this2 = this;

    var _props2 = this.props;
    var min = _props2.min;
    var max = _props2.max;
    var endAccessor = _props2.endAccessor;
    var startAccessor = _props2.startAccessor;
    var components = _props2.components;

    var today = new Date();

    return range.map(function (date, idx) {
      var daysEvents = events.filter(function (event) {
        return _dates2.default.inRange(date, (0, _accessors.accessor)(event, startAccessor), (0, _accessors.accessor)(event, endAccessor), 'day');
      });

      return _react2.default.createElement(_DaySlot2.default, _extends({}, _this2.props, {
        min: _dates2.default.merge(date, min),
        max: _dates2.default.merge(date, max),
        eventComponent: components.event,
        className: (0, _classnames2.default)({ 'rbc-now': _dates2.default.eq(date, today, 'day') }),
        style: (0, _eventLevels2.segStyle)(1, _this2._slots),
        key: idx,
        date: date,
        events: daysEvents
      }));
    });
  },
  renderAllDayEvents: function renderAllDayEvents(range, levels) {
    var _this3 = this;

    var _endOfRange2 = (0, _eventLevels2.endOfRange)(range);

    var first = _endOfRange2.first;
    var last = _endOfRange2.last;


    while (levels.length < MIN_ROWS) {
      levels.push([]);
    }return levels.map(function (segs, idx) {
      return _react2.default.createElement(_EventRow2.default, {
        eventComponent: _this3.props.components.event,
        titleAccessor: _this3.props.titleAccessor,
        startAccessor: _this3.props.startAccessor,
        endAccessor: _this3.props.endAccessor,
        allDayAccessor: _this3.props.allDayAccessor,
        eventPropGetter: _this3.props.eventPropGetter,
        onSelect: _this3._selectEvent,
        slots: _this3._slots,
        key: idx,
        segments: segs,
        start: first,
        end: last
      });
    });
  },
  renderHeader: function renderHeader(range) {
    var _this4 = this;

    var _props3 = this.props;
    var dayFormat = _props3.dayFormat;
    var culture = _props3.culture;


    return range.map(function (date, i) {
      return _react2.default.createElement(
        'div',
        { key: i,
          className: 'rbc-header',
          style: (0, _eventLevels2.segStyle)(1, _this4._slots)
        },
        _react2.default.createElement(
          'a',
          { href: '#', onClick: _this4._headerClick.bind(null, date) },
          _localizer2.default.format(date, dayFormat, culture)
        )
      );
    });
  },
  _headerClick: function _headerClick(date, e) {
    e.preventDefault();
    (0, _helpers.notify)(this.props.onNavigate, [_constants.navigate.DATE, date]);
  },
  _selectEvent: function _selectEvent() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (0, _helpers.notify)(this.props.onSelectEvent, args);
  },
  _adjustGutter: function _adjustGutter() {
    var isRtl = this.props.rtl;
    var header = this.refs.headerCell;
    var width = this._gutterWidth;
    var gutterCells = [(0, _reactDom.findDOMNode)(this.refs.gutter)].concat(this._gutters);
    var isOverflowing = this.refs.content.scrollHeight > this.refs.content.clientHeight;

    if (!width) {
      this._gutterWidth = Math.max.apply(Math, gutterCells.map(_width2.default));

      if (this._gutterWidth) {
        width = this._gutterWidth + 'px';
        gutterCells.forEach(function (node) {
          return node.style.width = width;
        });
      }
    }

    if (isOverflowing) {
      _class2.default.addClass(header, 'rbc-header-overflowing');
      this.refs.headerCell.style[!isRtl ? 'marginLeft' : 'marginRight'] = '';
      this.refs.headerCell.style[isRtl ? 'marginLeft' : 'marginRight'] = (0, _scrollbarSize2.default)() + 'px';
    } else {
      _class2.default.removeClass(header, 'rbc-header-overflowing');
    }
  }
});

exports.default = TimeGrid;
module.exports = exports['default'];