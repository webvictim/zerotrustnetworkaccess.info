/*-------------------------------------------------------------------------------------
[TABLE OF CONTENTS]
01. SMARTMENUS
02. STICKY HEADER
03. HAMBURGER MENU ICON
04. PICTUREFILL RETINA IMAGE
05. ISOTOPE
06. OWL CAROUSEL
07. PLYR
08. LIGHTGALLERY
09. MOUSEWHEEL
10. VALIDATOR
11. CIRCLE INFO BOX
12. PROGRESSBAR
13. WAYPOINTS
14. COUNTER UP
15. COUNTDOWN
16. VIDEO WRAPPER
17. TYPER
18. AOS
19. EASING
-------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------*/
/*	01. SMARTMENUS
/*-----------------------------------------------------------------------------------*/
/*!
 * SmartMenus jQuery Plugin - v1.1.0 - September 17, 2017
 * http://www.smartmenus.org/
 *
 * Copyright Vasil Dinkov, Vadikom Web Ltd.
 * http://vadikom.com
 *
 * Licensed MIT
 */
!(function (t) {
  "function" == typeof define && define.amd
    ? define(["jquery"], t)
    : "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = t(require("jquery")))
    : t(jQuery);
})(function ($) {
  var menuTrees = [],
    mouse = !1,
    touchEvents = "ontouchstart" in window,
    mouseDetectionEnabled = !1,
    requestAnimationFrame =
      window.requestAnimationFrame ||
      function (t) {
        return setTimeout(t, 1e3 / 60);
      },
    cancelAnimationFrame =
      window.cancelAnimationFrame ||
      function (t) {
        clearTimeout(t);
      },
    canAnimate = !!$.fn.animate;
  function initMouseDetection(t) {
    var e = ".smartmenus_mouse";
    if (mouseDetectionEnabled || t)
      mouseDetectionEnabled &&
        t &&
        ($(document).off(e), (mouseDetectionEnabled = !1));
    else {
      var a = !0,
        n = null,
        i = {
          mousemove: function (t) {
            var e = { x: t.pageX, y: t.pageY, timeStamp: new Date().getTime() };
            if (n) {
              var i = Math.abs(n.x - e.x),
                s = Math.abs(n.y - e.y);
              if (
                (0 < i || 0 < s) &&
                i <= 2 &&
                s <= 2 &&
                e.timeStamp - n.timeStamp <= 300 &&
                ((mouse = !0), a)
              ) {
                var o = $(t.target).closest("a");
                o.is("a") &&
                  $.each(menuTrees, function () {
                    if ($.contains(this.$root[0], o[0]))
                      return this.itemEnter({ currentTarget: o[0] }), !1;
                  }),
                  (a = !1);
              }
            }
            n = e;
          },
        };
      (i[
        touchEvents
          ? "touchstart"
          : "pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut"
      ] = function (t) {
        isTouchEvent(t.originalEvent) && (mouse = !1);
      }),
        $(document).on(getEventsNS(i, e)),
        (mouseDetectionEnabled = !0);
    }
  }
  function isTouchEvent(t) {
    return !/^(4|mouse)$/.test(t.pointerType);
  }
  function getEventsNS(t, e) {
    e || (e = "");
    var i = {};
    for (var s in t) i[s.split(" ").join(e + " ") + e] = t[s];
    return i;
  }
  return (
    ($.SmartMenus = function (t, e) {
      (this.$root = $(t)),
        (this.opts = e),
        (this.rootId = ""),
        (this.accessIdPrefix = ""),
        (this.$subArrow = null),
        (this.activatedItems = []),
        (this.visibleSubMenus = []),
        (this.showTimeout = 0),
        (this.hideTimeout = 0),
        (this.scrollTimeout = 0),
        (this.clickActivated = !1),
        (this.focusActivated = !1),
        (this.zIndexInc = 0),
        (this.idInc = 0),
        (this.$firstLink = null),
        (this.$firstSub = null),
        (this.disabled = !1),
        (this.$disableOverlay = null),
        (this.$touchScrollingSub = null),
        (this.cssTransforms3d =
          "perspective" in t.style || "webkitPerspective" in t.style),
        (this.wasCollapsible = !1),
        this.init();
    }),
    $.extend($.SmartMenus, {
      hideAll: function () {
        $.each(menuTrees, function () {
          this.menuHideAll();
        });
      },
      destroy: function () {
        for (; menuTrees.length; ) menuTrees[0].destroy();
        initMouseDetection(!0);
      },
      prototype: {
        init: function (t) {
          var i = this;
          if (!t) {
            menuTrees.push(this),
              (this.rootId = (
                new Date().getTime() +
                Math.random() +
                ""
              ).replace(/\D/g, "")),
              (this.accessIdPrefix = "sm-" + this.rootId + "-"),
              this.$root.hasClass("sm-rtl") &&
                (this.opts.rightToLeftSubMenus = !0);
            var e = ".smartmenus";
            this.$root
              .data("smartmenus", this)
              .attr("data-smartmenus-id", this.rootId)
              .dataSM("level", 1)
              .on(
                getEventsNS(
                  {
                    "mouseover focusin": $.proxy(this.rootOver, this),
                    "mouseout focusout": $.proxy(this.rootOut, this),
                    keydown: $.proxy(this.rootKeyDown, this),
                  },
                  e
                )
              )
              .on(
                getEventsNS(
                  {
                    mouseenter: $.proxy(this.itemEnter, this),
                    mouseleave: $.proxy(this.itemLeave, this),
                    mousedown: $.proxy(this.itemDown, this),
                    focus: $.proxy(this.itemFocus, this),
                    blur: $.proxy(this.itemBlur, this),
                    click: $.proxy(this.itemClick, this),
                  },
                  e
                ),
                "a"
              ),
              (e += this.rootId),
              this.opts.hideOnClick &&
                $(document).on(
                  getEventsNS(
                    {
                      touchstart: $.proxy(this.docTouchStart, this),
                      touchmove: $.proxy(this.docTouchMove, this),
                      touchend: $.proxy(this.docTouchEnd, this),
                      click: $.proxy(this.docClick, this),
                    },
                    e
                  )
                ),
              $(window).on(
                getEventsNS(
                  { "resize orientationchange": $.proxy(this.winResize, this) },
                  e
                )
              ),
              this.opts.subIndicators &&
                ((this.$subArrow = $("<span/>").addClass("sub-arrow")),
                this.opts.subIndicatorsText &&
                  this.$subArrow.html(this.opts.subIndicatorsText)),
              initMouseDetection();
          }
          if (
            ((this.$firstSub = this.$root
              .find("ul")
              .each(function () {
                i.menuInit($(this));
              })
              .eq(0)),
            (this.$firstLink = this.$root.find("a").eq(0)),
            this.opts.markCurrentItem)
          ) {
            var s = /(index|default)\.[^#\?\/]*/i,
              o = window.location.href.replace(s, ""),
              a = o.replace(/#.*/, "");
            this.$root.find("a").each(function () {
              var t = this.href.replace(s, ""),
                e = $(this);
              (t != o && t != a) ||
                (e.addClass("current"),
                i.opts.markCurrentTree &&
                  e
                    .parentsUntil("[data-smartmenus-id]", "ul")
                    .each(function () {
                      $(this).dataSM("parent-a").addClass("current");
                    }));
            });
          }
          this.wasCollapsible = this.isCollapsible();
        },
        destroy: function (t) {
          if (!t) {
            var e = ".smartmenus";
            this.$root
              .removeData("smartmenus")
              .removeAttr("data-smartmenus-id")
              .removeDataSM("level")
              .off(e),
              (e += this.rootId),
              $(document).off(e),
              $(window).off(e),
              this.opts.subIndicators && (this.$subArrow = null);
          }
          this.menuHideAll();
          var i = this;
          this.$root
            .find("ul")
            .each(function () {
              var t = $(this);
              t.dataSM("scroll-arrows") && t.dataSM("scroll-arrows").remove(),
                t.dataSM("shown-before") &&
                  ((i.opts.subMenusMinWidth || i.opts.subMenusMaxWidth) &&
                    t
                      .css({ width: "", minWidth: "", maxWidth: "" })
                      .removeClass("sm-nowrap"),
                  t.dataSM("scroll-arrows") &&
                    t.dataSM("scroll-arrows").remove(),
                  t.css({
                    zIndex: "",
                    top: "",
                    left: "",
                    marginLeft: "",
                    marginTop: "",
                    display: "",
                  })),
                0 == (t.attr("id") || "").indexOf(i.accessIdPrefix) &&
                  t.removeAttr("id");
            })
            .removeDataSM("in-mega")
            .removeDataSM("shown-before")
            .removeDataSM("scroll-arrows")
            .removeDataSM("parent-a")
            .removeDataSM("level")
            .removeDataSM("beforefirstshowfired")
            .removeAttr("role")
            .removeAttr("aria-hidden")
            .removeAttr("aria-labelledby")
            .removeAttr("aria-expanded"),
            this.$root
              .find("a.has-submenu")
              .each(function () {
                var t = $(this);
                0 == t.attr("id").indexOf(i.accessIdPrefix) &&
                  t.removeAttr("id");
              })
              .removeClass("has-submenu")
              .removeDataSM("sub")
              .removeAttr("aria-haspopup")
              .removeAttr("aria-controls")
              .removeAttr("aria-expanded")
              .closest("li")
              .removeDataSM("sub"),
            this.opts.subIndicators &&
              this.$root.find("span.sub-arrow").remove(),
            this.opts.markCurrentItem &&
              this.$root.find("a.current").removeClass("current"),
            t ||
              ((this.$root = null),
              (this.$firstLink = null),
              (this.$firstSub = null),
              this.$disableOverlay &&
                (this.$disableOverlay.remove(), (this.$disableOverlay = null)),
              menuTrees.splice($.inArray(this, menuTrees), 1));
        },
        disable: function (t) {
          if (!this.disabled) {
            if (
              (this.menuHideAll(),
              !t && !this.opts.isPopup && this.$root.is(":visible"))
            ) {
              var e = this.$root.offset();
              this.$disableOverlay = $(
                '<div class="sm-jquery-disable-overlay"/>'
              )
                .css({
                  position: "absolute",
                  top: e.top,
                  left: e.left,
                  width: this.$root.outerWidth(),
                  height: this.$root.outerHeight(),
                  zIndex: this.getStartZIndex(!0),
                  opacity: 0,
                })
                .appendTo(document.body);
            }
            this.disabled = !0;
          }
        },
        docClick: function (t) {
          this.$touchScrollingSub
            ? (this.$touchScrollingSub = null)
            : ((this.visibleSubMenus.length &&
                !$.contains(this.$root[0], t.target)) ||
                $(t.target).closest("a").length) &&
              this.menuHideAll();
        },
        docTouchEnd: function (t) {
          if (this.lastTouch) {
            if (
              this.visibleSubMenus.length &&
              (void 0 === this.lastTouch.x2 ||
                this.lastTouch.x1 == this.lastTouch.x2) &&
              (void 0 === this.lastTouch.y2 ||
                this.lastTouch.y1 == this.lastTouch.y2) &&
              (!this.lastTouch.target ||
                !$.contains(this.$root[0], this.lastTouch.target))
            ) {
              this.hideTimeout &&
                (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
              var e = this;
              this.hideTimeout = setTimeout(function () {
                e.menuHideAll();
              }, 350);
            }
            this.lastTouch = null;
          }
        },
        docTouchMove: function (t) {
          if (this.lastTouch) {
            var e = t.originalEvent.touches[0];
            (this.lastTouch.x2 = e.pageX), (this.lastTouch.y2 = e.pageY);
          }
        },
        docTouchStart: function (t) {
          var e = t.originalEvent.touches[0];
          this.lastTouch = { x1: e.pageX, y1: e.pageY, target: e.target };
        },
        enable: function () {
          this.disabled &&
            (this.$disableOverlay &&
              (this.$disableOverlay.remove(), (this.$disableOverlay = null)),
            (this.disabled = !1));
        },
        getClosestMenu: function (t) {
          for (var e = $(t).closest("ul"); e.dataSM("in-mega"); )
            e = e.parent().closest("ul");
          return e[0] || null;
        },
        getHeight: function (t) {
          return this.getOffset(t, !0);
        },
        getOffset: function (t, e) {
          var i;
          "none" == t.css("display") &&
            ((i = {
              position: t[0].style.position,
              visibility: t[0].style.visibility,
            }),
            t.css({ position: "absolute", visibility: "hidden" }).show());
          var s = t[0].getBoundingClientRect && t[0].getBoundingClientRect(),
            o =
              s &&
              (e ? s.height || s.bottom - s.top : s.width || s.right - s.left);
          return (
            o || 0 === o || (o = e ? t[0].offsetHeight : t[0].offsetWidth),
            i && t.hide().css(i),
            o
          );
        },
        getStartZIndex: function (t) {
          var e = parseInt(this[t ? "$root" : "$firstSub"].css("z-index"));
          return (
            !t && isNaN(e) && (e = parseInt(this.$root.css("z-index"))),
            isNaN(e) ? 1 : e
          );
        },
        getTouchPoint: function (t) {
          return (
            (t.touches && t.touches[0]) ||
            (t.changedTouches && t.changedTouches[0]) ||
            t
          );
        },
        getViewport: function (t) {
          var e = t ? "Height" : "Width",
            i = document.documentElement["client" + e],
            s = window["inner" + e];
          return s && (i = Math.min(i, s)), i;
        },
        getViewportHeight: function () {
          return this.getViewport(!0);
        },
        getViewportWidth: function () {
          return this.getViewport();
        },
        getWidth: function (t) {
          return this.getOffset(t);
        },
        handleEvents: function () {
          return !this.disabled && this.isCSSOn();
        },
        handleItemEvents: function (t) {
          return this.handleEvents() && !this.isLinkInMegaMenu(t);
        },
        isCollapsible: function () {
          return "static" == this.$firstSub.css("position");
        },
        isCSSOn: function () {
          return "inline" != this.$firstLink.css("display");
        },
        isFixed: function () {
          var t = "fixed" == this.$root.css("position");
          return (
            t ||
              this.$root.parentsUntil("body").each(function () {
                if ("fixed" == $(this).css("position")) return !(t = !0);
              }),
            t
          );
        },
        isLinkInMegaMenu: function (t) {
          return $(this.getClosestMenu(t[0])).hasClass("mega-menu");
        },
        isTouchMode: function () {
          return !mouse || this.opts.noMouseOver || this.isCollapsible();
        },
        itemActivate: function (t, e) {
          var i = t.closest("ul"),
            s = i.dataSM("level");
          if (
            1 < s &&
            (!this.activatedItems[s - 2] ||
              this.activatedItems[s - 2][0] != i.dataSM("parent-a")[0])
          ) {
            var o = this;
            $(i.parentsUntil("[data-smartmenus-id]", "ul").get().reverse())
              .add(i)
              .each(function () {
                o.itemActivate($(this).dataSM("parent-a"));
              });
          }
          if (
            ((this.isCollapsible() && !e) ||
              this.menuHideSubMenus(
                this.activatedItems[s - 1] &&
                  this.activatedItems[s - 1][0] == t[0]
                  ? s
                  : s - 1
              ),
            (this.activatedItems[s - 1] = t),
            !1 !== this.$root.triggerHandler("activate.smapi", t[0]))
          ) {
            var a = t.dataSM("sub");
            a &&
              (this.isTouchMode() ||
                !this.opts.showOnClick ||
                this.clickActivated) &&
              this.menuShow(a);
          }
        },
        itemBlur: function (t) {
          var e = $(t.currentTarget);
          this.handleItemEvents(e) &&
            this.$root.triggerHandler("blur.smapi", e[0]);
        },
        itemClick: function (t) {
          var e = $(t.currentTarget);
          if (this.handleItemEvents(e)) {
            if (
              this.$touchScrollingSub &&
              this.$touchScrollingSub[0] == e.closest("ul")[0]
            )
              return (this.$touchScrollingSub = null), t.stopPropagation(), !1;
            if (!1 === this.$root.triggerHandler("click.smapi", e[0]))
              return !1;
            var i = $(t.target).is(".sub-arrow"),
              s = e.dataSM("sub"),
              o = !!s && 2 == s.dataSM("level"),
              a = this.isCollapsible(),
              n = /toggle$/.test(this.opts.collapsibleBehavior),
              r = /link$/.test(this.opts.collapsibleBehavior),
              h = /^accordion/.test(this.opts.collapsibleBehavior);
            if (s && !s.is(":visible")) {
              if (
                (!r || !a || i) &&
                (this.opts.showOnClick && o && (this.clickActivated = !0),
                this.itemActivate(e, h),
                s.is(":visible"))
              )
                return !(this.focusActivated = !0);
            } else if (a && (n || i))
              return (
                this.itemActivate(e, h),
                this.menuHide(s),
                n && (this.focusActivated = !1),
                !1
              );
            return (
              !(
                (this.opts.showOnClick && o) ||
                e.hasClass("disabled") ||
                !1 === this.$root.triggerHandler("select.smapi", e[0])
              ) && void 0
            );
          }
        },
        itemDown: function (t) {
          var e = $(t.currentTarget);
          this.handleItemEvents(e) && e.dataSM("mousedown", !0);
        },
        itemEnter: function (t) {
          var e = $(t.currentTarget);
          if (this.handleItemEvents(e)) {
            if (!this.isTouchMode()) {
              this.showTimeout &&
                (clearTimeout(this.showTimeout), (this.showTimeout = 0));
              var i = this;
              this.showTimeout = setTimeout(
                function () {
                  i.itemActivate(e);
                },
                this.opts.showOnClick && 1 == e.closest("ul").dataSM("level")
                  ? 1
                  : this.opts.showTimeout
              );
            }
            this.$root.triggerHandler("mouseenter.smapi", e[0]);
          }
        },
        itemFocus: function (t) {
          var e = $(t.currentTarget);
          this.handleItemEvents(e) &&
            (!this.focusActivated ||
              (this.isTouchMode() && e.dataSM("mousedown")) ||
              (this.activatedItems.length &&
                this.activatedItems[this.activatedItems.length - 1][0] ==
                  e[0]) ||
              this.itemActivate(e, !0),
            this.$root.triggerHandler("focus.smapi", e[0]));
        },
        itemLeave: function (t) {
          var e = $(t.currentTarget);
          this.handleItemEvents(e) &&
            (this.isTouchMode() ||
              (e[0].blur(),
              this.showTimeout &&
                (clearTimeout(this.showTimeout), (this.showTimeout = 0))),
            e.removeDataSM("mousedown"),
            this.$root.triggerHandler("mouseleave.smapi", e[0]));
        },
        menuHide: function (t) {
          if (
            !1 !== this.$root.triggerHandler("beforehide.smapi", t[0]) &&
            (canAnimate && t.stop(!0, !0), "none" != t.css("display"))
          ) {
            var e = function () {
              t.css("z-index", "");
            };
            this.isCollapsible()
              ? canAnimate && this.opts.collapsibleHideFunction
                ? this.opts.collapsibleHideFunction.call(this, t, e)
                : t.hide(this.opts.collapsibleHideDuration, e)
              : canAnimate && this.opts.hideFunction
              ? this.opts.hideFunction.call(this, t, e)
              : t.hide(this.opts.hideDuration, e),
              t.dataSM("scroll") &&
                (this.menuScrollStop(t),
                t
                  .css({
                    "touch-action": "",
                    "-ms-touch-action": "",
                    "-webkit-transform": "",
                    transform: "",
                  })
                  .off(".smartmenus_scroll")
                  .removeDataSM("scroll")
                  .dataSM("scroll-arrows")
                  .hide()),
              t
                .dataSM("parent-a")
                .removeClass("highlighted")
                .attr("aria-expanded", "false"),
              t.attr({ "aria-expanded": "false", "aria-hidden": "true" });
            var i = t.dataSM("level");
            this.activatedItems.splice(i - 1, 1),
              this.visibleSubMenus.splice(
                $.inArray(t, this.visibleSubMenus),
                1
              ),
              this.$root.triggerHandler("hide.smapi", t[0]);
          }
        },
        menuHideAll: function () {
          this.showTimeout &&
            (clearTimeout(this.showTimeout), (this.showTimeout = 0));
          for (
            var t = this.opts.isPopup ? 1 : 0,
              e = this.visibleSubMenus.length - 1;
            t <= e;
            e--
          )
            this.menuHide(this.visibleSubMenus[e]);
          this.opts.isPopup &&
            (canAnimate && this.$root.stop(!0, !0),
            this.$root.is(":visible") &&
              (canAnimate && this.opts.hideFunction
                ? this.opts.hideFunction.call(this, this.$root)
                : this.$root.hide(this.opts.hideDuration))),
            (this.activatedItems = []),
            (this.visibleSubMenus = []),
            (this.clickActivated = !1),
            (this.focusActivated = !1),
            (this.zIndexInc = 0),
            this.$root.triggerHandler("hideAll.smapi");
        },
        menuHideSubMenus: function (t) {
          for (var e = this.activatedItems.length - 1; t <= e; e--) {
            var i = this.activatedItems[e].dataSM("sub");
            i && this.menuHide(i);
          }
        },
        menuInit: function (t) {
          if (!t.dataSM("in-mega")) {
            t.hasClass("mega-menu") && t.find("ul").dataSM("in-mega", !0);
            for (
              var e = 2, i = t[0];
              (i = i.parentNode.parentNode) != this.$root[0];

            )
              e++;
            var s = t.prevAll("a").eq(-1);
            s.length || (s = t.prevAll().find("a").eq(-1)),
              s.addClass("has-submenu").dataSM("sub", t),
              t
                .dataSM("parent-a", s)
                .dataSM("level", e)
                .parent()
                .dataSM("sub", t);
            var o = s.attr("id") || this.accessIdPrefix + ++this.idInc,
              a = t.attr("id") || this.accessIdPrefix + ++this.idInc;
            s.attr({
              id: o,
              "aria-haspopup": "true",
              "aria-controls": a,
              "aria-expanded": "false",
            }),
              t.attr({
                id: a,
                role: "group",
                "aria-hidden": "true",
                "aria-labelledby": o,
                "aria-expanded": "false",
              }),
              this.opts.subIndicators &&
                s[this.opts.subIndicatorsPos](this.$subArrow.clone());
          }
        },
        menuPosition: function (e) {
          var t,
            i,
            s = e.dataSM("parent-a"),
            o = s.closest("li"),
            a = o.parent(),
            n = e.dataSM("level"),
            r = this.getWidth(e),
            h = this.getHeight(e),
            u = s.offset(),
            l = u.left,
            c = u.top,
            d = this.getWidth(s),
            m = this.getHeight(s),
            p = $(window),
            f = p.scrollLeft(),
            v = p.scrollTop(),
            b = this.getViewportWidth(),
            S = this.getViewportHeight(),
            g =
              a.parent().is("[data-sm-horizontal-sub]") ||
              (2 == n && !a.hasClass("sm-vertical")),
            M =
              (this.opts.rightToLeftSubMenus && !o.is("[data-sm-reverse]")) ||
              (!this.opts.rightToLeftSubMenus && o.is("[data-sm-reverse]")),
            w =
              2 == n
                ? this.opts.mainMenuSubOffsetX
                : this.opts.subMenusSubOffsetX,
            T =
              2 == n
                ? this.opts.mainMenuSubOffsetY
                : this.opts.subMenusSubOffsetY;
          if (
            ((i = g
              ? ((t = M ? d - r - w : w),
                this.opts.bottomToTopSubMenus ? -h - T : m + T)
              : ((t = M ? w - r : d - w),
                this.opts.bottomToTopSubMenus ? m - T - h : T)),
            this.opts.keepInViewport)
          ) {
            var y = l + t,
              I = c + i;
            if (
              (M && y < f
                ? (t = g ? f - y + t : d - w)
                : !M && f + b < y + r && (t = g ? f + b - r - y + t : w - r),
              g ||
                (h < S && v + S < I + h
                  ? (i += v + S - h - I)
                  : (S <= h || I < v) && (i += v - I)),
              (g && (v + S + 0.49 < I + h || I < v)) || (!g && S + 0.49 < h))
            ) {
              var x = this;
              e.dataSM("scroll-arrows") ||
                e.dataSM(
                  "scroll-arrows",
                  $([
                    $(
                      '<span class="scroll-up"><span class="scroll-up-arrow"></span></span>'
                    )[0],
                    $(
                      '<span class="scroll-down"><span class="scroll-down-arrow"></span></span>'
                    )[0],
                  ])
                    .on({
                      mouseenter: function () {
                        (e.dataSM("scroll").up = $(this).hasClass("scroll-up")),
                          x.menuScroll(e);
                      },
                      mouseleave: function (t) {
                        x.menuScrollStop(e), x.menuScrollOut(e, t);
                      },
                      "mousewheel DOMMouseScroll": function (t) {
                        t.preventDefault();
                      },
                    })
                    .insertAfter(e)
                );
              var A = ".smartmenus_scroll";
              if (
                (e
                  .dataSM("scroll", {
                    y: this.cssTransforms3d ? 0 : i - m,
                    step: 1,
                    itemH: m,
                    subH: h,
                    arrowDownH: this.getHeight(e.dataSM("scroll-arrows").eq(1)),
                  })
                  .on(
                    getEventsNS(
                      {
                        mouseover: function (t) {
                          x.menuScrollOver(e, t);
                        },
                        mouseout: function (t) {
                          x.menuScrollOut(e, t);
                        },
                        "mousewheel DOMMouseScroll": function (t) {
                          x.menuScrollMousewheel(e, t);
                        },
                      },
                      A
                    )
                  )
                  .dataSM("scroll-arrows")
                  .css({
                    top: "auto",
                    left: "0",
                    marginLeft: t + (parseInt(e.css("border-left-width")) || 0),
                    width:
                      r -
                      (parseInt(e.css("border-left-width")) || 0) -
                      (parseInt(e.css("border-right-width")) || 0),
                    zIndex: e.css("z-index"),
                  })
                  .eq(g && this.opts.bottomToTopSubMenus ? 0 : 1)
                  .show(),
                this.isFixed())
              ) {
                var C = {};
                (C[
                  touchEvents
                    ? "touchstart touchmove touchend"
                    : "pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp"
                ] = function (t) {
                  x.menuScrollTouch(e, t);
                }),
                  e
                    .css({ "touch-action": "none", "-ms-touch-action": "none" })
                    .on(getEventsNS(C, A));
              }
            }
          }
          e.css({ top: "auto", left: "0", marginLeft: t, marginTop: i - m });
        },
        menuScroll: function (t, e, i) {
          var s,
            o = t.dataSM("scroll"),
            a = t.dataSM("scroll-arrows"),
            n = o.up ? o.upEnd : o.downEnd;
          if (!e && o.momentum) {
            if (((o.momentum *= 0.92), (s = o.momentum) < 0.5))
              return void this.menuScrollStop(t);
          } else
            s =
              i ||
              (e || !this.opts.scrollAccelerate
                ? this.opts.scrollStep
                : Math.floor(o.step));
          var r = t.dataSM("level");
          if (
            (this.activatedItems[r - 1] &&
              this.activatedItems[r - 1].dataSM("sub") &&
              this.activatedItems[r - 1].dataSM("sub").is(":visible") &&
              this.menuHideSubMenus(r - 1),
            (o.y =
              (o.up && n <= o.y) || (!o.up && n >= o.y)
                ? o.y
                : Math.abs(n - o.y) > s
                ? o.y + (o.up ? s : -s)
                : n),
            t.css(
              this.cssTransforms3d
                ? {
                    "-webkit-transform": "translate3d(0, " + o.y + "px, 0)",
                    transform: "translate3d(0, " + o.y + "px, 0)",
                  }
                : { marginTop: o.y }
            ),
            mouse &&
              ((o.up && o.y > o.downEnd) || (!o.up && o.y < o.upEnd)) &&
              a.eq(o.up ? 1 : 0).show(),
            o.y == n)
          )
            mouse && a.eq(o.up ? 0 : 1).hide(), this.menuScrollStop(t);
          else if (!e) {
            this.opts.scrollAccelerate &&
              o.step < this.opts.scrollStep &&
              (o.step += 0.2);
            var h = this;
            this.scrollTimeout = requestAnimationFrame(function () {
              h.menuScroll(t);
            });
          }
        },
        menuScrollMousewheel: function (t, e) {
          if (this.getClosestMenu(e.target) == t[0]) {
            var i = 0 < ((e = e.originalEvent).wheelDelta || -e.detail);
            t
              .dataSM("scroll-arrows")
              .eq(i ? 0 : 1)
              .is(":visible") &&
              ((t.dataSM("scroll").up = i), this.menuScroll(t, !0));
          }
          e.preventDefault();
        },
        menuScrollOut: function (t, e) {
          mouse &&
            (/^scroll-(up|down)/.test((e.relatedTarget || "").className) ||
              ((t[0] == e.relatedTarget || $.contains(t[0], e.relatedTarget)) &&
                this.getClosestMenu(e.relatedTarget) == t[0]) ||
              t.dataSM("scroll-arrows").css("visibility", "hidden"));
        },
        menuScrollOver: function (t, e) {
          if (
            mouse &&
            !/^scroll-(up|down)/.test(e.target.className) &&
            this.getClosestMenu(e.target) == t[0]
          ) {
            this.menuScrollRefreshData(t);
            var i = t.dataSM("scroll"),
              s =
                $(window).scrollTop() -
                t.dataSM("parent-a").offset().top -
                i.itemH;
            t.dataSM("scroll-arrows")
              .eq(0)
              .css("margin-top", s)
              .end()
              .eq(1)
              .css("margin-top", s + this.getViewportHeight() - i.arrowDownH)
              .end()
              .css("visibility", "visible");
          }
        },
        menuScrollRefreshData: function (t) {
          var e = t.dataSM("scroll"),
            i =
              $(window).scrollTop() -
              t.dataSM("parent-a").offset().top -
              e.itemH;
          this.cssTransforms3d && (i = -(parseFloat(t.css("margin-top")) - i)),
            $.extend(e, {
              upEnd: i,
              downEnd: i + this.getViewportHeight() - e.subH,
            });
        },
        menuScrollStop: function (t) {
          if (this.scrollTimeout)
            return (
              cancelAnimationFrame(this.scrollTimeout),
              (this.scrollTimeout = 0),
              (t.dataSM("scroll").step = 1),
              !0
            );
        },
        menuScrollTouch: function (t, e) {
          if (isTouchEvent((e = e.originalEvent))) {
            var i = this.getTouchPoint(e);
            if (this.getClosestMenu(i.target) == t[0]) {
              var s = t.dataSM("scroll");
              if (/(start|down)$/i.test(e.type))
                this.menuScrollStop(t)
                  ? (e.preventDefault(), (this.$touchScrollingSub = t))
                  : (this.$touchScrollingSub = null),
                  this.menuScrollRefreshData(t),
                  $.extend(s, {
                    touchStartY: i.pageY,
                    touchStartTime: e.timeStamp,
                  });
              else if (/move$/i.test(e.type)) {
                var o = void 0 !== s.touchY ? s.touchY : s.touchStartY;
                if (void 0 !== o && o != i.pageY) {
                  this.$touchScrollingSub = t;
                  var a = o < i.pageY;
                  void 0 !== s.up &&
                    s.up != a &&
                    $.extend(s, {
                      touchStartY: i.pageY,
                      touchStartTime: e.timeStamp,
                    }),
                    $.extend(s, { up: a, touchY: i.pageY }),
                    this.menuScroll(t, !0, Math.abs(i.pageY - o));
                }
                e.preventDefault();
              } else
                void 0 !== s.touchY &&
                  ((s.momentum =
                    15 *
                    Math.pow(
                      Math.abs(i.pageY - s.touchStartY) /
                        (e.timeStamp - s.touchStartTime),
                      2
                    )) &&
                    (this.menuScrollStop(t),
                    this.menuScroll(t),
                    e.preventDefault()),
                  delete s.touchY);
            }
          }
        },
        menuShow: function (t) {
          if (
            (t.dataSM("beforefirstshowfired") ||
              (t.dataSM("beforefirstshowfired", !0),
              !1 !==
                this.$root.triggerHandler("beforefirstshow.smapi", t[0]))) &&
            !1 !== this.$root.triggerHandler("beforeshow.smapi", t[0]) &&
            (t.dataSM("shown-before", !0),
            canAnimate && t.stop(!0, !0),
            !t.is(":visible"))
          ) {
            var e = t.dataSM("parent-a"),
              i = this.isCollapsible();
            if (
              ((this.opts.keepHighlighted || i) && e.addClass("highlighted"), i)
            )
              t.removeClass("sm-nowrap").css({
                zIndex: "",
                width: "auto",
                minWidth: "",
                maxWidth: "",
                top: "",
                left: "",
                marginLeft: "",
                marginTop: "",
              });
            else {
              if (
                (t.css(
                  "z-index",
                  (this.zIndexInc =
                    (this.zIndexInc || this.getStartZIndex()) + 1)
                ),
                (this.opts.subMenusMinWidth || this.opts.subMenusMaxWidth) &&
                  (t
                    .css({ width: "auto", minWidth: "", maxWidth: "" })
                    .addClass("sm-nowrap"),
                  this.opts.subMenusMinWidth &&
                    t.css("min-width", this.opts.subMenusMinWidth),
                  this.opts.subMenusMaxWidth))
              ) {
                var s = this.getWidth(t);
                t.css("max-width", this.opts.subMenusMaxWidth),
                  s > this.getWidth(t) &&
                    t
                      .removeClass("sm-nowrap")
                      .css("width", this.opts.subMenusMaxWidth);
              }
              this.menuPosition(t);
            }
            var o = function () {
              t.css("overflow", "");
            };
            i
              ? canAnimate && this.opts.collapsibleShowFunction
                ? this.opts.collapsibleShowFunction.call(this, t, o)
                : t.show(this.opts.collapsibleShowDuration, o)
              : canAnimate && this.opts.showFunction
              ? this.opts.showFunction.call(this, t, o)
              : t.show(this.opts.showDuration, o),
              e.attr("aria-expanded", "true"),
              t.attr({ "aria-expanded": "true", "aria-hidden": "false" }),
              this.visibleSubMenus.push(t),
              this.$root.triggerHandler("show.smapi", t[0]);
          }
        },
        popupHide: function (t) {
          this.hideTimeout &&
            (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
          var e = this;
          this.hideTimeout = setTimeout(
            function () {
              e.menuHideAll();
            },
            t ? 1 : this.opts.hideTimeout
          );
        },
        popupShow: function (t, e) {
          if (this.opts.isPopup) {
            if (
              (this.hideTimeout &&
                (clearTimeout(this.hideTimeout), (this.hideTimeout = 0)),
              this.$root.dataSM("shown-before", !0),
              canAnimate && this.$root.stop(!0, !0),
              !this.$root.is(":visible"))
            ) {
              this.$root.css({ left: t, top: e });
              var i = this,
                s = function () {
                  i.$root.css("overflow", "");
                };
              canAnimate && this.opts.showFunction
                ? this.opts.showFunction.call(this, this.$root, s)
                : this.$root.show(this.opts.showDuration, s),
                (this.visibleSubMenus[0] = this.$root);
            }
          } else
            alert(
              'SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.'
            );
        },
        refresh: function () {
          this.destroy(!0), this.init(!0);
        },
        rootKeyDown: function (t) {
          if (this.handleEvents())
            switch (t.keyCode) {
              case 27:
                var e = this.activatedItems[0];
                if (e)
                  this.menuHideAll(),
                    e[0].focus(),
                    (i = e.dataSM("sub")) && this.menuHide(i);
                break;
              case 32:
                var i,
                  s = $(t.target);
                if (s.is("a") && this.handleItemEvents(s))
                  (i = s.dataSM("sub")) &&
                    !i.is(":visible") &&
                    (this.itemClick({ currentTarget: t.target }),
                    t.preventDefault());
            }
        },
        rootOut: function (t) {
          if (
            this.handleEvents() &&
            !this.isTouchMode() &&
            t.target != this.$root[0] &&
            (this.hideTimeout &&
              (clearTimeout(this.hideTimeout), (this.hideTimeout = 0)),
            !this.opts.showOnClick || !this.opts.hideOnClick)
          ) {
            var e = this;
            this.hideTimeout = setTimeout(function () {
              e.menuHideAll();
            }, this.opts.hideTimeout);
          }
        },
        rootOver: function (t) {
          this.handleEvents() &&
            !this.isTouchMode() &&
            t.target != this.$root[0] &&
            this.hideTimeout &&
            (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
        },
        winResize: function (t) {
          if (this.handleEvents()) {
            if (
              !("onorientationchange" in window) ||
              "orientationchange" == t.type
            ) {
              var e = this.isCollapsible();
              (this.wasCollapsible && e) ||
                (this.activatedItems.length &&
                  this.activatedItems[this.activatedItems.length - 1][0].blur(),
                this.menuHideAll()),
                (this.wasCollapsible = e);
            }
          } else if (this.$disableOverlay) {
            var i = this.$root.offset();
            this.$disableOverlay.css({
              top: i.top,
              left: i.left,
              width: this.$root.outerWidth(),
              height: this.$root.outerHeight(),
            });
          }
        },
      },
    }),
    ($.fn.dataSM = function (t, e) {
      return e ? this.data(t + "_smartmenus", e) : this.data(t + "_smartmenus");
    }),
    ($.fn.removeDataSM = function (t) {
      return this.removeData(t + "_smartmenus");
    }),
    ($.fn.smartmenus = function (options) {
      if ("string" != typeof options)
        return this.each(function () {
          var dataOpts = $(this).data("sm-options") || null;
          if (dataOpts)
            try {
              dataOpts = eval("(" + dataOpts + ")");
            } catch (t) {
              (dataOpts = null),
                alert(
                  'ERROR\n\nSmartMenus jQuery init:\nInvalid "data-sm-options" attribute value syntax.'
                );
            }
          new $.SmartMenus(
            this,
            $.extend({}, $.fn.smartmenus.defaults, options, dataOpts)
          );
        });
      var args = arguments,
        method = options;
      return (
        Array.prototype.shift.call(args),
        this.each(function () {
          var t = $(this).data("smartmenus");
          t && t[method] && t[method].apply(t, args);
        })
      );
    }),
    ($.fn.smartmenus.defaults = {
      isPopup: !1,
      mainMenuSubOffsetX: 0,
      mainMenuSubOffsetY: 0,
      subMenusSubOffsetX: 0,
      subMenusSubOffsetY: 0,
      subMenusMinWidth: "10em",
      subMenusMaxWidth: "20em",
      subIndicators: !0,
      subIndicatorsPos: "prepend",
      subIndicatorsText: "",
      scrollStep: 30,
      scrollAccelerate: !0,
      showTimeout: 200,
      hideTimeout: 200,
      showDuration: 0,
      showFunction: null,
      hideDuration: 0,
      hideFunction: function (t, e) {
        t.fadeOut(200, e);
      },
      collapsibleShowDuration: 0,
      collapsibleShowFunction: function (t, e) {
        t.slideDown(200, e);
      },
      collapsibleHideDuration: 0,
      collapsibleHideFunction: function (t, e) {
        t.slideUp(200, e);
      },
      showOnClick: !1,
      hideOnClick: !0,
      noMouseOver: !1,
      keepInViewport: !0,
      keepHighlighted: !0,
      markCurrentItem: !1,
      markCurrentTree: !0,
      rightToLeftSubMenus: !1,
      bottomToTopSubMenus: !1,
      collapsibleBehavior: "link",
    }),
    $
  );
});
/*!
 * SmartMenus jQuery Plugin Bootstrap 4 Addon - v0.1.0 - September 17, 2017
 * http://www.smartmenus.org/
 *
 * Copyright Vasil Dinkov, Vadikom Web Ltd.
 * http://vadikom.com
 *
 * Licensed MIT
 */
!(function (o) {
  "function" == typeof define && define.amd
    ? define(["jquery", "smartmenus"], o)
    : "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = o(require("jquery")))
    : o(jQuery);
})(function (r) {
  return (
    r.extend((r.SmartMenus.Bootstrap = {}), {
      keydownFix: !1,
      init: function () {
        var o = r("ul.navbar-nav:not([data-sm-skip])");
        o.each(function () {
          var a = r(this),
            s = a.data("smartmenus");
          if (!s) {
            var e,
              t = a.is("[data-sm-skip-collapsible-behavior]");
            a.hasClass("ml-auto") || a.prevAll(".mr-auto").length;
            function o() {
              a.find("a.current").each(function () {
                var o = r(this);
                (o.hasClass("dropdown-item") ? o : o.parent()).addClass(
                  "active"
                );
              }),
                a.find("a.has-submenu").each(function () {
                  var o = r(this);
                  o.is('[data-toggle="dropdown"]') &&
                    o
                      .dataSM("bs-data-toggle-dropdown", !0)
                      .removeAttr("data-toggle"),
                    !t &&
                      o.hasClass("dropdown-toggle") &&
                      o
                        .dataSM("bs-dropdown-toggle", !0)
                        .removeClass("dropdown-toggle");
                });
            }
            function n(o) {
              var t = s.getViewportWidth();
              (t != e || o) &&
                (s.isCollapsible()
                  ? a.addClass("sm-collapsible")
                  : a.removeClass("sm-collapsible"),
                (e = t));
            }
            a
              .smartmenus({
                subMenusSubOffsetX: -2,
                subMenusSubOffsetY: 0,
                rightToLeftSubMenus: !1,
                bottomToTopSubMenus: 0 < a.closest(".fixed-bottom").length,
                hideOnClick: !0,
                collapsibleBehavior: "link",
              })
              .on({
                "show.smapi": function (o, t) {
                  var a = r(t),
                    e = a.dataSM("scroll-arrows");
                  e && e.css("background-color", a.css("background-color")),
                    a.parent().addClass("show"),
                    s.opts.keepHighlighted &&
                      2 < a.dataSM("level") &&
                      a.prevAll("a").addClass(s.opts.bootstrapHighlightClasses);
                },
                "hide.smapi": function (o, t) {
                  var a = r(t);
                  a.parent().removeClass("show"),
                    s.opts.keepHighlighted &&
                      2 < a.dataSM("level") &&
                      a
                        .prevAll("a")
                        .removeClass(s.opts.bootstrapHighlightClasses);
                },
              }),
              (s = a.data("smartmenus")),
              o(),
              (s.refresh = function () {
                r.SmartMenus.prototype.refresh.call(this), o(), n(!0);
              }),
              (s.destroy = function (o) {
                a.find("a.current").each(function () {
                  var o = r(this);
                  (o.hasClass("active") ? o : o.parent()).removeClass("active");
                }),
                  a.find("a.has-submenu").each(function () {
                    var o = r(this);
                    o.dataSM("bs-dropdown-toggle") &&
                      o
                        .addClass("dropdown-toggle")
                        .removeDataSM("bs-dropdown-toggle"),
                      o.dataSM("bs-data-toggle-dropdown") &&
                        o
                          .attr("data-toggle", "dropdown")
                          .removeDataSM("bs-data-toggle-dropdown");
                  }),
                  r.SmartMenus.prototype.destroy.call(this, o);
              }),
              t && (s.opts.collapsibleBehavior = "toggle"),
              n(),
              r(window).on("resize.smartmenus" + s.rootId, n);
          }
        }),
          o.length &&
            !r.SmartMenus.Bootstrap.keydownFix &&
            (r(document).off("keydown.bs.dropdown.data-api", ".dropdown-menu"),
            r.fn.dropdown &&
              r.fn.dropdown.Constructor &&
              r(document).on(
                "keydown.bs.dropdown.data-api",
                ".dropdown-menu.show",
                r.fn.dropdown.Constructor._dataApiKeydownHandler
              ),
            (r.SmartMenus.Bootstrap.keydownFix = !0));
      },
    }),
    r(r.SmartMenus.Bootstrap.init),
    r
  );
});
/*-----------------------------------------------------------------------------------*/
/*	02. STICKY HEADER
/*-----------------------------------------------------------------------------------*/
/*!
 * Headhesive.js v1.2.3 - An on-demand sticky header
 * Author: Copyright (c) Mark Goodyear <@markgdyr> <http://markgoodyear.com>
 * Url: http://markgoodyear.com/labs/headhesive
 * License: MIT
 */
!(function (t, e) {
  "function" == typeof define && define.amd
    ? define([], function () {
        return e();
      })
    : "object" == typeof exports
    ? (module.exports = e())
    : (t.Headhesive = e());
})(this, function () {
  "use strict";
  var t = function (e, s) {
      for (var o in s)
        s.hasOwnProperty(o) &&
          (e[o] = "object" == typeof s[o] ? t(e[o], s[o]) : s[o]);
      return e;
    },
    e = function (t, e) {
      var s,
        o,
        i,
        n =
          Date.now ||
          function () {
            return new Date().getTime();
          },
        l = null,
        c = 0,
        r = function () {
          (c = n()), (l = null), (i = t.apply(s, o)), (s = o = null);
        };
      return function () {
        var f = n(),
          h = e - (f - c);
        return (
          (s = this),
          (o = arguments),
          0 >= h
            ? (clearTimeout(l),
              (l = null),
              (c = f),
              (i = t.apply(s, o)),
              (s = o = null))
            : l || (l = setTimeout(r, h)),
          i
        );
      };
    },
    s = function () {
      return void 0 !== window.pageYOffset
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop;
    },
    o = function (t, e) {
      for (var s = 0, o = t.offsetHeight; t; )
        (s += t.offsetTop), (t = t.offsetParent);
      return "bottom" === e && (s += o), s;
    },
    i = function (e, s) {
      "querySelector" in document &&
        "addEventListener" in window &&
        ((this.visible = !1),
        (this.options = {
          offset: 300,
          offsetSide: "top",
          classes: {
            clone: "headhesive",
            stick: "headhesive--stick",
            unstick: "headhesive--unstick",
          },
          throttle: 250,
          onInit: function () {},
          onStick: function () {},
          onUnstick: function () {},
          onDestroy: function () {},
        }),
        (this.elem = "string" == typeof e ? document.querySelector(e) : e),
        (this.options = t(this.options, s)),
        this.init());
    };
  return (
    (i.prototype = {
      constructor: i,
      init: function () {
        if (
          ((this.clonedElem = this.elem.cloneNode(!0)),
          (this.clonedElem.className += " " + this.options.classes.clone),
          document.body.insertBefore(this.clonedElem, document.body.firstChild),
          "number" == typeof this.options.offset)
        )
          this.scrollOffset = this.options.offset;
        else {
          if ("string" != typeof this.options.offset)
            throw new Error("Invalid offset: " + this.options.offset);
          this._setScrollOffset();
        }
        (this._throttleUpdate = e(
          this.update.bind(this),
          this.options.throttle
        )),
          (this._throttleScrollOffset = e(
            this._setScrollOffset.bind(this),
            this.options.throttle
          )),
          window.addEventListener("scroll", this._throttleUpdate, !1),
          window.addEventListener("resize", this._throttleScrollOffset, !1),
          this.options.onInit.call(this);
      },
      _setScrollOffset: function () {
        "string" == typeof this.options.offset &&
          (this.scrollOffset = o(
            document.querySelector(this.options.offset),
            this.options.offsetSide
          ));
      },
      destroy: function () {
        document.body.removeChild(this.clonedElem),
          window.removeEventListener("scroll", this._throttleUpdate),
          window.removeEventListener("resize", this._throttleScrollOffset),
          this.options.onDestroy.call(this);
      },
      stick: function () {
        this.visible ||
          ((this.clonedElem.className = this.clonedElem.className.replace(
            new RegExp(
              "(^|\\s)*" + this.options.classes.unstick + "(\\s|$)*",
              "g"
            ),
            ""
          )),
          (this.clonedElem.className += " " + this.options.classes.stick),
          (this.visible = !0),
          this.options.onStick.call(this));
      },
      unstick: function () {
        this.visible &&
          ((this.clonedElem.className = this.clonedElem.className.replace(
            new RegExp(
              "(^|\\s)*" + this.options.classes.stick + "(\\s|$)*",
              "g"
            ),
            ""
          )),
          (this.clonedElem.className += " " + this.options.classes.unstick),
          (this.visible = !1),
          this.options.onUnstick.call(this));
      },
      update: function () {
        s() > this.scrollOffset ? this.stick() : this.unstick();
      },
    }),
    i
  );
});
/*-----------------------------------------------------------------------------------*/
/*	03. HAMBURGER MENU ICON
/*-----------------------------------------------------------------------------------*/
/*!
 * jquery-hmbrgr.js v0.0.2
 * https://github.com/MorenoDiDomenico/jquery-hmbrgr
 *
 * Copyright 2015, Moreno Di Domenico
 * Released under the MIT license
 * http://mdd.mit-license.org
 *
 */
!(function (a) {
  a.fn.hmbrgr = function (b) {
    function g(b) {
      a(b)
        .css({ width: c.width, height: c.height })
        .html("<span /><span /><span />")
        .find("span")
        .css({
          position: "absolute",
          width: "100%",
          height: c.barHeight,
          "border-radius": c.barRadius,
          "background-color": c.barColor,
          "transition-duration": c.speed + "ms",
        }),
        h(b),
        a.isFunction(c.onInit) && c.onInit.call(this);
    }
    function h(b) {
      a(b).data("clickable", !0).find("span").eq(0).css({ top: d }),
        a(b).find("span").eq(1).css({ top: e }),
        a(b).find("span").eq(2).css({ top: f });
    }
    function i(b) {
      a(b).on("click", function (c) {
        c.preventDefault(),
          a(this).data("clickable") &&
            (a(this).data("clickable", !1),
            a(b).toggleClass("cross"),
            a(b).hasClass("cross") ? j(b) : k(b));
      });
    }
    function j(b) {
      a(b).find("span").css({ top: e }),
        setTimeout(function () {
          a(b).addClass(c.animation).data("clickable", !0),
            a.isFunction(c.onOpen) && c.onOpen.call(this);
        }, c.speed);
    }
    function k(b) {
      a(b).removeClass(c.animation),
        setTimeout(function () {
          h(b), a.isFunction(c.onClose) && c.onClose.call(this);
        }, c.speed);
    }
    var c = a.extend(
        {
          width: 60,
          height: 50,
          speed: 200,
          barHeight: 8,
          barRadius: 0,
          barColor: "#ffffff",
          animation: "expand",
          onInit: null,
          onOpen: null,
          onClose: null,
        },
        b
      ),
      d = 0,
      e = c.height / 2 - c.barHeight / 2,
      f = c.height - c.barHeight;
    return this.each(function () {
      g(this), i(this);
    });
  };
})(jQuery);
/*-----------------------------------------------------------------------------------*/
/*	04. PICTUREFILL RETINA IMAGE
/*-----------------------------------------------------------------------------------*/
/*! picturefill - v3.0.2 - 2016-02-12
 * https://scottjehl.github.io/picturefill/
 * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
!(function (a) {
  var b = navigator.userAgent;
  a.HTMLPictureElement &&
    /ecko/.test(b) &&
    b.match(/rv\:(\d+)/) &&
    RegExp.$1 < 45 &&
    addEventListener(
      "resize",
      (function () {
        var b,
          c = document.createElement("source"),
          d = function (a) {
            var b,
              d,
              e = a.parentNode;
            "PICTURE" === e.nodeName.toUpperCase()
              ? ((b = c.cloneNode()),
                e.insertBefore(b, e.firstElementChild),
                setTimeout(function () {
                  e.removeChild(b);
                }))
              : (!a._pfLastSize || a.offsetWidth > a._pfLastSize) &&
                ((a._pfLastSize = a.offsetWidth),
                (d = a.sizes),
                (a.sizes += ",100vw"),
                setTimeout(function () {
                  a.sizes = d;
                }));
          },
          e = function () {
            var a,
              b = document.querySelectorAll(
                "picture > img, img[srcset][sizes]"
              );
            for (a = 0; a < b.length; a++) d(b[a]);
          },
          f = function () {
            clearTimeout(b), (b = setTimeout(e, 99));
          },
          g = a.matchMedia && matchMedia("(orientation: landscape)"),
          h = function () {
            f(), g && g.addListener && g.addListener(f);
          };
        return (
          (c.srcset =
            "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),
          /^[c|i]|d$/.test(document.readyState || "")
            ? h()
            : document.addEventListener("DOMContentLoaded", h),
          f
        );
      })()
    );
})(window),
  (function (a, b, c) {
    "use strict";
    function d(a) {
      return " " === a || "	" === a || "\n" === a || "\f" === a || "\r" === a;
    }
    function e(b, c) {
      var d = new a.Image();
      return (
        (d.onerror = function () {
          (A[b] = !1), ba();
        }),
        (d.onload = function () {
          (A[b] = 1 === d.width), ba();
        }),
        (d.src = c),
        "pending"
      );
    }
    function f() {
      (M = !1),
        (P = a.devicePixelRatio),
        (N = {}),
        (O = {}),
        (s.DPR = P || 1),
        (Q.width = Math.max(a.innerWidth || 0, z.clientWidth)),
        (Q.height = Math.max(a.innerHeight || 0, z.clientHeight)),
        (Q.vw = Q.width / 100),
        (Q.vh = Q.height / 100),
        (r = [Q.height, Q.width, P].join("-")),
        (Q.em = s.getEmValue()),
        (Q.rem = Q.em);
    }
    function g(a, b, c, d) {
      var e, f, g, h;
      return (
        "saveData" === B.algorithm
          ? a > 2.7
            ? (h = c + 1)
            : ((f = b - c),
              (e = Math.pow(a - 0.6, 1.5)),
              (g = f * e),
              d && (g += 0.1 * e),
              (h = a + g))
          : (h = c > 1 ? Math.sqrt(a * b) : a),
        h > c
      );
    }
    function h(a) {
      var b,
        c = s.getSet(a),
        d = !1;
      "pending" !== c &&
        ((d = r), c && ((b = s.setRes(c)), s.applySetCandidate(b, a))),
        (a[s.ns].evaled = d);
    }
    function i(a, b) {
      return a.res - b.res;
    }
    function j(a, b, c) {
      var d;
      return (
        !c && b && ((c = a[s.ns].sets), (c = c && c[c.length - 1])),
        (d = k(b, c)),
        d &&
          ((b = s.makeUrl(b)),
          (a[s.ns].curSrc = b),
          (a[s.ns].curCan = d),
          d.res || aa(d, d.set.sizes)),
        d
      );
    }
    function k(a, b) {
      var c, d, e;
      if (a && b)
        for (e = s.parseSet(b), a = s.makeUrl(a), c = 0; c < e.length; c++)
          if (a === s.makeUrl(e[c].url)) {
            d = e[c];
            break;
          }
      return d;
    }
    function l(a, b) {
      var c,
        d,
        e,
        f,
        g = a.getElementsByTagName("source");
      for (c = 0, d = g.length; d > c; c++)
        (e = g[c]),
          (e[s.ns] = !0),
          (f = e.getAttribute("srcset")),
          f &&
            b.push({
              srcset: f,
              media: e.getAttribute("media"),
              type: e.getAttribute("type"),
              sizes: e.getAttribute("sizes"),
            });
    }
    function m(a, b) {
      function c(b) {
        var c,
          d = b.exec(a.substring(m));
        return d ? ((c = d[0]), (m += c.length), c) : void 0;
      }
      function e() {
        var a,
          c,
          d,
          e,
          f,
          i,
          j,
          k,
          l,
          m = !1,
          o = {};
        for (e = 0; e < h.length; e++)
          (f = h[e]),
            (i = f[f.length - 1]),
            (j = f.substring(0, f.length - 1)),
            (k = parseInt(j, 10)),
            (l = parseFloat(j)),
            X.test(j) && "w" === i
              ? ((a || c) && (m = !0), 0 === k ? (m = !0) : (a = k))
              : Y.test(j) && "x" === i
              ? ((a || c || d) && (m = !0), 0 > l ? (m = !0) : (c = l))
              : X.test(j) && "h" === i
              ? ((d || c) && (m = !0), 0 === k ? (m = !0) : (d = k))
              : (m = !0);
        m ||
          ((o.url = g),
          a && (o.w = a),
          c && (o.d = c),
          d && (o.h = d),
          d || c || a || (o.d = 1),
          1 === o.d && (b.has1x = !0),
          (o.set = b),
          n.push(o));
      }
      function f() {
        for (c(T), i = "", j = "in descriptor"; ; ) {
          if (((k = a.charAt(m)), "in descriptor" === j))
            if (d(k)) i && (h.push(i), (i = ""), (j = "after descriptor"));
            else {
              if ("," === k) return (m += 1), i && h.push(i), void e();
              if ("(" === k) (i += k), (j = "in parens");
              else {
                if ("" === k) return i && h.push(i), void e();
                i += k;
              }
            }
          else if ("in parens" === j)
            if (")" === k) (i += k), (j = "in descriptor");
            else {
              if ("" === k) return h.push(i), void e();
              i += k;
            }
          else if ("after descriptor" === j)
            if (d(k));
            else {
              if ("" === k) return void e();
              (j = "in descriptor"), (m -= 1);
            }
          m += 1;
        }
      }
      for (var g, h, i, j, k, l = a.length, m = 0, n = []; ; ) {
        if ((c(U), m >= l)) return n;
        (g = c(V)),
          (h = []),
          "," === g.slice(-1) ? ((g = g.replace(W, "")), e()) : f();
      }
    }
    function n(a) {
      function b(a) {
        function b() {
          f && (g.push(f), (f = ""));
        }
        function c() {
          g[0] && (h.push(g), (g = []));
        }
        for (var e, f = "", g = [], h = [], i = 0, j = 0, k = !1; ; ) {
          if (((e = a.charAt(j)), "" === e)) return b(), c(), h;
          if (k) {
            if ("*" === e && "/" === a[j + 1]) {
              (k = !1), (j += 2), b();
              continue;
            }
            j += 1;
          } else {
            if (d(e)) {
              if ((a.charAt(j - 1) && d(a.charAt(j - 1))) || !f) {
                j += 1;
                continue;
              }
              if (0 === i) {
                b(), (j += 1);
                continue;
              }
              e = " ";
            } else if ("(" === e) i += 1;
            else if (")" === e) i -= 1;
            else {
              if ("," === e) {
                b(), c(), (j += 1);
                continue;
              }
              if ("/" === e && "*" === a.charAt(j + 1)) {
                (k = !0), (j += 2);
                continue;
              }
            }
            (f += e), (j += 1);
          }
        }
      }
      function c(a) {
        return k.test(a) && parseFloat(a) >= 0
          ? !0
          : l.test(a)
          ? !0
          : "0" === a || "-0" === a || "+0" === a
          ? !0
          : !1;
      }
      var e,
        f,
        g,
        h,
        i,
        j,
        k =
          /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,
        l = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;
      for (f = b(a), g = f.length, e = 0; g > e; e++)
        if (((h = f[e]), (i = h[h.length - 1]), c(i))) {
          if (((j = i), h.pop(), 0 === h.length)) return j;
          if (((h = h.join(" ")), s.matchesMedia(h))) return j;
        }
      return "100vw";
    }
    b.createElement("picture");
    var o,
      p,
      q,
      r,
      s = {},
      t = !1,
      u = function () {},
      v = b.createElement("img"),
      w = v.getAttribute,
      x = v.setAttribute,
      y = v.removeAttribute,
      z = b.documentElement,
      A = {},
      B = { algorithm: "" },
      C = "data-pfsrc",
      D = C + "set",
      E = navigator.userAgent,
      F =
        /rident/.test(E) ||
        (/ecko/.test(E) && E.match(/rv\:(\d+)/) && RegExp.$1 > 35),
      G = "currentSrc",
      H = /\s+\+?\d+(e\d+)?w/,
      I = /(\([^)]+\))?\s*(.+)/,
      J = a.picturefillCFG,
      K =
        "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",
      L = "font-size:100%!important;",
      M = !0,
      N = {},
      O = {},
      P = a.devicePixelRatio,
      Q = { px: 1, in: 96 },
      R = b.createElement("a"),
      S = !1,
      T = /^[ \t\n\r\u000c]+/,
      U = /^[, \t\n\r\u000c]+/,
      V = /^[^ \t\n\r\u000c]+/,
      W = /[,]+$/,
      X = /^\d+$/,
      Y = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,
      Z = function (a, b, c, d) {
        a.addEventListener
          ? a.addEventListener(b, c, d || !1)
          : a.attachEvent && a.attachEvent("on" + b, c);
      },
      $ = function (a) {
        var b = {};
        return function (c) {
          return c in b || (b[c] = a(c)), b[c];
        };
      },
      _ = (function () {
        var a = /^([\d\.]+)(em|vw|px)$/,
          b = function () {
            for (var a = arguments, b = 0, c = a[0]; ++b in a; )
              c = c.replace(a[b], a[++b]);
            return c;
          },
          c = $(function (a) {
            return (
              "return " +
              b(
                (a || "").toLowerCase(),
                /\band\b/g,
                "&&",
                /,/g,
                "||",
                /min-([a-z-\s]+):/g,
                "e.$1>=",
                /max-([a-z-\s]+):/g,
                "e.$1<=",
                /calc([^)]+)/g,
                "($1)",
                /(\d+[\.]*[\d]*)([a-z]+)/g,
                "($1 * e.$2)",
                /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,
                ""
              ) +
              ";"
            );
          });
        return function (b, d) {
          var e;
          if (!(b in N))
            if (((N[b] = !1), d && (e = b.match(a)))) N[b] = e[1] * Q[e[2]];
            else
              try {
                N[b] = new Function("e", c(b))(Q);
              } catch (f) {}
          return N[b];
        };
      })(),
      aa = function (a, b) {
        return (
          a.w
            ? ((a.cWidth = s.calcListLength(b || "100vw")),
              (a.res = a.w / a.cWidth))
            : (a.res = a.d),
          a
        );
      },
      ba = function (a) {
        if (t) {
          var c,
            d,
            e,
            f = a || {};
          if (
            (f.elements &&
              1 === f.elements.nodeType &&
              ("IMG" === f.elements.nodeName.toUpperCase()
                ? (f.elements = [f.elements])
                : ((f.context = f.elements), (f.elements = null))),
            (c =
              f.elements ||
              s.qsa(
                f.context || b,
                f.reevaluate || f.reselect ? s.sel : s.selShort
              )),
            (e = c.length))
          ) {
            for (s.setupRun(f), S = !0, d = 0; e > d; d++) s.fillImg(c[d], f);
            s.teardownRun(f);
          }
        }
      };
    (o =
      a.console && console.warn
        ? function (a) {
            console.warn(a);
          }
        : u),
      G in v || (G = "src"),
      (A["image/jpeg"] = !0),
      (A["image/gif"] = !0),
      (A["image/png"] = !0),
      (A["image/svg+xml"] = b.implementation.hasFeature(
        "http://www.w3.org/TR/SVG11/feature#Image",
        "1.1"
      )),
      (s.ns = ("pf" + new Date().getTime()).substr(0, 9)),
      (s.supSrcset = "srcset" in v),
      (s.supSizes = "sizes" in v),
      (s.supPicture = !!a.HTMLPictureElement),
      s.supSrcset &&
        s.supPicture &&
        !s.supSizes &&
        !(function (a) {
          (v.srcset = "data:,a"),
            (a.src = "data:,a"),
            (s.supSrcset = v.complete === a.complete),
            (s.supPicture = s.supSrcset && s.supPicture);
        })(b.createElement("img")),
      s.supSrcset && !s.supSizes
        ? !(function () {
            var a =
                "data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==",
              c =
                "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
              d = b.createElement("img"),
              e = function () {
                var a = d.width;
                2 === a && (s.supSizes = !0),
                  (q = s.supSrcset && !s.supSizes),
                  (t = !0),
                  setTimeout(ba);
              };
            (d.onload = e),
              (d.onerror = e),
              d.setAttribute("sizes", "9px"),
              (d.srcset = c + " 1w," + a + " 9w"),
              (d.src = c);
          })()
        : (t = !0),
      (s.selShort = "picture>img,img[srcset]"),
      (s.sel = s.selShort),
      (s.cfg = B),
      (s.DPR = P || 1),
      (s.u = Q),
      (s.types = A),
      (s.setSize = u),
      (s.makeUrl = $(function (a) {
        return (R.href = a), R.href;
      })),
      (s.qsa = function (a, b) {
        return "querySelector" in a ? a.querySelectorAll(b) : [];
      }),
      (s.matchesMedia = function () {
        return (
          a.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches
            ? (s.matchesMedia = function (a) {
                return !a || matchMedia(a).matches;
              })
            : (s.matchesMedia = s.mMQ),
          s.matchesMedia.apply(this, arguments)
        );
      }),
      (s.mMQ = function (a) {
        return a ? _(a) : !0;
      }),
      (s.calcLength = function (a) {
        var b = _(a, !0) || !1;
        return 0 > b && (b = !1), b;
      }),
      (s.supportsType = function (a) {
        return a ? A[a] : !0;
      }),
      (s.parseSize = $(function (a) {
        var b = (a || "").match(I);
        return { media: b && b[1], length: b && b[2] };
      })),
      (s.parseSet = function (a) {
        return a.cands || (a.cands = m(a.srcset, a)), a.cands;
      }),
      (s.getEmValue = function () {
        var a;
        if (!p && (a = b.body)) {
          var c = b.createElement("div"),
            d = z.style.cssText,
            e = a.style.cssText;
          (c.style.cssText = K),
            (z.style.cssText = L),
            (a.style.cssText = L),
            a.appendChild(c),
            (p = c.offsetWidth),
            a.removeChild(c),
            (p = parseFloat(p, 10)),
            (z.style.cssText = d),
            (a.style.cssText = e);
        }
        return p || 16;
      }),
      (s.calcListLength = function (a) {
        if (!(a in O) || B.uT) {
          var b = s.calcLength(n(a));
          O[a] = b ? b : Q.width;
        }
        return O[a];
      }),
      (s.setRes = function (a) {
        var b;
        if (a) {
          b = s.parseSet(a);
          for (var c = 0, d = b.length; d > c; c++) aa(b[c], a.sizes);
        }
        return b;
      }),
      (s.setRes.res = aa),
      (s.applySetCandidate = function (a, b) {
        if (a.length) {
          var c,
            d,
            e,
            f,
            h,
            k,
            l,
            m,
            n,
            o = b[s.ns],
            p = s.DPR;
          if (
            ((k = o.curSrc || b[G]),
            (l = o.curCan || j(b, k, a[0].set)),
            l &&
              l.set === a[0].set &&
              ((n = F && !b.complete && l.res - 0.1 > p),
              n || ((l.cached = !0), l.res >= p && (h = l))),
            !h)
          )
            for (a.sort(i), f = a.length, h = a[f - 1], d = 0; f > d; d++)
              if (((c = a[d]), c.res >= p)) {
                (e = d - 1),
                  (h =
                    a[e] &&
                    (n || k !== s.makeUrl(c.url)) &&
                    g(a[e].res, c.res, p, a[e].cached)
                      ? a[e]
                      : c);
                break;
              }
          h &&
            ((m = s.makeUrl(h.url)),
            (o.curSrc = m),
            (o.curCan = h),
            m !== k && s.setSrc(b, h),
            s.setSize(b));
        }
      }),
      (s.setSrc = function (a, b) {
        var c;
        (a.src = b.url),
          "image/svg+xml" === b.set.type &&
            ((c = a.style.width),
            (a.style.width = a.offsetWidth + 1 + "px"),
            a.offsetWidth + 1 && (a.style.width = c));
      }),
      (s.getSet = function (a) {
        var b,
          c,
          d,
          e = !1,
          f = a[s.ns].sets;
        for (b = 0; b < f.length && !e; b++)
          if (
            ((c = f[b]),
            c.srcset && s.matchesMedia(c.media) && (d = s.supportsType(c.type)))
          ) {
            "pending" === d && (c = d), (e = c);
            break;
          }
        return e;
      }),
      (s.parseSets = function (a, b, d) {
        var e,
          f,
          g,
          h,
          i = b && "PICTURE" === b.nodeName.toUpperCase(),
          j = a[s.ns];
        (j.src === c || d.src) &&
          ((j.src = w.call(a, "src")),
          j.src ? x.call(a, C, j.src) : y.call(a, C)),
          (j.srcset === c || d.srcset || !s.supSrcset || a.srcset) &&
            ((e = w.call(a, "srcset")), (j.srcset = e), (h = !0)),
          (j.sets = []),
          i && ((j.pic = !0), l(b, j.sets)),
          j.srcset
            ? ((f = { srcset: j.srcset, sizes: w.call(a, "sizes") }),
              j.sets.push(f),
              (g = (q || j.src) && H.test(j.srcset || "")),
              g ||
                !j.src ||
                k(j.src, f) ||
                f.has1x ||
                ((f.srcset += ", " + j.src),
                f.cands.push({ url: j.src, d: 1, set: f })))
            : j.src && j.sets.push({ srcset: j.src, sizes: null }),
          (j.curCan = null),
          (j.curSrc = c),
          (j.supported = !(i || (f && !s.supSrcset) || (g && !s.supSizes))),
          h &&
            s.supSrcset &&
            !j.supported &&
            (e ? (x.call(a, D, e), (a.srcset = "")) : y.call(a, D)),
          j.supported &&
            !j.srcset &&
            ((!j.src && a.src) || a.src !== s.makeUrl(j.src)) &&
            (null === j.src ? a.removeAttribute("src") : (a.src = j.src)),
          (j.parsed = !0);
      }),
      (s.fillImg = function (a, b) {
        var c,
          d = b.reselect || b.reevaluate;
        a[s.ns] || (a[s.ns] = {}),
          (c = a[s.ns]),
          (d || c.evaled !== r) &&
            ((!c.parsed || b.reevaluate) && s.parseSets(a, a.parentNode, b),
            c.supported ? (c.evaled = r) : h(a));
      }),
      (s.setupRun = function () {
        (!S || M || P !== a.devicePixelRatio) && f();
      }),
      s.supPicture
        ? ((ba = u), (s.fillImg = u))
        : !(function () {
            var c,
              d = a.attachEvent ? /d$|^c/ : /d$|^c|^i/,
              e = function () {
                var a = b.readyState || "";
                (f = setTimeout(e, "loading" === a ? 200 : 999)),
                  b.body &&
                    (s.fillImgs(), (c = c || d.test(a)), c && clearTimeout(f));
              },
              f = setTimeout(e, b.body ? 9 : 99),
              g = function (a, b) {
                var c,
                  d,
                  e = function () {
                    var f = new Date() - d;
                    b > f ? (c = setTimeout(e, b - f)) : ((c = null), a());
                  };
                return function () {
                  (d = new Date()), c || (c = setTimeout(e, b));
                };
              },
              h = z.clientHeight,
              i = function () {
                (M =
                  Math.max(a.innerWidth || 0, z.clientWidth) !== Q.width ||
                  z.clientHeight !== h),
                  (h = z.clientHeight),
                  M && s.fillImgs();
              };
            Z(a, "resize", g(i, 99)), Z(b, "readystatechange", e);
          })(),
      (s.picturefill = ba),
      (s.fillImgs = ba),
      (s.teardownRun = u),
      (ba._ = s),
      (a.picturefillCFG = {
        pf: s,
        push: function (a) {
          var b = a.shift();
          "function" == typeof s[b]
            ? s[b].apply(s, a)
            : ((B[b] = a[0]), S && s.fillImgs({ reselect: !0 }));
        },
      });
    for (; J && J.length; ) a.picturefillCFG.push(J.shift());
    (a.picturefill = ba),
      "object" == typeof module && "object" == typeof module.exports
        ? (module.exports = ba)
        : "function" == typeof define &&
          define.amd &&
          define("picturefill", function () {
            return ba;
          }),
      s.supPicture ||
        (A["image/webp"] = e(
          "image/webp",
          "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="
        ));
  })(window, document);
/*-----------------------------------------------------------------------------------*/
/*	05. ISOTOPE
/*-----------------------------------------------------------------------------------*/
/*!
 * Isotope PACKAGED v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

!(function (t, e) {
  "function" == typeof define && define.amd
    ? define("jquery-bridget/jquery-bridget", ["jquery"], function (i) {
        return e(t, i);
      })
    : "object" == typeof module && module.exports
    ? (module.exports = e(t, require("jquery")))
    : (t.jQueryBridget = e(t, t.jQuery));
})(window, function (t, e) {
  "use strict";
  function i(i, s, a) {
    function u(t, e, o) {
      var n,
        s = "$()." + i + '("' + e + '")';
      return (
        t.each(function (t, u) {
          var h = a.data(u, i);
          if (!h)
            return void r(
              i + " not initialized. Cannot call methods, i.e. " + s
            );
          var d = h[e];
          if (!d || "_" == e.charAt(0))
            return void r(s + " is not a valid method");
          var l = d.apply(h, o);
          n = void 0 === n ? l : n;
        }),
        void 0 !== n ? n : t
      );
    }
    function h(t, e) {
      t.each(function (t, o) {
        var n = a.data(o, i);
        n ? (n.option(e), n._init()) : ((n = new s(o, e)), a.data(o, i, n));
      });
    }
    (a = a || e || t.jQuery),
      a &&
        (s.prototype.option ||
          (s.prototype.option = function (t) {
            a.isPlainObject(t) &&
              (this.options = a.extend(!0, this.options, t));
          }),
        (a.fn[i] = function (t) {
          if ("string" == typeof t) {
            var e = n.call(arguments, 1);
            return u(this, t, e);
          }
          return h(this, t), this;
        }),
        o(a));
  }
  function o(t) {
    !t || (t && t.bridget) || (t.bridget = i);
  }
  var n = Array.prototype.slice,
    s = t.console,
    r =
      "undefined" == typeof s
        ? function () {}
        : function (t) {
            s.error(t);
          };
  return o(e || t.jQuery), i;
}),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("ev-emitter/ev-emitter", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.EvEmitter = e());
  })("undefined" != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return (
      (e.on = function (t, e) {
        if (t && e) {
          var i = (this._events = this._events || {}),
            o = (i[t] = i[t] || []);
          return o.indexOf(e) == -1 && o.push(e), this;
        }
      }),
      (e.once = function (t, e) {
        if (t && e) {
          this.on(t, e);
          var i = (this._onceEvents = this._onceEvents || {}),
            o = (i[t] = i[t] || {});
          return (o[e] = !0), this;
        }
      }),
      (e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          var o = i.indexOf(e);
          return o != -1 && i.splice(o, 1), this;
        }
      }),
      (e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          (i = i.slice(0)), (e = e || []);
          for (
            var o = this._onceEvents && this._onceEvents[t], n = 0;
            n < i.length;
            n++
          ) {
            var s = i[n],
              r = o && o[s];
            r && (this.off(t, s), delete o[s]), s.apply(this, e);
          }
          return this;
        }
      }),
      (e.allOff = function () {
        delete this._events, delete this._onceEvents;
      }),
      t
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("get-size/get-size", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.getSize = e());
  })(window, function () {
    "use strict";
    function t(t) {
      var e = parseFloat(t),
        i = t.indexOf("%") == -1 && !isNaN(e);
      return i && e;
    }
    function e() {}
    function i() {
      for (
        var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0,
          },
          e = 0;
        e < h;
        e++
      ) {
        var i = u[e];
        t[i] = 0;
      }
      return t;
    }
    function o(t) {
      var e = getComputedStyle(t);
      return (
        e ||
          a(
            "Style returned " +
              e +
              ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"
          ),
        e
      );
    }
    function n() {
      if (!d) {
        d = !0;
        var e = document.createElement("div");
        (e.style.width = "200px"),
          (e.style.padding = "1px 2px 3px 4px"),
          (e.style.borderStyle = "solid"),
          (e.style.borderWidth = "1px 2px 3px 4px"),
          (e.style.boxSizing = "border-box");
        var i = document.body || document.documentElement;
        i.appendChild(e);
        var n = o(e);
        (r = 200 == Math.round(t(n.width))),
          (s.isBoxSizeOuter = r),
          i.removeChild(e);
      }
    }
    function s(e) {
      if (
        (n(),
        "string" == typeof e && (e = document.querySelector(e)),
        e && "object" == typeof e && e.nodeType)
      ) {
        var s = o(e);
        if ("none" == s.display) return i();
        var a = {};
        (a.width = e.offsetWidth), (a.height = e.offsetHeight);
        for (
          var d = (a.isBorderBox = "border-box" == s.boxSizing), l = 0;
          l < h;
          l++
        ) {
          var f = u[l],
            c = s[f],
            m = parseFloat(c);
          a[f] = isNaN(m) ? 0 : m;
        }
        var p = a.paddingLeft + a.paddingRight,
          y = a.paddingTop + a.paddingBottom,
          g = a.marginLeft + a.marginRight,
          v = a.marginTop + a.marginBottom,
          _ = a.borderLeftWidth + a.borderRightWidth,
          z = a.borderTopWidth + a.borderBottomWidth,
          I = d && r,
          x = t(s.width);
        x !== !1 && (a.width = x + (I ? 0 : p + _));
        var S = t(s.height);
        return (
          S !== !1 && (a.height = S + (I ? 0 : y + z)),
          (a.innerWidth = a.width - (p + _)),
          (a.innerHeight = a.height - (y + z)),
          (a.outerWidth = a.width + g),
          (a.outerHeight = a.height + v),
          a
        );
      }
    }
    var r,
      a =
        "undefined" == typeof console
          ? e
          : function (t) {
              console.error(t);
            },
      u = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginBottom",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "borderBottomWidth",
      ],
      h = u.length,
      d = !1;
    return s;
  }),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define("desandro-matches-selector/matches-selector", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.matchesSelector = e());
  })(window, function () {
    "use strict";
    var t = (function () {
      var t = window.Element.prototype;
      if (t.matches) return "matches";
      if (t.matchesSelector) return "matchesSelector";
      for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
        var o = e[i],
          n = o + "MatchesSelector";
        if (t[n]) return n;
      }
    })();
    return function (e, i) {
      return e[t](i);
    };
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "fizzy-ui-utils/utils",
          ["desandro-matches-selector/matches-selector"],
          function (i) {
            return e(t, i);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(t, require("desandro-matches-selector")))
      : (t.fizzyUIUtils = e(t, t.matchesSelector));
  })(window, function (t, e) {
    var i = {};
    (i.extend = function (t, e) {
      for (var i in e) t[i] = e[i];
      return t;
    }),
      (i.modulo = function (t, e) {
        return ((t % e) + e) % e;
      });
    var o = Array.prototype.slice;
    (i.makeArray = function (t) {
      if (Array.isArray(t)) return t;
      if (null === t || void 0 === t) return [];
      var e = "object" == typeof t && "number" == typeof t.length;
      return e ? o.call(t) : [t];
    }),
      (i.removeFrom = function (t, e) {
        var i = t.indexOf(e);
        i != -1 && t.splice(i, 1);
      }),
      (i.getParent = function (t, i) {
        for (; t.parentNode && t != document.body; )
          if (((t = t.parentNode), e(t, i))) return t;
      }),
      (i.getQueryElement = function (t) {
        return "string" == typeof t ? document.querySelector(t) : t;
      }),
      (i.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (i.filterFindElements = function (t, o) {
        t = i.makeArray(t);
        var n = [];
        return (
          t.forEach(function (t) {
            if (t instanceof HTMLElement) {
              if (!o) return void n.push(t);
              e(t, o) && n.push(t);
              for (var i = t.querySelectorAll(o), s = 0; s < i.length; s++)
                n.push(i[s]);
            }
          }),
          n
        );
      }),
      (i.debounceMethod = function (t, e, i) {
        i = i || 100;
        var o = t.prototype[e],
          n = e + "Timeout";
        t.prototype[e] = function () {
          var t = this[n];
          clearTimeout(t);
          var e = arguments,
            s = this;
          this[n] = setTimeout(function () {
            o.apply(s, e), delete s[n];
          }, i);
        };
      }),
      (i.docReady = function (t) {
        var e = document.readyState;
        "complete" == e || "interactive" == e
          ? setTimeout(t)
          : document.addEventListener("DOMContentLoaded", t);
      }),
      (i.toDashed = function (t) {
        return t
          .replace(/(.)([A-Z])/g, function (t, e, i) {
            return e + "-" + i;
          })
          .toLowerCase();
      });
    var n = t.console;
    return (
      (i.htmlInit = function (e, o) {
        i.docReady(function () {
          var s = i.toDashed(o),
            r = "data-" + s,
            a = document.querySelectorAll("[" + r + "]"),
            u = document.querySelectorAll(".js-" + s),
            h = i.makeArray(a).concat(i.makeArray(u)),
            d = r + "-options",
            l = t.jQuery;
          h.forEach(function (t) {
            var i,
              s = t.getAttribute(r) || t.getAttribute(d);
            try {
              i = s && JSON.parse(s);
            } catch (a) {
              return void (
                n &&
                n.error("Error parsing " + r + " on " + t.className + ": " + a)
              );
            }
            var u = new e(t, i);
            l && l.data(t, o, u);
          });
        });
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "outlayer/item",
          ["ev-emitter/ev-emitter", "get-size/get-size"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("ev-emitter"), require("get-size")))
      : ((t.Outlayer = {}), (t.Outlayer.Item = e(t.EvEmitter, t.getSize)));
  })(window, function (t, e) {
    "use strict";
    function i(t) {
      for (var e in t) return !1;
      return (e = null), !0;
    }
    function o(t, e) {
      t &&
        ((this.element = t),
        (this.layout = e),
        (this.position = { x: 0, y: 0 }),
        this._create());
    }
    function n(t) {
      return t.replace(/([A-Z])/g, function (t) {
        return "-" + t.toLowerCase();
      });
    }
    var s = document.documentElement.style,
      r = "string" == typeof s.transition ? "transition" : "WebkitTransition",
      a = "string" == typeof s.transform ? "transform" : "WebkitTransform",
      u = {
        WebkitTransition: "webkitTransitionEnd",
        transition: "transitionend",
      }[r],
      h = {
        transform: a,
        transition: r,
        transitionDuration: r + "Duration",
        transitionProperty: r + "Property",
        transitionDelay: r + "Delay",
      },
      d = (o.prototype = Object.create(t.prototype));
    (d.constructor = o),
      (d._create = function () {
        (this._transn = { ingProperties: {}, clean: {}, onEnd: {} }),
          this.css({ position: "absolute" });
      }),
      (d.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (d.getSize = function () {
        this.size = e(this.element);
      }),
      (d.css = function (t) {
        var e = this.element.style;
        for (var i in t) {
          var o = h[i] || i;
          e[o] = t[i];
        }
      }),
      (d.getPosition = function () {
        var t = getComputedStyle(this.element),
          e = this.layout._getOption("originLeft"),
          i = this.layout._getOption("originTop"),
          o = t[e ? "left" : "right"],
          n = t[i ? "top" : "bottom"],
          s = parseFloat(o),
          r = parseFloat(n),
          a = this.layout.size;
        o.indexOf("%") != -1 && (s = (s / 100) * a.width),
          n.indexOf("%") != -1 && (r = (r / 100) * a.height),
          (s = isNaN(s) ? 0 : s),
          (r = isNaN(r) ? 0 : r),
          (s -= e ? a.paddingLeft : a.paddingRight),
          (r -= i ? a.paddingTop : a.paddingBottom),
          (this.position.x = s),
          (this.position.y = r);
      }),
      (d.layoutPosition = function () {
        var t = this.layout.size,
          e = {},
          i = this.layout._getOption("originLeft"),
          o = this.layout._getOption("originTop"),
          n = i ? "paddingLeft" : "paddingRight",
          s = i ? "left" : "right",
          r = i ? "right" : "left",
          a = this.position.x + t[n];
        (e[s] = this.getXValue(a)), (e[r] = "");
        var u = o ? "paddingTop" : "paddingBottom",
          h = o ? "top" : "bottom",
          d = o ? "bottom" : "top",
          l = this.position.y + t[u];
        (e[h] = this.getYValue(l)),
          (e[d] = ""),
          this.css(e),
          this.emitEvent("layout", [this]);
      }),
      (d.getXValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e
          ? (t / this.layout.size.width) * 100 + "%"
          : t + "px";
      }),
      (d.getYValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e
          ? (t / this.layout.size.height) * 100 + "%"
          : t + "px";
      }),
      (d._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x,
          o = this.position.y,
          n = t == this.position.x && e == this.position.y;
        if ((this.setPosition(t, e), n && !this.isTransitioning))
          return void this.layoutPosition();
        var s = t - i,
          r = e - o,
          a = {};
        (a.transform = this.getTranslate(s, r)),
          this.transition({
            to: a,
            onTransitionEnd: { transform: this.layoutPosition },
            isCleaning: !0,
          });
      }),
      (d.getTranslate = function (t, e) {
        var i = this.layout._getOption("originLeft"),
          o = this.layout._getOption("originTop");
        return (
          (t = i ? t : -t),
          (e = o ? e : -e),
          "translate3d(" + t + "px, " + e + "px, 0)"
        );
      }),
      (d.goTo = function (t, e) {
        this.setPosition(t, e), this.layoutPosition();
      }),
      (d.moveTo = d._transitionTo),
      (d.setPosition = function (t, e) {
        (this.position.x = parseFloat(t)), (this.position.y = parseFloat(e));
      }),
      (d._nonTransition = function (t) {
        this.css(t.to), t.isCleaning && this._removeStyles(t.to);
        for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this);
      }),
      (d.transition = function (t) {
        if (!parseFloat(this.layout.options.transitionDuration))
          return void this._nonTransition(t);
        var e = this._transn;
        for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
        for (i in t.to)
          (e.ingProperties[i] = !0), t.isCleaning && (e.clean[i] = !0);
        if (t.from) {
          this.css(t.from);
          var o = this.element.offsetHeight;
          o = null;
        }
        this.enableTransition(t.to),
          this.css(t.to),
          (this.isTransitioning = !0);
      });
    var l = "opacity," + n(a);
    (d.enableTransition = function () {
      if (!this.isTransitioning) {
        var t = this.layout.options.transitionDuration;
        (t = "number" == typeof t ? t + "ms" : t),
          this.css({
            transitionProperty: l,
            transitionDuration: t,
            transitionDelay: this.staggerDelay || 0,
          }),
          this.element.addEventListener(u, this, !1);
      }
    }),
      (d.onwebkitTransitionEnd = function (t) {
        this.ontransitionend(t);
      }),
      (d.onotransitionend = function (t) {
        this.ontransitionend(t);
      });
    var f = { "-webkit-transform": "transform" };
    (d.ontransitionend = function (t) {
      if (t.target === this.element) {
        var e = this._transn,
          o = f[t.propertyName] || t.propertyName;
        if (
          (delete e.ingProperties[o],
          i(e.ingProperties) && this.disableTransition(),
          o in e.clean &&
            ((this.element.style[t.propertyName] = ""), delete e.clean[o]),
          o in e.onEnd)
        ) {
          var n = e.onEnd[o];
          n.call(this), delete e.onEnd[o];
        }
        this.emitEvent("transitionEnd", [this]);
      }
    }),
      (d.disableTransition = function () {
        this.removeTransitionStyles(),
          this.element.removeEventListener(u, this, !1),
          (this.isTransitioning = !1);
      }),
      (d._removeStyles = function (t) {
        var e = {};
        for (var i in t) e[i] = "";
        this.css(e);
      });
    var c = {
      transitionProperty: "",
      transitionDuration: "",
      transitionDelay: "",
    };
    return (
      (d.removeTransitionStyles = function () {
        this.css(c);
      }),
      (d.stagger = function (t) {
        (t = isNaN(t) ? 0 : t), (this.staggerDelay = t + "ms");
      }),
      (d.removeElem = function () {
        this.element.parentNode.removeChild(this.element),
          this.css({ display: "" }),
          this.emitEvent("remove", [this]);
      }),
      (d.remove = function () {
        return r && parseFloat(this.layout.options.transitionDuration)
          ? (this.once("transitionEnd", function () {
              this.removeElem();
            }),
            void this.hide())
          : void this.removeElem();
      }),
      (d.reveal = function () {
        delete this.isHidden, this.css({ display: "" });
        var t = this.layout.options,
          e = {},
          i = this.getHideRevealTransitionEndProperty("visibleStyle");
        (e[i] = this.onRevealTransitionEnd),
          this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (d.onRevealTransitionEnd = function () {
        this.isHidden || this.emitEvent("reveal");
      }),
      (d.getHideRevealTransitionEndProperty = function (t) {
        var e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (var i in e) return i;
      }),
      (d.hide = function () {
        (this.isHidden = !0), this.css({ display: "" });
        var t = this.layout.options,
          e = {},
          i = this.getHideRevealTransitionEndProperty("hiddenStyle");
        (e[i] = this.onHideTransitionEnd),
          this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (d.onHideTransitionEnd = function () {
        this.isHidden &&
          (this.css({ display: "none" }), this.emitEvent("hide"));
      }),
      (d.destroy = function () {
        this.css({
          position: "",
          left: "",
          right: "",
          top: "",
          bottom: "",
          transition: "",
          transform: "",
        });
      }),
      o
    );
  }),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(
          "outlayer/outlayer",
          [
            "ev-emitter/ev-emitter",
            "get-size/get-size",
            "fizzy-ui-utils/utils",
            "./item",
          ],
          function (i, o, n, s) {
            return e(t, i, o, n, s);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          t,
          require("ev-emitter"),
          require("get-size"),
          require("fizzy-ui-utils"),
          require("./item")
        ))
      : (t.Outlayer = e(
          t,
          t.EvEmitter,
          t.getSize,
          t.fizzyUIUtils,
          t.Outlayer.Item
        ));
  })(window, function (t, e, i, o, n) {
    "use strict";
    function s(t, e) {
      var i = o.getQueryElement(t);
      if (!i)
        return void (
          u &&
          u.error(
            "Bad element for " + this.constructor.namespace + ": " + (i || t)
          )
        );
      (this.element = i),
        h && (this.$element = h(this.element)),
        (this.options = o.extend({}, this.constructor.defaults)),
        this.option(e);
      var n = ++l;
      (this.element.outlayerGUID = n), (f[n] = this), this._create();
      var s = this._getOption("initLayout");
      s && this.layout();
    }
    function r(t) {
      function e() {
        t.apply(this, arguments);
      }
      return (
        (e.prototype = Object.create(t.prototype)),
        (e.prototype.constructor = e),
        e
      );
    }
    function a(t) {
      if ("number" == typeof t) return t;
      var e = t.match(/(^\d*\.?\d*)(\w*)/),
        i = e && e[1],
        o = e && e[2];
      if (!i.length) return 0;
      i = parseFloat(i);
      var n = m[o] || 1;
      return i * n;
    }
    var u = t.console,
      h = t.jQuery,
      d = function () {},
      l = 0,
      f = {};
    (s.namespace = "outlayer"),
      (s.Item = n),
      (s.defaults = {
        containerStyle: { position: "relative" },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
        visibleStyle: { opacity: 1, transform: "scale(1)" },
      });
    var c = s.prototype;
    o.extend(c, e.prototype),
      (c.option = function (t) {
        o.extend(this.options, t);
      }),
      (c._getOption = function (t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e]
          ? this.options[e]
          : this.options[t];
      }),
      (s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer",
      }),
      (c._create = function () {
        this.reloadItems(),
          (this.stamps = []),
          this.stamp(this.options.stamp),
          o.extend(this.element.style, this.options.containerStyle);
        var t = this._getOption("resize");
        t && this.bindResize();
      }),
      (c.reloadItems = function () {
        this.items = this._itemize(this.element.children);
      }),
      (c._itemize = function (t) {
        for (
          var e = this._filterFindItemElements(t),
            i = this.constructor.Item,
            o = [],
            n = 0;
          n < e.length;
          n++
        ) {
          var s = e[n],
            r = new i(s, this);
          o.push(r);
        }
        return o;
      }),
      (c._filterFindItemElements = function (t) {
        return o.filterFindElements(t, this.options.itemSelector);
      }),
      (c.getItemElements = function () {
        return this.items.map(function (t) {
          return t.element;
        });
      }),
      (c.layout = function () {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"),
          e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), (this._isLayoutInited = !0);
      }),
      (c._init = c.layout),
      (c._resetLayout = function () {
        this.getSize();
      }),
      (c.getSize = function () {
        this.size = i(this.element);
      }),
      (c._getMeasurement = function (t, e) {
        var o,
          n = this.options[t];
        n
          ? ("string" == typeof n
              ? (o = this.element.querySelector(n))
              : n instanceof HTMLElement && (o = n),
            (this[t] = o ? i(o)[e] : n))
          : (this[t] = 0);
      }),
      (c.layoutItems = function (t, e) {
        (t = this._getItemsForLayout(t)),
          this._layoutItems(t, e),
          this._postLayout();
      }),
      (c._getItemsForLayout = function (t) {
        return t.filter(function (t) {
          return !t.isIgnored;
        });
      }),
      (c._layoutItems = function (t, e) {
        if ((this._emitCompleteOnItems("layout", t), t && t.length)) {
          var i = [];
          t.forEach(function (t) {
            var o = this._getItemLayoutPosition(t);
            (o.item = t), (o.isInstant = e || t.isLayoutInstant), i.push(o);
          }, this),
            this._processLayoutQueue(i);
        }
      }),
      (c._getItemLayoutPosition = function () {
        return { x: 0, y: 0 };
      }),
      (c._processLayoutQueue = function (t) {
        this.updateStagger(),
          t.forEach(function (t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e);
          }, this);
      }),
      (c.updateStagger = function () {
        var t = this.options.stagger;
        return null === t || void 0 === t
          ? void (this.stagger = 0)
          : ((this.stagger = a(t)), this.stagger);
      }),
      (c._positionItem = function (t, e, i, o, n) {
        o ? t.goTo(e, i) : (t.stagger(n * this.stagger), t.moveTo(e, i));
      }),
      (c._postLayout = function () {
        this.resizeContainer();
      }),
      (c.resizeContainer = function () {
        var t = this._getOption("resizeContainer");
        if (t) {
          var e = this._getContainerSize();
          e &&
            (this._setContainerMeasure(e.width, !0),
            this._setContainerMeasure(e.height, !1));
        }
      }),
      (c._getContainerSize = d),
      (c._setContainerMeasure = function (t, e) {
        if (void 0 !== t) {
          var i = this.size;
          i.isBorderBox &&
            (t += e
              ? i.paddingLeft +
                i.paddingRight +
                i.borderLeftWidth +
                i.borderRightWidth
              : i.paddingBottom +
                i.paddingTop +
                i.borderTopWidth +
                i.borderBottomWidth),
            (t = Math.max(t, 0)),
            (this.element.style[e ? "width" : "height"] = t + "px");
        }
      }),
      (c._emitCompleteOnItems = function (t, e) {
        function i() {
          n.dispatchEvent(t + "Complete", null, [e]);
        }
        function o() {
          r++, r == s && i();
        }
        var n = this,
          s = e.length;
        if (!e || !s) return void i();
        var r = 0;
        e.forEach(function (e) {
          e.once(t, o);
        });
      }),
      (c.dispatchEvent = function (t, e, i) {
        var o = e ? [e].concat(i) : i;
        if ((this.emitEvent(t, o), h))
          if (((this.$element = this.$element || h(this.element)), e)) {
            var n = h.Event(e);
            (n.type = t), this.$element.trigger(n, i);
          } else this.$element.trigger(t, i);
      }),
      (c.ignore = function (t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0);
      }),
      (c.unignore = function (t) {
        var e = this.getItem(t);
        e && delete e.isIgnored;
      }),
      (c.stamp = function (t) {
        (t = this._find(t)),
          t &&
            ((this.stamps = this.stamps.concat(t)),
            t.forEach(this.ignore, this));
      }),
      (c.unstamp = function (t) {
        (t = this._find(t)),
          t &&
            t.forEach(function (t) {
              o.removeFrom(this.stamps, t), this.unignore(t);
            }, this);
      }),
      (c._find = function (t) {
        if (t)
          return (
            "string" == typeof t && (t = this.element.querySelectorAll(t)),
            (t = o.makeArray(t))
          );
      }),
      (c._manageStamps = function () {
        this.stamps &&
          this.stamps.length &&
          (this._getBoundingRect(),
          this.stamps.forEach(this._manageStamp, this));
      }),
      (c._getBoundingRect = function () {
        var t = this.element.getBoundingClientRect(),
          e = this.size;
        this._boundingRect = {
          left: t.left + e.paddingLeft + e.borderLeftWidth,
          top: t.top + e.paddingTop + e.borderTopWidth,
          right: t.right - (e.paddingRight + e.borderRightWidth),
          bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth),
        };
      }),
      (c._manageStamp = d),
      (c._getElementOffset = function (t) {
        var e = t.getBoundingClientRect(),
          o = this._boundingRect,
          n = i(t),
          s = {
            left: e.left - o.left - n.marginLeft,
            top: e.top - o.top - n.marginTop,
            right: o.right - e.right - n.marginRight,
            bottom: o.bottom - e.bottom - n.marginBottom,
          };
        return s;
      }),
      (c.handleEvent = o.handleEvent),
      (c.bindResize = function () {
        t.addEventListener("resize", this), (this.isResizeBound = !0);
      }),
      (c.unbindResize = function () {
        t.removeEventListener("resize", this), (this.isResizeBound = !1);
      }),
      (c.onresize = function () {
        this.resize();
      }),
      o.debounceMethod(s, "onresize", 100),
      (c.resize = function () {
        this.isResizeBound && this.needsResizeLayout() && this.layout();
      }),
      (c.needsResizeLayout = function () {
        var t = i(this.element),
          e = this.size && t;
        return e && t.innerWidth !== this.size.innerWidth;
      }),
      (c.addItems = function (t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e;
      }),
      (c.appended = function (t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e));
      }),
      (c.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
          var i = this.items.slice(0);
          (this.items = e.concat(i)),
            this._resetLayout(),
            this._manageStamps(),
            this.layoutItems(e, !0),
            this.reveal(e),
            this.layoutItems(i);
        }
      }),
      (c.reveal = function (t) {
        if ((this._emitCompleteOnItems("reveal", t), t && t.length)) {
          var e = this.updateStagger();
          t.forEach(function (t, i) {
            t.stagger(i * e), t.reveal();
          });
        }
      }),
      (c.hide = function (t) {
        if ((this._emitCompleteOnItems("hide", t), t && t.length)) {
          var e = this.updateStagger();
          t.forEach(function (t, i) {
            t.stagger(i * e), t.hide();
          });
        }
      }),
      (c.revealItemElements = function (t) {
        var e = this.getItems(t);
        this.reveal(e);
      }),
      (c.hideItemElements = function (t) {
        var e = this.getItems(t);
        this.hide(e);
      }),
      (c.getItem = function (t) {
        for (var e = 0; e < this.items.length; e++) {
          var i = this.items[e];
          if (i.element == t) return i;
        }
      }),
      (c.getItems = function (t) {
        t = o.makeArray(t);
        var e = [];
        return (
          t.forEach(function (t) {
            var i = this.getItem(t);
            i && e.push(i);
          }, this),
          e
        );
      }),
      (c.remove = function (t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e),
          e &&
            e.length &&
            e.forEach(function (t) {
              t.remove(), o.removeFrom(this.items, t);
            }, this);
      }),
      (c.destroy = function () {
        var t = this.element.style;
        (t.height = ""),
          (t.position = ""),
          (t.width = ""),
          this.items.forEach(function (t) {
            t.destroy();
          }),
          this.unbindResize();
        var e = this.element.outlayerGUID;
        delete f[e],
          delete this.element.outlayerGUID,
          h && h.removeData(this.element, this.constructor.namespace);
      }),
      (s.data = function (t) {
        t = o.getQueryElement(t);
        var e = t && t.outlayerGUID;
        return e && f[e];
      }),
      (s.create = function (t, e) {
        var i = r(s);
        return (
          (i.defaults = o.extend({}, s.defaults)),
          o.extend(i.defaults, e),
          (i.compatOptions = o.extend({}, s.compatOptions)),
          (i.namespace = t),
          (i.data = s.data),
          (i.Item = r(n)),
          o.htmlInit(i, t),
          h && h.bridget && h.bridget(t, i),
          i
        );
      });
    var m = { ms: 1, s: 1e3 };
    return (s.Item = n), s;
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/item", ["outlayer/outlayer"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("outlayer")))
      : ((t.Isotope = t.Isotope || {}), (t.Isotope.Item = e(t.Outlayer)));
  })(window, function (t) {
    "use strict";
    function e() {
      t.Item.apply(this, arguments);
    }
    var i = (e.prototype = Object.create(t.Item.prototype)),
      o = i._create;
    (i._create = function () {
      (this.id = this.layout.itemGUID++), o.call(this), (this.sortData = {});
    }),
      (i.updateSortData = function () {
        if (!this.isIgnored) {
          (this.sortData.id = this.id),
            (this.sortData["original-order"] = this.id),
            (this.sortData.random = Math.random());
          var t = this.layout.options.getSortData,
            e = this.layout._sorters;
          for (var i in t) {
            var o = e[i];
            this.sortData[i] = o(this.element, this);
          }
        }
      });
    var n = i.destroy;
    return (
      (i.destroy = function () {
        n.apply(this, arguments), this.css({ display: "" });
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "isotope-layout/js/layout-mode",
          ["get-size/get-size", "outlayer/outlayer"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("get-size"), require("outlayer")))
      : ((t.Isotope = t.Isotope || {}),
        (t.Isotope.LayoutMode = e(t.getSize, t.Outlayer)));
  })(window, function (t, e) {
    "use strict";
    function i(t) {
      (this.isotope = t),
        t &&
          ((this.options = t.options[this.namespace]),
          (this.element = t.element),
          (this.items = t.filteredItems),
          (this.size = t.size));
    }
    var o = i.prototype,
      n = [
        "_resetLayout",
        "_getItemLayoutPosition",
        "_manageStamp",
        "_getContainerSize",
        "_getElementOffset",
        "needsResizeLayout",
        "_getOption",
      ];
    return (
      n.forEach(function (t) {
        o[t] = function () {
          return e.prototype[t].apply(this.isotope, arguments);
        };
      }),
      (o.needsVerticalResizeLayout = function () {
        var e = t(this.isotope.element),
          i = this.isotope.size && e;
        return i && e.innerHeight != this.isotope.size.innerHeight;
      }),
      (o._getMeasurement = function () {
        this.isotope._getMeasurement.apply(this, arguments);
      }),
      (o.getColumnWidth = function () {
        this.getSegmentSize("column", "Width");
      }),
      (o.getRowHeight = function () {
        this.getSegmentSize("row", "Height");
      }),
      (o.getSegmentSize = function (t, e) {
        var i = t + e,
          o = "outer" + e;
        if ((this._getMeasurement(i, o), !this[i])) {
          var n = this.getFirstItemSize();
          this[i] = (n && n[o]) || this.isotope.size["inner" + e];
        }
      }),
      (o.getFirstItemSize = function () {
        var e = this.isotope.filteredItems[0];
        return e && e.element && t(e.element);
      }),
      (o.layout = function () {
        this.isotope.layout.apply(this.isotope, arguments);
      }),
      (o.getSize = function () {
        this.isotope.getSize(), (this.size = this.isotope.size);
      }),
      (i.modes = {}),
      (i.create = function (t, e) {
        function n() {
          i.apply(this, arguments);
        }
        return (
          (n.prototype = Object.create(o)),
          (n.prototype.constructor = n),
          e && (n.options = e),
          (n.prototype.namespace = t),
          (i.modes[t] = n),
          n
        );
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "masonry-layout/masonry",
          ["outlayer/outlayer", "get-size/get-size"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("outlayer"), require("get-size")))
      : (t.Masonry = e(t.Outlayer, t.getSize));
  })(window, function (t, e) {
    var i = t.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    var o = i.prototype;
    return (
      (o._resetLayout = function () {
        this.getSize(),
          this._getMeasurement("columnWidth", "outerWidth"),
          this._getMeasurement("gutter", "outerWidth"),
          this.measureColumns(),
          (this.colYs = []);
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        (this.maxY = 0), (this.horizontalColIndex = 0);
      }),
      (o.measureColumns = function () {
        if ((this.getContainerWidth(), !this.columnWidth)) {
          var t = this.items[0],
            i = t && t.element;
          this.columnWidth = (i && e(i).outerWidth) || this.containerWidth;
        }
        var o = (this.columnWidth += this.gutter),
          n = this.containerWidth + this.gutter,
          s = n / o,
          r = o - (n % o),
          a = r && r < 1 ? "round" : "floor";
        (s = Math[a](s)), (this.cols = Math.max(s, 1));
      }),
      (o.getContainerWidth = function () {
        var t = this._getOption("fitWidth"),
          i = t ? this.element.parentNode : this.element,
          o = e(i);
        this.containerWidth = o && o.innerWidth;
      }),
      (o._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth,
          i = e && e < 1 ? "round" : "ceil",
          o = Math[i](t.size.outerWidth / this.columnWidth);
        o = Math.min(o, this.cols);
        for (
          var n = this.options.horizontalOrder
              ? "_getHorizontalColPosition"
              : "_getTopColPosition",
            s = this[n](o, t),
            r = { x: this.columnWidth * s.col, y: s.y },
            a = s.y + t.size.outerHeight,
            u = o + s.col,
            h = s.col;
          h < u;
          h++
        )
          this.colYs[h] = a;
        return r;
      }),
      (o._getTopColPosition = function (t) {
        var e = this._getTopColGroup(t),
          i = Math.min.apply(Math, e);
        return { col: e.indexOf(i), y: i };
      }),
      (o._getTopColGroup = function (t) {
        if (t < 2) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, o = 0; o < i; o++)
          e[o] = this._getColGroupY(o, t);
        return e;
      }),
      (o._getColGroupY = function (t, e) {
        if (e < 2) return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i);
      }),
      (o._getHorizontalColPosition = function (t, e) {
        var i = this.horizontalColIndex % this.cols,
          o = t > 1 && i + t > this.cols;
        i = o ? 0 : i;
        var n = e.size.outerWidth && e.size.outerHeight;
        return (
          (this.horizontalColIndex = n ? i + t : this.horizontalColIndex),
          { col: i, y: this._getColGroupY(i, t) }
        );
      }),
      (o._manageStamp = function (t) {
        var i = e(t),
          o = this._getElementOffset(t),
          n = this._getOption("originLeft"),
          s = n ? o.left : o.right,
          r = s + i.outerWidth,
          a = Math.floor(s / this.columnWidth);
        a = Math.max(0, a);
        var u = Math.floor(r / this.columnWidth);
        (u -= r % this.columnWidth ? 0 : 1), (u = Math.min(this.cols - 1, u));
        for (
          var h = this._getOption("originTop"),
            d = (h ? o.top : o.bottom) + i.outerHeight,
            l = a;
          l <= u;
          l++
        )
          this.colYs[l] = Math.max(d, this.colYs[l]);
      }),
      (o._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = { height: this.maxY };
        return (
          this._getOption("fitWidth") &&
            (t.width = this._getContainerFitWidth()),
          t
        );
      }),
      (o._getContainerFitWidth = function () {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; ) t++;
        return (this.cols - t) * this.columnWidth - this.gutter;
      }),
      (o.needsResizeLayout = function () {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth;
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "isotope-layout/js/layout-modes/masonry",
          ["../layout-mode", "masonry-layout/masonry"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          require("../layout-mode"),
          require("masonry-layout")
        ))
      : e(t.Isotope.LayoutMode, t.Masonry);
  })(window, function (t, e) {
    "use strict";
    var i = t.create("masonry"),
      o = i.prototype,
      n = { _getElementOffset: !0, layout: !0, _getMeasurement: !0 };
    for (var s in e.prototype) n[s] || (o[s] = e.prototype[s]);
    var r = o.measureColumns;
    o.measureColumns = function () {
      (this.items = this.isotope.filteredItems), r.call(this);
    };
    var a = o._getOption;
    return (
      (o._getOption = function (t) {
        return "fitWidth" == t
          ? void 0 !== this.options.isFitWidth
            ? this.options.isFitWidth
            : this.options.fitWidth
          : a.apply(this.isotope, arguments);
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/layout-modes/fit-rows", ["../layout-mode"], e)
      : "object" == typeof exports
      ? (module.exports = e(require("../layout-mode")))
      : e(t.Isotope.LayoutMode);
  })(window, function (t) {
    "use strict";
    var e = t.create("fitRows"),
      i = e.prototype;
    return (
      (i._resetLayout = function () {
        (this.x = 0),
          (this.y = 0),
          (this.maxY = 0),
          this._getMeasurement("gutter", "outerWidth");
      }),
      (i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth + this.gutter,
          i = this.isotope.size.innerWidth + this.gutter;
        0 !== this.x && e + this.x > i && ((this.x = 0), (this.y = this.maxY));
        var o = { x: this.x, y: this.y };
        return (
          (this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight)),
          (this.x += e),
          o
        );
      }),
      (i._getContainerSize = function () {
        return { height: this.maxY };
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/layout-modes/vertical", ["../layout-mode"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("../layout-mode")))
      : e(t.Isotope.LayoutMode);
  })(window, function (t) {
    "use strict";
    var e = t.create("vertical", { horizontalAlignment: 0 }),
      i = e.prototype;
    return (
      (i._resetLayout = function () {
        this.y = 0;
      }),
      (i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e =
            (this.isotope.size.innerWidth - t.size.outerWidth) *
            this.options.horizontalAlignment,
          i = this.y;
        return (this.y += t.size.outerHeight), { x: e, y: i };
      }),
      (i._getContainerSize = function () {
        return { height: this.y };
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          [
            "outlayer/outlayer",
            "get-size/get-size",
            "desandro-matches-selector/matches-selector",
            "fizzy-ui-utils/utils",
            "isotope-layout/js/item",
            "isotope-layout/js/layout-mode",
            "isotope-layout/js/layout-modes/masonry",
            "isotope-layout/js/layout-modes/fit-rows",
            "isotope-layout/js/layout-modes/vertical",
          ],
          function (i, o, n, s, r, a) {
            return e(t, i, o, n, s, r, a);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          t,
          require("outlayer"),
          require("get-size"),
          require("desandro-matches-selector"),
          require("fizzy-ui-utils"),
          require("isotope-layout/js/item"),
          require("isotope-layout/js/layout-mode"),
          require("isotope-layout/js/layout-modes/masonry"),
          require("isotope-layout/js/layout-modes/fit-rows"),
          require("isotope-layout/js/layout-modes/vertical")
        ))
      : (t.Isotope = e(
          t,
          t.Outlayer,
          t.getSize,
          t.matchesSelector,
          t.fizzyUIUtils,
          t.Isotope.Item,
          t.Isotope.LayoutMode
        ));
  })(window, function (t, e, i, o, n, s, r) {
    function a(t, e) {
      return function (i, o) {
        for (var n = 0; n < t.length; n++) {
          var s = t[n],
            r = i.sortData[s],
            a = o.sortData[s];
          if (r > a || r < a) {
            var u = void 0 !== e[s] ? e[s] : e,
              h = u ? 1 : -1;
            return (r > a ? 1 : -1) * h;
          }
        }
        return 0;
      };
    }
    var u = t.jQuery,
      h = String.prototype.trim
        ? function (t) {
            return t.trim();
          }
        : function (t) {
            return t.replace(/^\s+|\s+$/g, "");
          },
      d = e.create("isotope", {
        layoutMode: "masonry",
        isJQueryFiltering: !0,
        sortAscending: !0,
      });
    (d.Item = s), (d.LayoutMode = r);
    var l = d.prototype;
    (l._create = function () {
      (this.itemGUID = 0),
        (this._sorters = {}),
        this._getSorters(),
        e.prototype._create.call(this),
        (this.modes = {}),
        (this.filteredItems = this.items),
        (this.sortHistory = ["original-order"]);
      for (var t in r.modes) this._initLayoutMode(t);
    }),
      (l.reloadItems = function () {
        (this.itemGUID = 0), e.prototype.reloadItems.call(this);
      }),
      (l._itemize = function () {
        for (
          var t = e.prototype._itemize.apply(this, arguments), i = 0;
          i < t.length;
          i++
        ) {
          var o = t[i];
          o.id = this.itemGUID++;
        }
        return this._updateItemsSortData(t), t;
      }),
      (l._initLayoutMode = function (t) {
        var e = r.modes[t],
          i = this.options[t] || {};
        (this.options[t] = e.options ? n.extend(e.options, i) : i),
          (this.modes[t] = new e(this));
      }),
      (l.layout = function () {
        return !this._isLayoutInited && this._getOption("initLayout")
          ? void this.arrange()
          : void this._layout();
      }),
      (l._layout = function () {
        var t = this._getIsInstant();
        this._resetLayout(),
          this._manageStamps(),
          this.layoutItems(this.filteredItems, t),
          (this._isLayoutInited = !0);
      }),
      (l.arrange = function (t) {
        this.option(t), this._getIsInstant();
        var e = this._filter(this.items);
        (this.filteredItems = e.matches),
          this._bindArrangeComplete(),
          this._isInstant
            ? this._noTransition(this._hideReveal, [e])
            : this._hideReveal(e),
          this._sort(),
          this._layout();
      }),
      (l._init = l.arrange),
      (l._hideReveal = function (t) {
        this.reveal(t.needReveal), this.hide(t.needHide);
      }),
      (l._getIsInstant = function () {
        var t = this._getOption("layoutInstant"),
          e = void 0 !== t ? t : !this._isLayoutInited;
        return (this._isInstant = e), e;
      }),
      (l._bindArrangeComplete = function () {
        function t() {
          e &&
            i &&
            o &&
            n.dispatchEvent("arrangeComplete", null, [n.filteredItems]);
        }
        var e,
          i,
          o,
          n = this;
        this.once("layoutComplete", function () {
          (e = !0), t();
        }),
          this.once("hideComplete", function () {
            (i = !0), t();
          }),
          this.once("revealComplete", function () {
            (o = !0), t();
          });
      }),
      (l._filter = function (t) {
        var e = this.options.filter;
        e = e || "*";
        for (
          var i = [], o = [], n = [], s = this._getFilterTest(e), r = 0;
          r < t.length;
          r++
        ) {
          var a = t[r];
          if (!a.isIgnored) {
            var u = s(a);
            u && i.push(a),
              u && a.isHidden ? o.push(a) : u || a.isHidden || n.push(a);
          }
        }
        return { matches: i, needReveal: o, needHide: n };
      }),
      (l._getFilterTest = function (t) {
        return u && this.options.isJQueryFiltering
          ? function (e) {
              return u(e.element).is(t);
            }
          : "function" == typeof t
          ? function (e) {
              return t(e.element);
            }
          : function (e) {
              return o(e.element, t);
            };
      }),
      (l.updateSortData = function (t) {
        var e;
        t ? ((t = n.makeArray(t)), (e = this.getItems(t))) : (e = this.items),
          this._getSorters(),
          this._updateItemsSortData(e);
      }),
      (l._getSorters = function () {
        var t = this.options.getSortData;
        for (var e in t) {
          var i = t[e];
          this._sorters[e] = f(i);
        }
      }),
      (l._updateItemsSortData = function (t) {
        for (var e = t && t.length, i = 0; e && i < e; i++) {
          var o = t[i];
          o.updateSortData();
        }
      });
    var f = (function () {
      function t(t) {
        if ("string" != typeof t) return t;
        var i = h(t).split(" "),
          o = i[0],
          n = o.match(/^\[(.+)\]$/),
          s = n && n[1],
          r = e(s, o),
          a = d.sortDataParsers[i[1]];
        return (t = a
          ? function (t) {
              return t && a(r(t));
            }
          : function (t) {
              return t && r(t);
            });
      }
      function e(t, e) {
        return t
          ? function (e) {
              return e.getAttribute(t);
            }
          : function (t) {
              var i = t.querySelector(e);
              return i && i.textContent;
            };
      }
      return t;
    })();
    (d.sortDataParsers = {
      parseInt: function (t) {
        return parseInt(t, 10);
      },
      parseFloat: function (t) {
        return parseFloat(t);
      },
    }),
      (l._sort = function () {
        if (this.options.sortBy) {
          var t = n.makeArray(this.options.sortBy);
          this._getIsSameSortBy(t) ||
            (this.sortHistory = t.concat(this.sortHistory));
          var e = a(this.sortHistory, this.options.sortAscending);
          this.filteredItems.sort(e);
        }
      }),
      (l._getIsSameSortBy = function (t) {
        for (var e = 0; e < t.length; e++)
          if (t[e] != this.sortHistory[e]) return !1;
        return !0;
      }),
      (l._mode = function () {
        var t = this.options.layoutMode,
          e = this.modes[t];
        if (!e) throw new Error("No layout mode: " + t);
        return (e.options = this.options[t]), e;
      }),
      (l._resetLayout = function () {
        e.prototype._resetLayout.call(this), this._mode()._resetLayout();
      }),
      (l._getItemLayoutPosition = function (t) {
        return this._mode()._getItemLayoutPosition(t);
      }),
      (l._manageStamp = function (t) {
        this._mode()._manageStamp(t);
      }),
      (l._getContainerSize = function () {
        return this._mode()._getContainerSize();
      }),
      (l.needsResizeLayout = function () {
        return this._mode().needsResizeLayout();
      }),
      (l.appended = function (t) {
        var e = this.addItems(t);
        if (e.length) {
          var i = this._filterRevealAdded(e);
          this.filteredItems = this.filteredItems.concat(i);
        }
      }),
      (l.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
          this._resetLayout(), this._manageStamps();
          var i = this._filterRevealAdded(e);
          this.layoutItems(this.filteredItems),
            (this.filteredItems = i.concat(this.filteredItems)),
            (this.items = e.concat(this.items));
        }
      }),
      (l._filterRevealAdded = function (t) {
        var e = this._filter(t);
        return (
          this.hide(e.needHide),
          this.reveal(e.matches),
          this.layoutItems(e.matches, !0),
          e.matches
        );
      }),
      (l.insert = function (t) {
        var e = this.addItems(t);
        if (e.length) {
          var i,
            o,
            n = e.length;
          for (i = 0; i < n; i++)
            (o = e[i]), this.element.appendChild(o.element);
          var s = this._filter(e).matches;
          for (i = 0; i < n; i++) e[i].isLayoutInstant = !0;
          for (this.arrange(), i = 0; i < n; i++) delete e[i].isLayoutInstant;
          this.reveal(s);
        }
      });
    var c = l.remove;
    return (
      (l.remove = function (t) {
        t = n.makeArray(t);
        var e = this.getItems(t);
        c.call(this, t);
        for (var i = e && e.length, o = 0; i && o < i; o++) {
          var s = e[o];
          n.removeFrom(this.filteredItems, s);
        }
      }),
      (l.shuffle = function () {
        for (var t = 0; t < this.items.length; t++) {
          var e = this.items[t];
          e.sortData.random = Math.random();
        }
        (this.options.sortBy = "random"), this._sort(), this._layout();
      }),
      (l._noTransition = function (t, e) {
        var i = this.options.transitionDuration;
        this.options.transitionDuration = 0;
        var o = t.apply(this, e);
        return (this.options.transitionDuration = i), o;
      }),
      (l.getFilteredItemElements = function () {
        return this.filteredItems.map(function (t) {
          return t.element;
        });
      }),
      d
    );
  });
/*!
 * imagesLoaded PACKAGED v4.1.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

!(function (t, e) {
  "function" == typeof define && define.amd
    ? define("ev-emitter/ev-emitter", e)
    : "object" == typeof module && module.exports
    ? (module.exports = e())
    : (t.EvEmitter = e());
})(this, function () {
  function t() {}
  var e = t.prototype;
  return (
    (e.on = function (t, e) {
      if (t && e) {
        var i = (this._events = this._events || {}),
          n = (i[t] = i[t] || []);
        return -1 == n.indexOf(e) && n.push(e), this;
      }
    }),
    (e.once = function (t, e) {
      if (t && e) {
        this.on(t, e);
        var i = (this._onceEvents = this._onceEvents || {}),
          n = (i[t] = i[t] || []);
        return (n[e] = !0), this;
      }
    }),
    (e.off = function (t, e) {
      var i = this._events && this._events[t];
      if (i && i.length) {
        var n = i.indexOf(e);
        return -1 != n && i.splice(n, 1), this;
      }
    }),
    (e.emitEvent = function (t, e) {
      var i = this._events && this._events[t];
      if (i && i.length) {
        var n = 0,
          o = i[n];
        e = e || [];
        for (var r = this._onceEvents && this._onceEvents[t]; o; ) {
          var s = r && r[o];
          s && (this.off(t, o), delete r[o]),
            o.apply(this, e),
            (n += s ? 0 : 1),
            (o = i[n]);
        }
        return this;
      }
    }),
    t
  );
}),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["ev-emitter/ev-emitter"], function (i) {
          return e(t, i);
        })
      : "object" == typeof module && module.exports
      ? (module.exports = e(t, require("ev-emitter")))
      : (t.imagesLoaded = e(t, t.EvEmitter));
  })(window, function (t, e) {
    function i(t, e) {
      for (var i in e) t[i] = e[i];
      return t;
    }
    function n(t) {
      var e = [];
      if (Array.isArray(t)) e = t;
      else if ("number" == typeof t.length)
        for (var i = 0; i < t.length; i++) e.push(t[i]);
      else e.push(t);
      return e;
    }
    function o(t, e, r) {
      return this instanceof o
        ? ("string" == typeof t && (t = document.querySelectorAll(t)),
          (this.elements = n(t)),
          (this.options = i({}, this.options)),
          "function" == typeof e ? (r = e) : i(this.options, e),
          r && this.on("always", r),
          this.getImages(),
          h && (this.jqDeferred = new h.Deferred()),
          void setTimeout(
            function () {
              this.check();
            }.bind(this)
          ))
        : new o(t, e, r);
    }
    function r(t) {
      this.img = t;
    }
    function s(t, e) {
      (this.url = t), (this.element = e), (this.img = new Image());
    }
    var h = t.jQuery,
      a = t.console;
    (o.prototype = Object.create(e.prototype)),
      (o.prototype.options = {}),
      (o.prototype.getImages = function () {
        (this.images = []), this.elements.forEach(this.addElementImages, this);
      }),
      (o.prototype.addElementImages = function (t) {
        "IMG" == t.nodeName && this.addImage(t),
          this.options.background === !0 && this.addElementBackgroundImages(t);
        var e = t.nodeType;
        if (e && d[e]) {
          for (var i = t.querySelectorAll("img"), n = 0; n < i.length; n++) {
            var o = i[n];
            this.addImage(o);
          }
          if ("string" == typeof this.options.background) {
            var r = t.querySelectorAll(this.options.background);
            for (n = 0; n < r.length; n++) {
              var s = r[n];
              this.addElementBackgroundImages(s);
            }
          }
        }
      });
    var d = { 1: !0, 9: !0, 11: !0 };
    return (
      (o.prototype.addElementBackgroundImages = function (t) {
        var e = getComputedStyle(t);
        if (e)
          for (
            var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(e.backgroundImage);
            null !== n;

          ) {
            var o = n && n[2];
            o && this.addBackground(o, t), (n = i.exec(e.backgroundImage));
          }
      }),
      (o.prototype.addImage = function (t) {
        var e = new r(t);
        this.images.push(e);
      }),
      (o.prototype.addBackground = function (t, e) {
        var i = new s(t, e);
        this.images.push(i);
      }),
      (o.prototype.check = function () {
        function t(t, i, n) {
          setTimeout(function () {
            e.progress(t, i, n);
          });
        }
        var e = this;
        return (
          (this.progressedCount = 0),
          (this.hasAnyBroken = !1),
          this.images.length
            ? void this.images.forEach(function (e) {
                e.once("progress", t), e.check();
              })
            : void this.complete()
        );
      }),
      (o.prototype.progress = function (t, e, i) {
        this.progressedCount++,
          (this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded),
          this.emitEvent("progress", [this, t, e]),
          this.jqDeferred &&
            this.jqDeferred.notify &&
            this.jqDeferred.notify(this, t),
          this.progressedCount == this.images.length && this.complete(),
          this.options.debug && a && a.log("progress: " + i, t, e);
      }),
      (o.prototype.complete = function () {
        var t = this.hasAnyBroken ? "fail" : "done";
        if (
          ((this.isComplete = !0),
          this.emitEvent(t, [this]),
          this.emitEvent("always", [this]),
          this.jqDeferred)
        ) {
          var e = this.hasAnyBroken ? "reject" : "resolve";
          this.jqDeferred[e](this);
        }
      }),
      (r.prototype = Object.create(e.prototype)),
      (r.prototype.check = function () {
        var t = this.getIsImageComplete();
        return t
          ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth")
          : ((this.proxyImage = new Image()),
            this.proxyImage.addEventListener("load", this),
            this.proxyImage.addEventListener("error", this),
            this.img.addEventListener("load", this),
            this.img.addEventListener("error", this),
            void (this.proxyImage.src = this.img.src));
      }),
      (r.prototype.getIsImageComplete = function () {
        return this.img.complete && void 0 !== this.img.naturalWidth;
      }),
      (r.prototype.confirm = function (t, e) {
        (this.isLoaded = t), this.emitEvent("progress", [this, this.img, e]);
      }),
      (r.prototype.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (r.prototype.onload = function () {
        this.confirm(!0, "onload"), this.unbindEvents();
      }),
      (r.prototype.onerror = function () {
        this.confirm(!1, "onerror"), this.unbindEvents();
      }),
      (r.prototype.unbindEvents = function () {
        this.proxyImage.removeEventListener("load", this),
          this.proxyImage.removeEventListener("error", this),
          this.img.removeEventListener("load", this),
          this.img.removeEventListener("error", this);
      }),
      (s.prototype = Object.create(r.prototype)),
      (s.prototype.check = function () {
        this.img.addEventListener("load", this),
          this.img.addEventListener("error", this),
          (this.img.src = this.url);
        var t = this.getIsImageComplete();
        t &&
          (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
          this.unbindEvents());
      }),
      (s.prototype.unbindEvents = function () {
        this.img.removeEventListener("load", this),
          this.img.removeEventListener("error", this);
      }),
      (s.prototype.confirm = function (t, e) {
        (this.isLoaded = t),
          this.emitEvent("progress", [this, this.element, e]);
      }),
      (o.makeJQueryPlugin = function (e) {
        (e = e || t.jQuery),
          e &&
            ((h = e),
            (h.fn.imagesLoaded = function (t, e) {
              var i = new o(this, t, e);
              return i.jqDeferred.promise(h(this));
            }));
      }),
      o.makeJQueryPlugin(),
      o
    );
  });
/*-----------------------------------------------------------------------------------*/
/*	06. OWL CAROUSEL
/*-----------------------------------------------------------------------------------*/
/**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
!(function (a, b, c, d) {
  function e(b, c) {
    (this.settings = null),
      (this.options = a.extend({}, e.Defaults, c)),
      (this.$element = a(b)),
      (this._handlers = {}),
      (this._plugins = {}),
      (this._supress = {}),
      (this._current = null),
      (this._speed = null),
      (this._coordinates = []),
      (this._breakpoint = null),
      (this._width = null),
      (this._items = []),
      (this._clones = []),
      (this._mergers = []),
      (this._widths = []),
      (this._invalidated = {}),
      (this._pipe = []),
      (this._drag = {
        time: null,
        target: null,
        pointer: null,
        stage: { start: null, current: null },
        direction: null,
      }),
      (this._states = {
        current: {},
        tags: {
          initializing: ["busy"],
          animating: ["busy"],
          dragging: ["interacting"],
        },
      }),
      a.each(
        ["onResize", "onThrottledResize"],
        a.proxy(function (b, c) {
          this._handlers[c] = a.proxy(this[c], this);
        }, this)
      ),
      a.each(
        e.Plugins,
        a.proxy(function (a, b) {
          this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this);
        }, this)
      ),
      a.each(
        e.Workers,
        a.proxy(function (b, c) {
          this._pipe.push({ filter: c.filter, run: a.proxy(c.run, this) });
        }, this)
      ),
      this.setup(),
      this.initialize();
  }
  (e.Defaults = {
    items: 3,
    loop: !1,
    center: !1,
    rewind: !1,
    checkVisibility: !0,
    mouseDrag: !0,
    touchDrag: !0,
    pullDrag: !0,
    freeDrag: !1,
    margin: 0,
    stagePadding: 0,
    merge: !1,
    mergeFit: !0,
    autoWidth: !1,
    startPosition: 0,
    rtl: !1,
    smartSpeed: 250,
    fluidSpeed: !1,
    dragEndSpeed: !1,
    responsive: {},
    responsiveRefreshRate: 200,
    responsiveBaseElement: b,
    fallbackEasing: "swing",
    slideTransition: "",
    info: !1,
    nestedItemSelector: !1,
    itemElement: "div",
    stageElement: "div",
    refreshClass: "owl-refresh",
    loadedClass: "owl-loaded",
    loadingClass: "owl-loading",
    rtlClass: "owl-rtl",
    responsiveClass: "owl-responsive",
    dragClass: "owl-drag",
    itemClass: "owl-item",
    stageClass: "owl-stage",
    stageOuterClass: "owl-stage-outer",
    grabClass: "owl-grab",
  }),
    (e.Width = { Default: "default", Inner: "inner", Outer: "outer" }),
    (e.Type = { Event: "event", State: "state" }),
    (e.Plugins = {}),
    (e.Workers = [
      {
        filter: ["width", "settings"],
        run: function () {
          this._width = this.$element.width();
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          a.current = this._items && this._items[this.relative(this._current)];
        },
      },
      {
        filter: ["items", "settings"],
        run: function () {
          this.$stage.children(".cloned").remove();
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b = this.settings.margin || "",
            c = !this.settings.autoWidth,
            d = this.settings.rtl,
            e = {
              width: "auto",
              "margin-left": d ? b : "",
              "margin-right": d ? "" : b,
            };
          !c && this.$stage.children().css(e), (a.css = e);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b =
              (this.width() / this.settings.items).toFixed(3) -
              this.settings.margin,
            c = null,
            d = this._items.length,
            e = !this.settings.autoWidth,
            f = [];
          for (a.items = { merge: !1, width: b }; d--; )
            (c = this._mergers[d]),
              (c =
                (this.settings.mergeFit && Math.min(c, this.settings.items)) ||
                c),
              (a.items.merge = c > 1 || a.items.merge),
              (f[d] = e ? b * c : this._items[d].width());
          this._widths = f;
        },
      },
      {
        filter: ["items", "settings"],
        run: function () {
          var b = [],
            c = this._items,
            d = this.settings,
            e = Math.max(2 * d.items, 4),
            f = 2 * Math.ceil(c.length / 2),
            g = d.loop && c.length ? (d.rewind ? e : Math.max(e, f)) : 0,
            h = "",
            i = "";
          for (g /= 2; g > 0; )
            b.push(this.normalize(b.length / 2, !0)),
              (h += c[b[b.length - 1]][0].outerHTML),
              b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)),
              (i = c[b[b.length - 1]][0].outerHTML + i),
              (g -= 1);
          (this._clones = b),
            a(h).addClass("cloned").appendTo(this.$stage),
            a(i).addClass("cloned").prependTo(this.$stage);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function () {
          for (
            var a = this.settings.rtl ? 1 : -1,
              b = this._clones.length + this._items.length,
              c = -1,
              d = 0,
              e = 0,
              f = [];
            ++c < b;

          )
            (d = f[c - 1] || 0),
              (e = this._widths[this.relative(c)] + this.settings.margin),
              f.push(d + e * a);
          this._coordinates = f;
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function () {
          var a = this.settings.stagePadding,
            b = this._coordinates,
            c = {
              width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
              "padding-left": a || "",
              "padding-right": a || "",
            };
          this.$stage.css(c);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b = this._coordinates.length,
            c = !this.settings.autoWidth,
            d = this.$stage.children();
          if (c && a.items.merge)
            for (; b--; )
              (a.css.width = this._widths[this.relative(b)]),
                d.eq(b).css(a.css);
          else c && ((a.css.width = a.items.width), d.css(a.css));
        },
      },
      {
        filter: ["items"],
        run: function () {
          this._coordinates.length < 1 && this.$stage.removeAttr("style");
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          (a.current = a.current ? this.$stage.children().index(a.current) : 0),
            (a.current = Math.max(
              this.minimum(),
              Math.min(this.maximum(), a.current)
            )),
            this.reset(a.current);
        },
      },
      {
        filter: ["position"],
        run: function () {
          this.animate(this.coordinates(this._current));
        },
      },
      {
        filter: ["width", "position", "items", "settings"],
        run: function () {
          var a,
            b,
            c,
            d,
            e = this.settings.rtl ? 1 : -1,
            f = 2 * this.settings.stagePadding,
            g = this.coordinates(this.current()) + f,
            h = g + this.width() * e,
            i = [];
          for (c = 0, d = this._coordinates.length; c < d; c++)
            (a = this._coordinates[c - 1] || 0),
              (b = Math.abs(this._coordinates[c]) + f * e),
              ((this.op(a, "<=", g) && this.op(a, ">", h)) ||
                (this.op(b, "<", g) && this.op(b, ">", h))) &&
                i.push(c);
          this.$stage.children(".active").removeClass("active"),
            this.$stage
              .children(":eq(" + i.join("), :eq(") + ")")
              .addClass("active"),
            this.$stage.children(".center").removeClass("center"),
            this.settings.center &&
              this.$stage.children().eq(this.current()).addClass("center");
        },
      },
    ]),
    (e.prototype.initializeStage = function () {
      (this.$stage = this.$element.find("." + this.settings.stageClass)),
        this.$stage.length ||
          (this.$element.addClass(this.options.loadingClass),
          (this.$stage = a("<" + this.settings.stageElement + ">", {
            class: this.settings.stageClass,
          }).wrap(a("<div/>", { class: this.settings.stageOuterClass }))),
          this.$element.append(this.$stage.parent()));
    }),
    (e.prototype.initializeItems = function () {
      var b = this.$element.find(".owl-item");
      if (b.length)
        return (
          (this._items = b.get().map(function (b) {
            return a(b);
          })),
          (this._mergers = this._items.map(function () {
            return 1;
          })),
          void this.refresh()
        );
      this.replace(this.$element.children().not(this.$stage.parent())),
        this.isVisible() ? this.refresh() : this.invalidate("width"),
        this.$element
          .removeClass(this.options.loadingClass)
          .addClass(this.options.loadedClass);
    }),
    (e.prototype.initialize = function () {
      if (
        (this.enter("initializing"),
        this.trigger("initialize"),
        this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl),
        this.settings.autoWidth && !this.is("pre-loading"))
      ) {
        var a, b, c;
        (a = this.$element.find("img")),
          (b = this.settings.nestedItemSelector
            ? "." + this.settings.nestedItemSelector
            : d),
          (c = this.$element.children(b).width()),
          a.length && c <= 0 && this.preloadAutoWidthImages(a);
      }
      this.initializeStage(),
        this.initializeItems(),
        this.registerEventHandlers(),
        this.leave("initializing"),
        this.trigger("initialized");
    }),
    (e.prototype.isVisible = function () {
      return !this.settings.checkVisibility || this.$element.is(":visible");
    }),
    (e.prototype.setup = function () {
      var b = this.viewport(),
        c = this.options.responsive,
        d = -1,
        e = null;
      c
        ? (a.each(c, function (a) {
            a <= b && a > d && (d = Number(a));
          }),
          (e = a.extend({}, this.options, c[d])),
          "function" == typeof e.stagePadding &&
            (e.stagePadding = e.stagePadding()),
          delete e.responsive,
          e.responsiveClass &&
            this.$element.attr(
              "class",
              this.$element
                .attr("class")
                .replace(
                  new RegExp(
                    "(" + this.options.responsiveClass + "-)\\S+\\s",
                    "g"
                  ),
                  "$1" + d
                )
            ))
        : (e = a.extend({}, this.options)),
        this.trigger("change", { property: { name: "settings", value: e } }),
        (this._breakpoint = d),
        (this.settings = e),
        this.invalidate("settings"),
        this.trigger("changed", {
          property: { name: "settings", value: this.settings },
        });
    }),
    (e.prototype.optionsLogic = function () {
      this.settings.autoWidth &&
        ((this.settings.stagePadding = !1), (this.settings.merge = !1));
    }),
    (e.prototype.prepare = function (b) {
      var c = this.trigger("prepare", { content: b });
      return (
        c.data ||
          (c.data = a("<" + this.settings.itemElement + "/>")
            .addClass(this.options.itemClass)
            .append(b)),
        this.trigger("prepared", { content: c.data }),
        c.data
      );
    }),
    (e.prototype.update = function () {
      for (
        var b = 0,
          c = this._pipe.length,
          d = a.proxy(function (a) {
            return this[a];
          }, this._invalidated),
          e = {};
        b < c;

      )
        (this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) &&
          this._pipe[b].run(e),
          b++;
      (this._invalidated = {}), !this.is("valid") && this.enter("valid");
    }),
    (e.prototype.width = function (a) {
      switch ((a = a || e.Width.Default)) {
        case e.Width.Inner:
        case e.Width.Outer:
          return this._width;
        default:
          return (
            this._width - 2 * this.settings.stagePadding + this.settings.margin
          );
      }
    }),
    (e.prototype.refresh = function () {
      this.enter("refreshing"),
        this.trigger("refresh"),
        this.setup(),
        this.optionsLogic(),
        this.$element.addClass(this.options.refreshClass),
        this.update(),
        this.$element.removeClass(this.options.refreshClass),
        this.leave("refreshing"),
        this.trigger("refreshed");
    }),
    (e.prototype.onThrottledResize = function () {
      b.clearTimeout(this.resizeTimer),
        (this.resizeTimer = b.setTimeout(
          this._handlers.onResize,
          this.settings.responsiveRefreshRate
        ));
    }),
    (e.prototype.onResize = function () {
      return (
        !!this._items.length &&
        this._width !== this.$element.width() &&
        !!this.isVisible() &&
        (this.enter("resizing"),
        this.trigger("resize").isDefaultPrevented()
          ? (this.leave("resizing"), !1)
          : (this.invalidate("width"),
            this.refresh(),
            this.leave("resizing"),
            void this.trigger("resized")))
      );
    }),
    (e.prototype.registerEventHandlers = function () {
      a.support.transition &&
        this.$stage.on(
          a.support.transition.end + ".owl.core",
          a.proxy(this.onTransitionEnd, this)
        ),
        !1 !== this.settings.responsive &&
          this.on(b, "resize", this._handlers.onThrottledResize),
        this.settings.mouseDrag &&
          (this.$element.addClass(this.options.dragClass),
          this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)),
          this.$stage.on(
            "dragstart.owl.core selectstart.owl.core",
            function () {
              return !1;
            }
          )),
        this.settings.touchDrag &&
          (this.$stage.on(
            "touchstart.owl.core",
            a.proxy(this.onDragStart, this)
          ),
          this.$stage.on(
            "touchcancel.owl.core",
            a.proxy(this.onDragEnd, this)
          ));
    }),
    (e.prototype.onDragStart = function (b) {
      var d = null;
      3 !== b.which &&
        (a.support.transform
          ? ((d = this.$stage
              .css("transform")
              .replace(/.*\(|\)| /g, "")
              .split(",")),
            (d = {
              x: d[16 === d.length ? 12 : 4],
              y: d[16 === d.length ? 13 : 5],
            }))
          : ((d = this.$stage.position()),
            (d = {
              x: this.settings.rtl
                ? d.left +
                  this.$stage.width() -
                  this.width() +
                  this.settings.margin
                : d.left,
              y: d.top,
            })),
        this.is("animating") &&
          (a.support.transform ? this.animate(d.x) : this.$stage.stop(),
          this.invalidate("position")),
        this.$element.toggleClass(
          this.options.grabClass,
          "mousedown" === b.type
        ),
        this.speed(0),
        (this._drag.time = new Date().getTime()),
        (this._drag.target = a(b.target)),
        (this._drag.stage.start = d),
        (this._drag.stage.current = d),
        (this._drag.pointer = this.pointer(b)),
        a(c).on(
          "mouseup.owl.core touchend.owl.core",
          a.proxy(this.onDragEnd, this)
        ),
        a(c).one(
          "mousemove.owl.core touchmove.owl.core",
          a.proxy(function (b) {
            var d = this.difference(this._drag.pointer, this.pointer(b));
            a(c).on(
              "mousemove.owl.core touchmove.owl.core",
              a.proxy(this.onDragMove, this)
            ),
              (Math.abs(d.x) < Math.abs(d.y) && this.is("valid")) ||
                (b.preventDefault(),
                this.enter("dragging"),
                this.trigger("drag"));
          }, this)
        ));
    }),
    (e.prototype.onDragMove = function (a) {
      var b = null,
        c = null,
        d = null,
        e = this.difference(this._drag.pointer, this.pointer(a)),
        f = this.difference(this._drag.stage.start, e);
      this.is("dragging") &&
        (a.preventDefault(),
        this.settings.loop
          ? ((b = this.coordinates(this.minimum())),
            (c = this.coordinates(this.maximum() + 1) - b),
            (f.x = ((((f.x - b) % c) + c) % c) + b))
          : ((b = this.settings.rtl
              ? this.coordinates(this.maximum())
              : this.coordinates(this.minimum())),
            (c = this.settings.rtl
              ? this.coordinates(this.minimum())
              : this.coordinates(this.maximum())),
            (d = this.settings.pullDrag ? (-1 * e.x) / 5 : 0),
            (f.x = Math.max(Math.min(f.x, b + d), c + d))),
        (this._drag.stage.current = f),
        this.animate(f.x));
    }),
    (e.prototype.onDragEnd = function (b) {
      var d = this.difference(this._drag.pointer, this.pointer(b)),
        e = this._drag.stage.current,
        f = (d.x > 0) ^ this.settings.rtl ? "left" : "right";
      a(c).off(".owl.core"),
        this.$element.removeClass(this.options.grabClass),
        ((0 !== d.x && this.is("dragging")) || !this.is("valid")) &&
          (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
          this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)),
          this.invalidate("position"),
          this.update(),
          (this._drag.direction = f),
          (Math.abs(d.x) > 3 || new Date().getTime() - this._drag.time > 300) &&
            this._drag.target.one("click.owl.core", function () {
              return !1;
            })),
        this.is("dragging") &&
          (this.leave("dragging"), this.trigger("dragged"));
    }),
    (e.prototype.closest = function (b, c) {
      var e = -1,
        f = 30,
        g = this.width(),
        h = this.coordinates();
      return (
        this.settings.freeDrag ||
          a.each(
            h,
            a.proxy(function (a, i) {
              return (
                "left" === c && b > i - f && b < i + f
                  ? (e = a)
                  : "right" === c && b > i - g - f && b < i - g + f
                  ? (e = a + 1)
                  : this.op(b, "<", i) &&
                    this.op(b, ">", h[a + 1] !== d ? h[a + 1] : i - g) &&
                    (e = "left" === c ? a + 1 : a),
                -1 === e
              );
            }, this)
          ),
        this.settings.loop ||
          (this.op(b, ">", h[this.minimum()])
            ? (e = b = this.minimum())
            : this.op(b, "<", h[this.maximum()]) && (e = b = this.maximum())),
        e
      );
    }),
    (e.prototype.animate = function (b) {
      var c = this.speed() > 0;
      this.is("animating") && this.onTransitionEnd(),
        c && (this.enter("animating"), this.trigger("translate")),
        a.support.transform3d && a.support.transition
          ? this.$stage.css({
              transform: "translate3d(" + b + "px,0px,0px)",
              transition:
                this.speed() / 1e3 +
                "s" +
                (this.settings.slideTransition
                  ? " " + this.settings.slideTransition
                  : ""),
            })
          : c
          ? this.$stage.animate(
              { left: b + "px" },
              this.speed(),
              this.settings.fallbackEasing,
              a.proxy(this.onTransitionEnd, this)
            )
          : this.$stage.css({ left: b + "px" });
    }),
    (e.prototype.is = function (a) {
      return this._states.current[a] && this._states.current[a] > 0;
    }),
    (e.prototype.current = function (a) {
      if (a === d) return this._current;
      if (0 === this._items.length) return d;
      if (((a = this.normalize(a)), this._current !== a)) {
        var b = this.trigger("change", {
          property: { name: "position", value: a },
        });
        b.data !== d && (a = this.normalize(b.data)),
          (this._current = a),
          this.invalidate("position"),
          this.trigger("changed", {
            property: { name: "position", value: this._current },
          });
      }
      return this._current;
    }),
    (e.prototype.invalidate = function (b) {
      return (
        "string" === a.type(b) &&
          ((this._invalidated[b] = !0),
          this.is("valid") && this.leave("valid")),
        a.map(this._invalidated, function (a, b) {
          return b;
        })
      );
    }),
    (e.prototype.reset = function (a) {
      (a = this.normalize(a)) !== d &&
        ((this._speed = 0),
        (this._current = a),
        this.suppress(["translate", "translated"]),
        this.animate(this.coordinates(a)),
        this.release(["translate", "translated"]));
    }),
    (e.prototype.normalize = function (a, b) {
      var c = this._items.length,
        e = b ? 0 : this._clones.length;
      return (
        !this.isNumeric(a) || c < 1
          ? (a = d)
          : (a < 0 || a >= c + e) &&
            (a = ((((a - e / 2) % c) + c) % c) + e / 2),
        a
      );
    }),
    (e.prototype.relative = function (a) {
      return (a -= this._clones.length / 2), this.normalize(a, !0);
    }),
    (e.prototype.maximum = function (a) {
      var b,
        c,
        d,
        e = this.settings,
        f = this._coordinates.length;
      if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
      else if (e.autoWidth || e.merge) {
        if ((b = this._items.length))
          for (
            c = this._items[--b].width(), d = this.$element.width();
            b-- && !((c += this._items[b].width() + this.settings.margin) > d);

          );
        f = b + 1;
      } else
        f = e.center ? this._items.length - 1 : this._items.length - e.items;
      return a && (f -= this._clones.length / 2), Math.max(f, 0);
    }),
    (e.prototype.minimum = function (a) {
      return a ? 0 : this._clones.length / 2;
    }),
    (e.prototype.items = function (a) {
      return a === d
        ? this._items.slice()
        : ((a = this.normalize(a, !0)), this._items[a]);
    }),
    (e.prototype.mergers = function (a) {
      return a === d
        ? this._mergers.slice()
        : ((a = this.normalize(a, !0)), this._mergers[a]);
    }),
    (e.prototype.clones = function (b) {
      var c = this._clones.length / 2,
        e = c + this._items.length,
        f = function (a) {
          return a % 2 == 0 ? e + a / 2 : c - (a + 1) / 2;
        };
      return b === d
        ? a.map(this._clones, function (a, b) {
            return f(b);
          })
        : a.map(this._clones, function (a, c) {
            return a === b ? f(c) : null;
          });
    }),
    (e.prototype.speed = function (a) {
      return a !== d && (this._speed = a), this._speed;
    }),
    (e.prototype.coordinates = function (b) {
      var c,
        e = 1,
        f = b - 1;
      return b === d
        ? a.map(
            this._coordinates,
            a.proxy(function (a, b) {
              return this.coordinates(b);
            }, this)
          )
        : (this.settings.center
            ? (this.settings.rtl && ((e = -1), (f = b + 1)),
              (c = this._coordinates[b]),
              (c += ((this.width() - c + (this._coordinates[f] || 0)) / 2) * e))
            : (c = this._coordinates[f] || 0),
          (c = Math.ceil(c)));
    }),
    (e.prototype.duration = function (a, b, c) {
      return 0 === c
        ? 0
        : Math.min(Math.max(Math.abs(b - a), 1), 6) *
            Math.abs(c || this.settings.smartSpeed);
    }),
    (e.prototype.to = function (a, b) {
      var c = this.current(),
        d = null,
        e = a - this.relative(c),
        f = (e > 0) - (e < 0),
        g = this._items.length,
        h = this.minimum(),
        i = this.maximum();
      this.settings.loop
        ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += -1 * f * g),
          (a = c + e),
          (d = ((((a - h) % g) + g) % g) + h) !== a &&
            d - e <= i &&
            d - e > 0 &&
            ((c = d - e), (a = d), this.reset(c)))
        : this.settings.rewind
        ? ((i += 1), (a = ((a % i) + i) % i))
        : (a = Math.max(h, Math.min(i, a))),
        this.speed(this.duration(c, a, b)),
        this.current(a),
        this.isVisible() && this.update();
    }),
    (e.prototype.next = function (a) {
      (a = a || !1), this.to(this.relative(this.current()) + 1, a);
    }),
    (e.prototype.prev = function (a) {
      (a = a || !1), this.to(this.relative(this.current()) - 1, a);
    }),
    (e.prototype.onTransitionEnd = function (a) {
      if (
        a !== d &&
        (a.stopPropagation(),
        (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))
      )
        return !1;
      this.leave("animating"), this.trigger("translated");
    }),
    (e.prototype.viewport = function () {
      var d;
      return (
        this.options.responsiveBaseElement !== b
          ? (d = a(this.options.responsiveBaseElement).width())
          : b.innerWidth
          ? (d = b.innerWidth)
          : c.documentElement && c.documentElement.clientWidth
          ? (d = c.documentElement.clientWidth)
          : console.warn("Can not detect viewport width."),
        d
      );
    }),
    (e.prototype.replace = function (b) {
      this.$stage.empty(),
        (this._items = []),
        b && (b = b instanceof jQuery ? b : a(b)),
        this.settings.nestedItemSelector &&
          (b = b.find("." + this.settings.nestedItemSelector)),
        b
          .filter(function () {
            return 1 === this.nodeType;
          })
          .each(
            a.proxy(function (a, b) {
              (b = this.prepare(b)),
                this.$stage.append(b),
                this._items.push(b),
                this._mergers.push(
                  1 *
                    b
                      .find("[data-merge]")
                      .addBack("[data-merge]")
                      .attr("data-merge") || 1
                );
            }, this)
          ),
        this.reset(
          this.isNumeric(this.settings.startPosition)
            ? this.settings.startPosition
            : 0
        ),
        this.invalidate("items");
    }),
    (e.prototype.add = function (b, c) {
      var e = this.relative(this._current);
      (c = c === d ? this._items.length : this.normalize(c, !0)),
        (b = b instanceof jQuery ? b : a(b)),
        this.trigger("add", { content: b, position: c }),
        (b = this.prepare(b)),
        0 === this._items.length || c === this._items.length
          ? (0 === this._items.length && this.$stage.append(b),
            0 !== this._items.length && this._items[c - 1].after(b),
            this._items.push(b),
            this._mergers.push(
              1 *
                b
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
            ))
          : (this._items[c].before(b),
            this._items.splice(c, 0, b),
            this._mergers.splice(
              c,
              0,
              1 *
                b
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
            )),
        this._items[e] && this.reset(this._items[e].index()),
        this.invalidate("items"),
        this.trigger("added", { content: b, position: c });
    }),
    (e.prototype.remove = function (a) {
      (a = this.normalize(a, !0)) !== d &&
        (this.trigger("remove", { content: this._items[a], position: a }),
        this._items[a].remove(),
        this._items.splice(a, 1),
        this._mergers.splice(a, 1),
        this.invalidate("items"),
        this.trigger("removed", { content: null, position: a }));
    }),
    (e.prototype.preloadAutoWidthImages = function (b) {
      b.each(
        a.proxy(function (b, c) {
          this.enter("pre-loading"),
            (c = a(c)),
            a(new Image())
              .one(
                "load",
                a.proxy(function (a) {
                  c.attr("src", a.target.src),
                    c.css("opacity", 1),
                    this.leave("pre-loading"),
                    !this.is("pre-loading") &&
                      !this.is("initializing") &&
                      this.refresh();
                }, this)
              )
              .attr(
                "src",
                c.attr("src") || c.attr("data-src") || c.attr("data-src-retina")
              );
        }, this)
      );
    }),
    (e.prototype.destroy = function () {
      this.$element.off(".owl.core"),
        this.$stage.off(".owl.core"),
        a(c).off(".owl.core"),
        !1 !== this.settings.responsive &&
          (b.clearTimeout(this.resizeTimer),
          this.off(b, "resize", this._handlers.onThrottledResize));
      for (var d in this._plugins) this._plugins[d].destroy();
      this.$stage.children(".cloned").remove(),
        this.$stage.unwrap(),
        this.$stage.children().contents().unwrap(),
        this.$stage.children().unwrap(),
        this.$stage.remove(),
        this.$element
          .removeClass(this.options.refreshClass)
          .removeClass(this.options.loadingClass)
          .removeClass(this.options.loadedClass)
          .removeClass(this.options.rtlClass)
          .removeClass(this.options.dragClass)
          .removeClass(this.options.grabClass)
          .attr(
            "class",
            this.$element
              .attr("class")
              .replace(
                new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"),
                ""
              )
          )
          .removeData("owl.carousel");
    }),
    (e.prototype.op = function (a, b, c) {
      var d = this.settings.rtl;
      switch (b) {
        case "<":
          return d ? a > c : a < c;
        case ">":
          return d ? a < c : a > c;
        case ">=":
          return d ? a <= c : a >= c;
        case "<=":
          return d ? a >= c : a <= c;
      }
    }),
    (e.prototype.on = function (a, b, c, d) {
      a.addEventListener
        ? a.addEventListener(b, c, d)
        : a.attachEvent && a.attachEvent("on" + b, c);
    }),
    (e.prototype.off = function (a, b, c, d) {
      a.removeEventListener
        ? a.removeEventListener(b, c, d)
        : a.detachEvent && a.detachEvent("on" + b, c);
    }),
    (e.prototype.trigger = function (b, c, d, f, g) {
      var h = { item: { count: this._items.length, index: this.current() } },
        i = a.camelCase(
          a
            .grep(["on", b, d], function (a) {
              return a;
            })
            .join("-")
            .toLowerCase()
        ),
        j = a.Event(
          [b, "owl", d || "carousel"].join(".").toLowerCase(),
          a.extend({ relatedTarget: this }, h, c)
        );
      return (
        this._supress[b] ||
          (a.each(this._plugins, function (a, b) {
            b.onTrigger && b.onTrigger(j);
          }),
          this.register({ type: e.Type.Event, name: b }),
          this.$element.trigger(j),
          this.settings &&
            "function" == typeof this.settings[i] &&
            this.settings[i].call(this, j)),
        j
      );
    }),
    (e.prototype.enter = function (b) {
      a.each(
        [b].concat(this._states.tags[b] || []),
        a.proxy(function (a, b) {
          this._states.current[b] === d && (this._states.current[b] = 0),
            this._states.current[b]++;
        }, this)
      );
    }),
    (e.prototype.leave = function (b) {
      a.each(
        [b].concat(this._states.tags[b] || []),
        a.proxy(function (a, b) {
          this._states.current[b]--;
        }, this)
      );
    }),
    (e.prototype.register = function (b) {
      if (b.type === e.Type.Event) {
        if (
          (a.event.special[b.name] || (a.event.special[b.name] = {}),
          !a.event.special[b.name].owl)
        ) {
          var c = a.event.special[b.name]._default;
          (a.event.special[b.name]._default = function (a) {
            return !c ||
              !c.apply ||
              (a.namespace && -1 !== a.namespace.indexOf("owl"))
              ? a.namespace && a.namespace.indexOf("owl") > -1
              : c.apply(this, arguments);
          }),
            (a.event.special[b.name].owl = !0);
        }
      } else
        b.type === e.Type.State &&
          (this._states.tags[b.name]
            ? (this._states.tags[b.name] = this._states.tags[b.name].concat(
                b.tags
              ))
            : (this._states.tags[b.name] = b.tags),
          (this._states.tags[b.name] = a.grep(
            this._states.tags[b.name],
            a.proxy(function (c, d) {
              return a.inArray(c, this._states.tags[b.name]) === d;
            }, this)
          )));
    }),
    (e.prototype.suppress = function (b) {
      a.each(
        b,
        a.proxy(function (a, b) {
          this._supress[b] = !0;
        }, this)
      );
    }),
    (e.prototype.release = function (b) {
      a.each(
        b,
        a.proxy(function (a, b) {
          delete this._supress[b];
        }, this)
      );
    }),
    (e.prototype.pointer = function (a) {
      var c = { x: null, y: null };
      return (
        (a = a.originalEvent || a || b.event),
        (a =
          a.touches && a.touches.length
            ? a.touches[0]
            : a.changedTouches && a.changedTouches.length
            ? a.changedTouches[0]
            : a),
        a.pageX
          ? ((c.x = a.pageX), (c.y = a.pageY))
          : ((c.x = a.clientX), (c.y = a.clientY)),
        c
      );
    }),
    (e.prototype.isNumeric = function (a) {
      return !isNaN(parseFloat(a));
    }),
    (e.prototype.difference = function (a, b) {
      return { x: a.x - b.x, y: a.y - b.y };
    }),
    (a.fn.owlCarousel = function (b) {
      var c = Array.prototype.slice.call(arguments, 1);
      return this.each(function () {
        var d = a(this),
          f = d.data("owl.carousel");
        f ||
          ((f = new e(this, "object" == typeof b && b)),
          d.data("owl.carousel", f),
          a.each(
            [
              "next",
              "prev",
              "to",
              "destroy",
              "refresh",
              "replace",
              "add",
              "remove",
            ],
            function (b, c) {
              f.register({ type: e.Type.Event, name: c }),
                f.$element.on(
                  c + ".owl.carousel.core",
                  a.proxy(function (a) {
                    a.namespace &&
                      a.relatedTarget !== this &&
                      (this.suppress([c]),
                      f[c].apply(this, [].slice.call(arguments, 1)),
                      this.release([c]));
                  }, f)
                );
            }
          )),
          "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c);
      });
    }),
    (a.fn.owlCarousel.Constructor = e);
})(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._interval = null),
        (this._visible = null),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace && this._core.settings.autoRefresh && this.watch();
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }),
      (e.prototype.watch = function () {
        this._interval ||
          ((this._visible = this._core.isVisible()),
          (this._interval = b.setInterval(
            a.proxy(this.refresh, this),
            this._core.settings.autoRefreshInterval
          )));
      }),
      (e.prototype.refresh = function () {
        this._core.isVisible() !== this._visible &&
          ((this._visible = !this._visible),
          this._core.$element.toggleClass("owl-hidden", !this._visible),
          this._visible &&
            this._core.invalidate("width") &&
            this._core.refresh());
      }),
      (e.prototype.destroy = function () {
        var a, c;
        b.clearInterval(this._interval);
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (c in Object.getOwnPropertyNames(this))
          "function" != typeof this[c] && (this[c] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._loaded = []),
        (this._handlers = {
          "initialized.owl.carousel change.owl.carousel resized.owl.carousel":
            a.proxy(function (b) {
              if (
                b.namespace &&
                this._core.settings &&
                this._core.settings.lazyLoad &&
                ((b.property && "position" == b.property.name) ||
                  "initialized" == b.type)
              ) {
                var c = this._core.settings,
                  e = (c.center && Math.ceil(c.items / 2)) || c.items,
                  f = (c.center && -1 * e) || 0,
                  g =
                    (b.property && b.property.value !== d
                      ? b.property.value
                      : this._core.current()) + f,
                  h = this._core.clones().length,
                  i = a.proxy(function (a, b) {
                    this.load(b);
                  }, this);
                for (
                  c.lazyLoadEager > 0 &&
                  ((e += c.lazyLoadEager),
                  c.loop && ((g -= c.lazyLoadEager), e++));
                  f++ < e;

                )
                  this.load(h / 2 + this._core.relative(g)),
                    h && a.each(this._core.clones(this._core.relative(g)), i),
                    g++;
              }
            }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { lazyLoad: !1, lazyLoadEager: 0 }),
      (e.prototype.load = function (c) {
        var d = this._core.$stage.children().eq(c),
          e = d && d.find(".owl-lazy");
        !e ||
          a.inArray(d.get(0), this._loaded) > -1 ||
          (e.each(
            a.proxy(function (c, d) {
              var e,
                f = a(d),
                g =
                  (b.devicePixelRatio > 1 && f.attr("data-src-retina")) ||
                  f.attr("data-src") ||
                  f.attr("data-srcset");
              this._core.trigger("load", { element: f, url: g }, "lazy"),
                f.is("img")
                  ? f
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          f.css("opacity", 1),
                            this._core.trigger(
                              "loaded",
                              { element: f, url: g },
                              "lazy"
                            );
                        }, this)
                      )
                      .attr("src", g)
                  : f.is("source")
                  ? f
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          this._core.trigger(
                            "loaded",
                            { element: f, url: g },
                            "lazy"
                          );
                        }, this)
                      )
                      .attr("srcset", g)
                  : ((e = new Image()),
                    (e.onload = a.proxy(function () {
                      f.css({
                        "background-image": 'url("' + g + '")',
                        opacity: "1",
                      }),
                        this._core.trigger(
                          "loaded",
                          { element: f, url: g },
                          "lazy"
                        );
                    }, this)),
                    (e.src = g));
            }, this)
          ),
          this._loaded.push(d.get(0)));
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Lazy = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (c) {
      (this._core = c),
        (this._previousHeight = null),
        (this._handlers = {
          "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (
            a
          ) {
            a.namespace && this._core.settings.autoHeight && this.update();
          },
          this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.autoHeight &&
              "position" === a.property.name &&
              this.update();
          }, this),
          "loaded.owl.lazy": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.autoHeight &&
              a.element.closest("." + this._core.settings.itemClass).index() ===
                this._core.current() &&
              this.update();
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        (this._intervalId = null);
      var d = this;
      a(b).on("load", function () {
        d._core.settings.autoHeight && d.update();
      }),
        a(b).resize(function () {
          d._core.settings.autoHeight &&
            (null != d._intervalId && clearTimeout(d._intervalId),
            (d._intervalId = setTimeout(function () {
              d.update();
            }, 250)));
        });
    };
    (e.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }),
      (e.prototype.update = function () {
        var b = this._core._current,
          c = b + this._core.settings.items,
          d = this._core.settings.lazyLoad,
          e = this._core.$stage.children().toArray().slice(b, c),
          f = [],
          g = 0;
        a.each(e, function (b, c) {
          f.push(a(c).height());
        }),
          (g = Math.max.apply(null, f)),
          g <= 1 && d && this._previousHeight && (g = this._previousHeight),
          (this._previousHeight = g),
          this._core.$stage
            .parent()
            .height(g)
            .addClass(this._core.settings.autoHeightClass);
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._videos = {}),
        (this._playing = null),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.register({
                type: "state",
                name: "playing",
                tags: ["interacting"],
              });
          }, this),
          "resize.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.video &&
              this.isInFullScreen() &&
              a.preventDefault();
          }, this),
          "refreshed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.is("resizing") &&
              this._core.$stage.find(".cloned .owl-video-frame").remove();
          }, this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              "position" === a.property.name &&
              this._playing &&
              this.stop();
          }, this),
          "prepared.owl.carousel": a.proxy(function (b) {
            if (b.namespace) {
              var c = a(b.content).find(".owl-video");
              c.length &&
                (c.css("display", "none"), this.fetch(c, a(b.content)));
            }
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        this._core.$element.on(
          "click.owl.video",
          ".owl-video-play-icon",
          a.proxy(function (a) {
            this.play(a);
          }, this)
        );
    };
    (e.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
      (e.prototype.fetch = function (a, b) {
        var c = (function () {
            return a.attr("data-vimeo-id")
              ? "vimeo"
              : a.attr("data-vzaar-id")
              ? "vzaar"
              : "youtube";
          })(),
          d =
            a.attr("data-vimeo-id") ||
            a.attr("data-youtube-id") ||
            a.attr("data-vzaar-id"),
          e = a.attr("data-width") || this._core.settings.videoWidth,
          f = a.attr("data-height") || this._core.settings.videoHeight,
          g = a.attr("href");
        if (!g) throw new Error("Missing video URL.");
        if (
          ((d = g.match(
            /(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
          )),
          d[3].indexOf("youtu") > -1)
        )
          c = "youtube";
        else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
        else {
          if (!(d[3].indexOf("vzaar") > -1))
            throw new Error("Video URL not supported.");
          c = "vzaar";
        }
        (d = d[6]),
          (this._videos[g] = { type: c, id: d, width: e, height: f }),
          b.attr("data-video", g),
          this.thumbnail(a, this._videos[g]);
      }),
      (e.prototype.thumbnail = function (b, c) {
        var d,
          e,
          f,
          g =
            c.width && c.height
              ? "width:" + c.width + "px;height:" + c.height + "px;"
              : "",
          h = b.find("img"),
          i = "src",
          j = "",
          k = this._core.settings,
          l = function (c) {
            (e = '<div class="owl-video-play-icon"></div>'),
              (d = k.lazyLoad
                ? a("<div/>", { class: "owl-video-tn " + j, srcType: c })
                : a("<div/>", {
                    class: "owl-video-tn",
                    style: "opacity:1;background-image:url(" + c + ")",
                  })),
              b.after(d),
              b.after(e);
          };
        if (
          (b.wrap(a("<div/>", { class: "owl-video-wrapper", style: g })),
          this._core.settings.lazyLoad && ((i = "data-src"), (j = "owl-lazy")),
          h.length)
        )
          return l(h.attr(i)), h.remove(), !1;
        "youtube" === c.type
          ? ((f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg"), l(f))
          : "vimeo" === c.type
          ? a.ajax({
              type: "GET",
              url: "//vimeo.com/api/v2/video/" + c.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (a) {
                (f = a[0].thumbnail_large), l(f);
              },
            })
          : "vzaar" === c.type &&
            a.ajax({
              type: "GET",
              url: "//vzaar.com/api/videos/" + c.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (a) {
                (f = a.framegrab_url), l(f);
              },
            });
      }),
      (e.prototype.stop = function () {
        this._core.trigger("stop", null, "video"),
          this._playing.find(".owl-video-frame").remove(),
          this._playing.removeClass("owl-video-playing"),
          (this._playing = null),
          this._core.leave("playing"),
          this._core.trigger("stopped", null, "video");
      }),
      (e.prototype.play = function (b) {
        var c,
          d = a(b.target),
          e = d.closest("." + this._core.settings.itemClass),
          f = this._videos[e.attr("data-video")],
          g = f.width || "100%",
          h = f.height || this._core.$stage.height();
        this._playing ||
          (this._core.enter("playing"),
          this._core.trigger("play", null, "video"),
          (e = this._core.items(this._core.relative(e.index()))),
          this._core.reset(e.index()),
          (c = a(
            '<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'
          )),
          c.attr("height", h),
          c.attr("width", g),
          "youtube" === f.type
            ? c.attr(
                "src",
                "//www.youtube.com/embed/" +
                  f.id +
                  "?autoplay=1&rel=0&v=" +
                  f.id
              )
            : "vimeo" === f.type
            ? c.attr("src", "//player.vimeo.com/video/" + f.id + "?autoplay=1")
            : "vzaar" === f.type &&
              c.attr(
                "src",
                "//view.vzaar.com/" + f.id + "/player?autoplay=true"
              ),
          a(c)
            .wrap('<div class="owl-video-frame" />')
            .insertAfter(e.find(".owl-video")),
          (this._playing = e.addClass("owl-video-playing")));
      }),
      (e.prototype.isInFullScreen = function () {
        var b =
          c.fullscreenElement ||
          c.mozFullScreenElement ||
          c.webkitFullscreenElement;
        return b && a(b).parent().hasClass("owl-video-frame");
      }),
      (e.prototype.destroy = function () {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Video = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this.core = b),
        (this.core.options = a.extend({}, e.Defaults, this.core.options)),
        (this.swapping = !0),
        (this.previous = d),
        (this.next = d),
        (this.handlers = {
          "change.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              "position" == a.property.name &&
              ((this.previous = this.core.current()),
              (this.next = a.property.value));
          }, this),
          "drag.owl.carousel dragged.owl.carousel translated.owl.carousel":
            a.proxy(function (a) {
              a.namespace && (this.swapping = "translated" == a.type);
            }, this),
          "translate.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this.swapping &&
              (this.core.options.animateOut || this.core.options.animateIn) &&
              this.swap();
          }, this),
        }),
        this.core.$element.on(this.handlers);
    };
    (e.Defaults = { animateOut: !1, animateIn: !1 }),
      (e.prototype.swap = function () {
        if (
          1 === this.core.settings.items &&
          a.support.animation &&
          a.support.transition
        ) {
          this.core.speed(0);
          var b,
            c = a.proxy(this.clear, this),
            d = this.core.$stage.children().eq(this.previous),
            e = this.core.$stage.children().eq(this.next),
            f = this.core.settings.animateIn,
            g = this.core.settings.animateOut;
          this.core.current() !== this.previous &&
            (g &&
              ((b =
                this.core.coordinates(this.previous) -
                this.core.coordinates(this.next)),
              d
                .one(a.support.animation.end, c)
                .css({ left: b + "px" })
                .addClass("animated owl-animated-out")
                .addClass(g)),
            f &&
              e
                .one(a.support.animation.end, c)
                .addClass("animated owl-animated-in")
                .addClass(f));
        }
      }),
      (e.prototype.clear = function (b) {
        a(b.target)
          .css({ left: "" })
          .removeClass("animated owl-animated-out owl-animated-in")
          .removeClass(this.core.settings.animateIn)
          .removeClass(this.core.settings.animateOut),
          this.core.onTransitionEnd();
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Animate = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._call = null),
        (this._time = 0),
        (this._timeout = 0),
        (this._paused = !0),
        (this._handlers = {
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace && "settings" === a.property.name
              ? this._core.settings.autoplay
                ? this.play()
                : this.stop()
              : a.namespace &&
                "position" === a.property.name &&
                this._paused &&
                (this._time = 0);
          }, this),
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace && this._core.settings.autoplay && this.play();
          }, this),
          "play.owl.autoplay": a.proxy(function (a, b, c) {
            a.namespace && this.play(b, c);
          }, this),
          "stop.owl.autoplay": a.proxy(function (a) {
            a.namespace && this.stop();
          }, this),
          "mouseover.owl.autoplay": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "mouseleave.owl.autoplay": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.play();
          }, this),
          "touchstart.owl.core": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "touchend.owl.core": a.proxy(function () {
            this._core.settings.autoplayHoverPause && this.play();
          }, this),
        }),
        this._core.$element.on(this._handlers),
        (this._core.options = a.extend({}, e.Defaults, this._core.options));
    };
    (e.Defaults = {
      autoplay: !1,
      autoplayTimeout: 5e3,
      autoplayHoverPause: !1,
      autoplaySpeed: !1,
    }),
      (e.prototype._next = function (d) {
        (this._call = b.setTimeout(
          a.proxy(this._next, this, d),
          this._timeout * (Math.round(this.read() / this._timeout) + 1) -
            this.read()
        )),
          this._core.is("interacting") ||
            c.hidden ||
            this._core.next(d || this._core.settings.autoplaySpeed);
      }),
      (e.prototype.read = function () {
        return new Date().getTime() - this._time;
      }),
      (e.prototype.play = function (c, d) {
        var e;
        this._core.is("rotating") || this._core.enter("rotating"),
          (c = c || this._core.settings.autoplayTimeout),
          (e = Math.min(this._time % (this._timeout || c), c)),
          this._paused
            ? ((this._time = this.read()), (this._paused = !1))
            : b.clearTimeout(this._call),
          (this._time += (this.read() % c) - e),
          (this._timeout = c),
          (this._call = b.setTimeout(a.proxy(this._next, this, d), c - e));
      }),
      (e.prototype.stop = function () {
        this._core.is("rotating") &&
          ((this._time = 0),
          (this._paused = !0),
          b.clearTimeout(this._call),
          this._core.leave("rotating"));
      }),
      (e.prototype.pause = function () {
        this._core.is("rotating") &&
          !this._paused &&
          ((this._time = this.read()),
          (this._paused = !0),
          b.clearTimeout(this._call));
      }),
      (e.prototype.destroy = function () {
        var a, b;
        this.stop();
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.autoplay = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    "use strict";
    var e = function (b) {
      (this._core = b),
        (this._initialized = !1),
        (this._pages = []),
        (this._controls = {}),
        (this._templates = []),
        (this.$element = this._core.$element),
        (this._overrides = {
          next: this._core.next,
          prev: this._core.prev,
          to: this._core.to,
        }),
        (this._handlers = {
          "prepared.owl.carousel": a.proxy(function (b) {
            b.namespace &&
              this._core.settings.dotsData &&
              this._templates.push(
                '<div class="' +
                  this._core.settings.dotClass +
                  '">' +
                  a(b.content)
                    .find("[data-dot]")
                    .addBack("[data-dot]")
                    .attr("data-dot") +
                  "</div>"
              );
          }, this),
          "added.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(a.position, 0, this._templates.pop());
          }, this),
          "remove.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(a.position, 1);
          }, this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace && "position" == a.property.name && this.draw();
          }, this),
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              !this._initialized &&
              (this._core.trigger("initialize", null, "navigation"),
              this.initialize(),
              this.update(),
              this.draw(),
              (this._initialized = !0),
              this._core.trigger("initialized", null, "navigation"));
          }, this),
          "refreshed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._initialized &&
              (this._core.trigger("refresh", null, "navigation"),
              this.update(),
              this.draw(),
              this._core.trigger("refreshed", null, "navigation"));
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers);
    };
    (e.Defaults = {
      nav: !1,
      navText: [
        '<span aria-label="' + "Previous" + '">&#x2039;</span>',
        '<span aria-label="' + "Next" + '">&#x203a;</span>',
      ],
      navSpeed: !1,
      navElement: 'button type="button" role="presentation"',
      navContainer: !1,
      navContainerClass: "owl-nav",
      navClass: ["owl-prev", "owl-next"],
      slideBy: 1,
      dotClass: "owl-dot",
      dotsClass: "owl-dots",
      dots: !0,
      dotsEach: !1,
      dotsData: !1,
      dotsSpeed: !1,
      dotsContainer: !1,
    }),
      (e.prototype.initialize = function () {
        var b,
          c = this._core.settings;
        (this._controls.$relative = (
          c.navContainer
            ? a(c.navContainer)
            : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)
        ).addClass("disabled")),
          (this._controls.$previous = a("<" + c.navElement + ">")
            .addClass(c.navClass[0])
            .html(c.navText[0])
            .prependTo(this._controls.$relative)
            .on(
              "click",
              a.proxy(function (a) {
                this.prev(c.navSpeed);
              }, this)
            )),
          (this._controls.$next = a("<" + c.navElement + ">")
            .addClass(c.navClass[1])
            .html(c.navText[1])
            .appendTo(this._controls.$relative)
            .on(
              "click",
              a.proxy(function (a) {
                this.next(c.navSpeed);
              }, this)
            )),
          c.dotsData ||
            (this._templates = [
              a('<button role="button">')
                .addClass(c.dotClass)
                .append(a("<span>"))
                .prop("outerHTML"),
            ]),
          (this._controls.$absolute = (
            c.dotsContainer
              ? a(c.dotsContainer)
              : a("<div>").addClass(c.dotsClass).appendTo(this.$element)
          ).addClass("disabled")),
          this._controls.$absolute.on(
            "click",
            "button",
            a.proxy(function (b) {
              var d = a(b.target).parent().is(this._controls.$absolute)
                ? a(b.target).index()
                : a(b.target).parent().index();
              b.preventDefault(), this.to(d, c.dotsSpeed);
            }, this)
          );
        for (b in this._overrides) this._core[b] = a.proxy(this[b], this);
      }),
      (e.prototype.destroy = function () {
        var a, b, c, d, e;
        e = this._core.settings;
        for (a in this._handlers) this.$element.off(a, this._handlers[a]);
        for (b in this._controls)
          "$relative" === b && e.navContainer
            ? this._controls[b].html("")
            : this._controls[b].remove();
        for (d in this.overides) this._core[d] = this._overrides[d];
        for (c in Object.getOwnPropertyNames(this))
          "function" != typeof this[c] && (this[c] = null);
      }),
      (e.prototype.update = function () {
        var a,
          b,
          c,
          d = this._core.clones().length / 2,
          e = d + this._core.items().length,
          f = this._core.maximum(!0),
          g = this._core.settings,
          h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
        if (
          ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)),
          g.dots || "page" == g.slideBy)
        )
          for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
            if (b >= h || 0 === b) {
              if (
                (this._pages.push({
                  start: Math.min(f, a - d),
                  end: a - d + h - 1,
                }),
                Math.min(f, a - d) === f)
              )
                break;
              (b = 0), ++c;
            }
            b += this._core.mergers(this._core.relative(a));
          }
      }),
      (e.prototype.draw = function () {
        var b,
          c = this._core.settings,
          d = this._core.items().length <= c.items,
          e = this._core.relative(this._core.current()),
          f = c.loop || c.rewind;
        this._controls.$relative.toggleClass("disabled", !c.nav || d),
          c.nav &&
            (this._controls.$previous.toggleClass(
              "disabled",
              !f && e <= this._core.minimum(!0)
            ),
            this._controls.$next.toggleClass(
              "disabled",
              !f && e >= this._core.maximum(!0)
            )),
          this._controls.$absolute.toggleClass("disabled", !c.dots || d),
          c.dots &&
            ((b =
              this._pages.length - this._controls.$absolute.children().length),
            c.dotsData && 0 !== b
              ? this._controls.$absolute.html(this._templates.join(""))
              : b > 0
              ? this._controls.$absolute.append(
                  new Array(b + 1).join(this._templates[0])
                )
              : b < 0 && this._controls.$absolute.children().slice(b).remove(),
            this._controls.$absolute.find(".active").removeClass("active"),
            this._controls.$absolute
              .children()
              .eq(a.inArray(this.current(), this._pages))
              .addClass("active"));
      }),
      (e.prototype.onTrigger = function (b) {
        var c = this._core.settings;
        b.page = {
          index: a.inArray(this.current(), this._pages),
          count: this._pages.length,
          size:
            c &&
            (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items),
        };
      }),
      (e.prototype.current = function () {
        var b = this._core.relative(this._core.current());
        return a
          .grep(
            this._pages,
            a.proxy(function (a, c) {
              return a.start <= b && a.end >= b;
            }, this)
          )
          .pop();
      }),
      (e.prototype.getPosition = function (b) {
        var c,
          d,
          e = this._core.settings;
        return (
          "page" == e.slideBy
            ? ((c = a.inArray(this.current(), this._pages)),
              (d = this._pages.length),
              b ? ++c : --c,
              (c = this._pages[((c % d) + d) % d].start))
            : ((c = this._core.relative(this._core.current())),
              (d = this._core.items().length),
              b ? (c += e.slideBy) : (c -= e.slideBy)),
          c
        );
      }),
      (e.prototype.next = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b);
      }),
      (e.prototype.prev = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b);
      }),
      (e.prototype.to = function (b, c, d) {
        var e;
        !d && this._pages.length
          ? ((e = this._pages.length),
            a.proxy(this._overrides.to, this._core)(
              this._pages[((b % e) + e) % e].start,
              c
            ))
          : a.proxy(this._overrides.to, this._core)(b, c);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Navigation = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    "use strict";
    var e = function (c) {
      (this._core = c),
        (this._hashes = {}),
        (this.$element = this._core.$element),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (c) {
            c.namespace &&
              "URLHash" === this._core.settings.startPosition &&
              a(b).trigger("hashchange.owl.navigation");
          }, this),
          "prepared.owl.carousel": a.proxy(function (b) {
            if (b.namespace) {
              var c = a(b.content)
                .find("[data-hash]")
                .addBack("[data-hash]")
                .attr("data-hash");
              if (!c) return;
              this._hashes[c] = b.content;
            }
          }, this),
          "changed.owl.carousel": a.proxy(function (c) {
            if (c.namespace && "position" === c.property.name) {
              var d = this._core.items(
                  this._core.relative(this._core.current())
                ),
                e = a
                  .map(this._hashes, function (a, b) {
                    return a === d ? b : null;
                  })
                  .join();
              if (!e || b.location.hash.slice(1) === e) return;
              b.location.hash = e;
            }
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers),
        a(b).on(
          "hashchange.owl.navigation",
          a.proxy(function (a) {
            var c = b.location.hash.substring(1),
              e = this._core.$stage.children(),
              f = this._hashes[c] && e.index(this._hashes[c]);
            f !== d &&
              f !== this._core.current() &&
              this._core.to(this._core.relative(f), !1, !0);
          }, this)
        );
    };
    (e.Defaults = { URLhashListener: !1 }),
      (e.prototype.destroy = function () {
        var c, d;
        a(b).off("hashchange.owl.navigation");
        for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
        for (d in Object.getOwnPropertyNames(this))
          "function" != typeof this[d] && (this[d] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Hash = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    function e(b, c) {
      var e = !1,
        f = b.charAt(0).toUpperCase() + b.slice(1);
      return (
        a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) {
          if (g[b] !== d) return (e = !c || b), !1;
        }),
        e
      );
    }
    function f(a) {
      return e(a, !0);
    }
    var g = a("<support>").get(0).style,
      h = "Webkit Moz O ms".split(" "),
      i = {
        transition: {
          end: {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            transition: "transitionend",
          },
        },
        animation: {
          end: {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "animationend",
            OAnimation: "oAnimationEnd",
            animation: "animationend",
          },
        },
      },
      j = {
        csstransforms: function () {
          return !!e("transform");
        },
        csstransforms3d: function () {
          return !!e("perspective");
        },
        csstransitions: function () {
          return !!e("transition");
        },
        cssanimations: function () {
          return !!e("animation");
        },
      };
    j.csstransitions() &&
      ((a.support.transition = new String(f("transition"))),
      (a.support.transition.end = i.transition.end[a.support.transition])),
      j.cssanimations() &&
        ((a.support.animation = new String(f("animation"))),
        (a.support.animation.end = i.animation.end[a.support.animation])),
      j.csstransforms() &&
        ((a.support.transform = new String(f("transform"))),
        (a.support.transform3d = j.csstransforms3d()));
  })(window.Zepto || window.jQuery, window, document);
/*-----------------------------------------------------------------------------------*/
/*	07. PLYR
/*-----------------------------------------------------------------------------------*/
"object" == typeof navigator &&
  (function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = t())
      : "function" == typeof define && define.amd
      ? define("Plyr", t)
      : (e.Plyr = t());
  })(this, function () {
    "use strict";
    var e = function (e) {
        return null != e ? e.constructor : null;
      },
      t = function (e, t) {
        return Boolean(e && t && e instanceof t);
      },
      i = function (e) {
        return null == e;
      },
      n = function (t) {
        return e(t) === Object;
      },
      a = function (t) {
        return e(t) === String;
      },
      s = function (e) {
        return Array.isArray(e);
      },
      r = function (e) {
        return t(e, NodeList);
      },
      l = function (e) {
        return (
          i(e) ||
          ((a(e) || s(e) || r(e)) && !e.length) ||
          (n(e) && !Object.keys(e).length)
        );
      },
      o = {
        nullOrUndefined: i,
        object: n,
        number: function (t) {
          return e(t) === Number && !Number.isNaN(t);
        },
        string: a,
        boolean: function (t) {
          return e(t) === Boolean;
        },
        function: function (t) {
          return e(t) === Function;
        },
        array: s,
        weakMap: function (e) {
          return t(e, WeakMap);
        },
        nodeList: r,
        element: function (e) {
          return t(e, Element);
        },
        textNode: function (t) {
          return e(t) === Text;
        },
        event: function (e) {
          return t(e, Event);
        },
        cue: function (e) {
          return t(e, window.TextTrackCue) || t(e, window.VTTCue);
        },
        track: function (e) {
          return t(e, TextTrack) || (!i(e) && a(e.kind));
        },
        url: function (e) {
          if (t(e, window.URL)) return !0;
          var i = e;
          (e.startsWith("http://") && e.startsWith("https://")) ||
            (i = "http://" + e);
          try {
            return !l(new URL(i).hostname);
          } catch (e) {
            return !1;
          }
        },
        empty: l,
      },
      c = (function () {
        var e = !1;
        try {
          var t = Object.defineProperty({}, "passive", {
            get: function () {
              return (e = !0), null;
            },
          });
          window.addEventListener("test", null, t),
            window.removeEventListener("test", null, t);
        } catch (e) {}
        return e;
      })();
    function u(e, t, i) {
      var n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
        a = this,
        s = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4],
        r = arguments.length > 5 && void 0 !== arguments[5] && arguments[5];
      if (e && "addEventListener" in e && !o.empty(t) && o.function(i)) {
        var l = t.split(" "),
          u = r;
        c && (u = { passive: s, capture: r }),
          l.forEach(function (t) {
            a &&
              a.eventListeners &&
              n &&
              a.eventListeners.push({
                element: e,
                type: t,
                callback: i,
                options: u,
              }),
              e[n ? "addEventListener" : "removeEventListener"](t, i, u);
          });
      }
    }
    function d(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        i = arguments[2],
        n = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        a = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
      u.call(this, e, t, i, !0, n, a);
    }
    function p(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        i = arguments[2],
        n = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        a = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
      u.call(this, e, t, i, !1, n, a);
    }
    function h(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        i = arguments[2],
        n = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        a = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
      u.call(
        this,
        e,
        t,
        function s() {
          p(e, t, s, n, a);
          for (var r = arguments.length, l = Array(r), o = 0; o < r; o++)
            l[o] = arguments[o];
          i.apply(this, l);
        },
        !0,
        n,
        a
      );
    }
    function m(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
      if (o.element(e) && !o.empty(t)) {
        var a = new CustomEvent(t, {
          bubbles: i,
          detail: Object.assign({}, n, { plyr: this }),
        });
        e.dispatchEvent(a);
      }
    }
    var f = function (e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      },
      g = (function () {
        function e(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            (n.enumerable = n.enumerable || !1),
              (n.configurable = !0),
              "value" in n && (n.writable = !0),
              Object.defineProperty(e, n.key, n);
          }
        }
        return function (t, i, n) {
          return i && e(t.prototype, i), n && e(t, n), t;
        };
      })(),
      y = function (e, t, i) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: i,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = i),
          e
        );
      },
      v = (function () {
        return function (e, t) {
          if (Array.isArray(e)) return e;
          if (Symbol.iterator in Object(e))
            return (function (e, t) {
              var i = [],
                n = !0,
                a = !1,
                s = void 0;
              try {
                for (
                  var r, l = e[Symbol.iterator]();
                  !(n = (r = l.next()).done) &&
                  (i.push(r.value), !t || i.length !== t);
                  n = !0
                );
              } catch (e) {
                (a = !0), (s = e);
              } finally {
                try {
                  !n && l.return && l.return();
                } finally {
                  if (a) throw s;
                }
              }
              return i;
            })(e, t);
          throw new TypeError(
            "Invalid attempt to destructure non-iterable instance"
          );
        };
      })();
    function b(e, t) {
      var i = e.length ? e : [e];
      Array.from(i)
        .reverse()
        .forEach(function (e, i) {
          var n = i > 0 ? t.cloneNode(!0) : t,
            a = e.parentNode,
            s = e.nextSibling;
          n.appendChild(e), s ? a.insertBefore(n, s) : a.appendChild(n);
        });
    }
    function k(e, t) {
      o.element(e) &&
        !o.empty(t) &&
        Object.entries(t)
          .filter(function (e) {
            var t = v(e, 2)[1];
            return !o.nullOrUndefined(t);
          })
          .forEach(function (t) {
            var i = v(t, 2),
              n = i[0],
              a = i[1];
            return e.setAttribute(n, a);
          });
    }
    function w(e, t, i) {
      var n = document.createElement(e);
      return o.object(t) && k(n, t), o.string(i) && (n.innerText = i), n;
    }
    function T(e, t, i, n) {
      t.appendChild(w(e, i, n));
    }
    function A(e) {
      o.nodeList(e) || o.array(e)
        ? Array.from(e).forEach(A)
        : o.element(e) &&
          o.element(e.parentNode) &&
          e.parentNode.removeChild(e);
    }
    function C(e) {
      for (var t = e.childNodes.length; t > 0; )
        e.removeChild(e.lastChild), (t -= 1);
    }
    function E(e, t) {
      return o.element(t) && o.element(t.parentNode) && o.element(e)
        ? (t.parentNode.replaceChild(e, t), e)
        : null;
    }
    function S(e, t) {
      if (!o.string(e) || o.empty(e)) return {};
      var i = {},
        n = t;
      return (
        e.split(",").forEach(function (e) {
          var t = e.trim(),
            a = t.replace(".", ""),
            s = t.replace(/[[\]]/g, "").split("="),
            r = s[0],
            l = s.length > 1 ? s[1].replace(/["']/g, "") : "";
          switch (t.charAt(0)) {
            case ".":
              o.object(n) && o.string(n.class) && (n.class += " " + a),
                (i.class = a);
              break;
            case "#":
              i.id = t.replace("#", "");
              break;
            case "[":
              i[r] = l;
          }
        }),
        i
      );
    }
    function P(e, t) {
      if (o.element(e)) {
        var i = t;
        o.boolean(i) || (i = !e.hasAttribute("hidden")),
          i ? e.setAttribute("hidden", "") : e.removeAttribute("hidden");
      }
    }
    function N(e, t, i) {
      if (o.element(e)) {
        var n = "toggle";
        return (
          void 0 !== i && (n = i ? "add" : "remove"),
          e.classList[n](t),
          e.classList.contains(t)
        );
      }
      return null;
    }
    function L(e, t) {
      return o.element(e) && e.classList.contains(t);
    }
    function M(e, t) {
      var i = { Element: Element };
      return (
        i.matches ||
        i.webkitMatchesSelector ||
        i.mozMatchesSelector ||
        i.msMatchesSelector ||
        function () {
          return Array.from(document.querySelectorAll(t)).includes(this);
        }
      ).call(e, t);
    }
    function x(e) {
      return this.elements.container.querySelectorAll(e);
    }
    function _(e) {
      return this.elements.container.querySelector(e);
    }
    function q() {
      var e = document.activeElement;
      return (e =
        e && e !== document.body ? document.querySelector(":focus") : null);
    }
    var I,
      O,
      j,
      R =
        ((I = document.createElement("span")),
        (O = {
          WebkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "oTransitionEnd otransitionend",
          transition: "transitionend",
        }),
        (j = Object.keys(O).find(function (e) {
          return void 0 !== I.style[e];
        })),
        !!o.string(j) && O[j]);
    var H,
      V = {
        isIE: !!document.documentMode,
        isWebkit:
          "WebkitAppearance" in document.documentElement.style &&
          !/Edge/.test(navigator.userAgent),
        isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
        isIos: /(iPad|iPhone|iPod)/gi.test(navigator.platform),
      },
      B = {
        "audio/ogg": "vorbis",
        "audio/wav": "1",
        "video/webm": "vp8, vorbis",
        "video/mp4": "avc1.42E01E, mp4a.40.2",
        "video/ogg": "theora",
      },
      D = {
        audio: "canPlayType" in document.createElement("audio"),
        video: "canPlayType" in document.createElement("video"),
        check: function (e, t, i) {
          var n = V.isIPhone && i && D.playsinline,
            a = D[e] || "html5" !== t;
          return {
            api: a,
            ui: a && D.rangeInput && ("video" !== e || !V.isIPhone || n),
          };
        },
        pip: !V.isIPhone && o.function(w("video").webkitSetPresentationMode),
        airplay: o.function(window.WebKitPlaybackTargetAvailabilityEvent),
        playsinline: "playsInline" in document.createElement("video"),
        mime: function (e) {
          var t = e.split("/"),
            i = v(t, 1)[0];
          if (!this.isHTML5 || i !== this.type) return !1;
          var n = void 0;
          e && e.includes("codecs=")
            ? (n = e)
            : "audio/mpeg" === e
            ? (n = "audio/mpeg;")
            : e in B && (n = e + '; codecs="' + B[e] + '"');
          try {
            return Boolean(n && this.media.canPlayType(n).replace(/no/, ""));
          } catch (e) {
            return !1;
          }
        },
        textTracks: "textTracks" in document.createElement("video"),
        rangeInput:
          ((H = document.createElement("input")),
          (H.type = "range"),
          "range" === H.type),
        touch: "ontouchstart" in document.documentElement,
        transitions: !1 !== R,
        reducedMotion:
          "matchMedia" in window &&
          window.matchMedia("(prefers-reduced-motion)").matches,
      },
      F = {
        getSources: function () {
          var e = this;
          return this.isHTML5
            ? Array.from(this.media.querySelectorAll("source")).filter(
                function (t) {
                  return D.mime.call(e, t.getAttribute("type"));
                }
              )
            : [];
        },
        getQualityOptions: function () {
          return F.getSources
            .call(this)
            .map(function (e) {
              return Number(e.getAttribute("size"));
            })
            .filter(Boolean);
        },
        extend: function () {
          if (this.isHTML5) {
            var e = this;
            Object.defineProperty(e.media, "quality", {
              get: function () {
                var t = F.getSources.call(e).find(function (t) {
                  return t.getAttribute("src") === e.source;
                });
                return t && Number(t.getAttribute("size"));
              },
              set: function (t) {
                var i = F.getSources.call(e).find(function (e) {
                  return Number(e.getAttribute("size")) === t;
                });
                if (i) {
                  var n = e.media,
                    a = n.currentTime,
                    s = n.paused,
                    r = n.preload,
                    l = n.readyState;
                  (e.media.src = i.getAttribute("src")),
                    ("none" !== r || l) &&
                      (e.once("loadedmetadata", function () {
                        (e.currentTime = a), s || e.play();
                      }),
                      e.media.load()),
                    m.call(e, e.media, "qualitychange", !1, { quality: t });
                }
              },
            });
          }
        },
        cancelRequests: function () {
          this.isHTML5 &&
            (A(F.getSources.call(this)),
            this.media.setAttribute("src", this.config.blankVideo),
            this.media.load(),
            this.debug.log("Cancelled network requests"));
        },
      };
    function U(e, t) {
      return t.split(".").reduce(function (e, t) {
        return e && e[t];
      }, e);
    }
    function z() {
      for (
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = arguments.length,
          i = Array(t > 1 ? t - 1 : 0),
          n = 1;
        n < t;
        n++
      )
        i[n - 1] = arguments[n];
      if (!i.length) return e;
      var a = i.shift();
      return o.object(a)
        ? (Object.keys(a).forEach(function (t) {
            o.object(a[t])
              ? (Object.keys(e).includes(t) || Object.assign(e, y({}, t, {})),
                z(e[t], a[t]))
              : Object.assign(e, y({}, t, a[t]));
          }),
          z.apply(void 0, [e].concat(i)))
        : e;
    }
    function W(e) {
      for (
        var t = arguments.length, i = Array(t > 1 ? t - 1 : 0), n = 1;
        n < t;
        n++
      )
        i[n - 1] = arguments[n];
      return o.empty(e)
        ? e
        : e.toString().replace(/{(\d+)}/g, function (e, t) {
            return i[t].toString();
          });
    }
    function K() {
      var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
      return e.replace(
        new RegExp(
          t.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"),
          "g"
        ),
        i.toString()
      );
    }
    function Y() {
      return (
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ""
      )
        .toString()
        .replace(/\w\S*/g, function (e) {
          return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase();
        });
    }
    function Q() {
      var e = (
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ""
      ).toString();
      return (
        (e = (function () {
          var e = (
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ""
          ).toString();
          return (
            (e = K(e, "-", " ")), (e = K(e, "_", " ")), K((e = Y(e)), " ", "")
          );
        })(e))
          .charAt(0)
          .toLowerCase() + e.slice(1)
      );
    }
    function J(e) {
      var t = document.createElement("div");
      return t.appendChild(e), t.innerHTML;
    }
    var $ = function () {
      var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (o.empty(e) || o.empty(t)) return "";
      var i = U(t.i18n, e);
      if (o.empty(i)) return "";
      var n = { "{seektime}": t.seekTime, "{title}": t.title };
      return (
        Object.entries(n).forEach(function (e) {
          var t = v(e, 2),
            n = t[0],
            a = t[1];
          i = K(i, n, a);
        }),
        i
      );
    };
    function G(e) {
      return o.array(e)
        ? e.filter(function (t, i) {
            return e.indexOf(t) === i;
          })
        : e;
    }
    var X = (function () {
      function e(t) {
        f(this, e),
          (this.enabled = t.config.storage.enabled),
          (this.key = t.config.storage.key);
      }
      return (
        g(
          e,
          [
            {
              key: "get",
              value: function (t) {
                if (!e.supported || !this.enabled) return null;
                var i = window.localStorage.getItem(this.key);
                if (o.empty(i)) return null;
                var n = JSON.parse(i);
                return o.string(t) && t.length ? n[t] : n;
              },
            },
            {
              key: "set",
              value: function (t) {
                if (e.supported && this.enabled && o.object(t)) {
                  var i = this.get();
                  o.empty(i) && (i = {}),
                    z(i, t),
                    window.localStorage.setItem(this.key, JSON.stringify(i));
                }
              },
            },
          ],
          [
            {
              key: "supported",
              get: function () {
                try {
                  if (!("localStorage" in window)) return !1;
                  return (
                    window.localStorage.setItem("___test", "___test"),
                    window.localStorage.removeItem("___test"),
                    !0
                  );
                } catch (e) {
                  return !1;
                }
              },
            },
          ]
        ),
        e
      );
    })();
    function Z(e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "text";
      return new Promise(function (i, n) {
        try {
          var a = new XMLHttpRequest();
          if (!("withCredentials" in a)) return;
          a.addEventListener("load", function () {
            if ("text" === t)
              try {
                i(JSON.parse(a.responseText));
              } catch (e) {
                i(a.responseText);
              }
            else i(a.response);
          }),
            a.addEventListener("error", function () {
              throw new Error(a.status);
            }),
            a.open("GET", e, !0),
            (a.responseType = t),
            a.send();
        } catch (e) {
          n(e);
        }
      });
    }
    function ee(e, t) {
      if (o.string(e)) {
        var i = o.string(t),
          n = function () {
            return null !== document.getElementById(t);
          },
          a = function (e, t) {
            (e.innerHTML = t),
              (i && n()) ||
                document.body.insertAdjacentElement("afterbegin", e);
          };
        if (!i || !n()) {
          var s = X.supported,
            r = document.createElement("div");
          if ((r.setAttribute("hidden", ""), i && r.setAttribute("id", t), s)) {
            var l = window.localStorage.getItem("cache-" + t);
            if (null !== l) {
              var c = JSON.parse(l);
              a(r, c.content);
            }
          }
          Z(e)
            .then(function (e) {
              o.empty(e) ||
                (s &&
                  window.localStorage.setItem(
                    "cache-" + t,
                    JSON.stringify({ content: e })
                  ),
                a(r, e));
            })
            .catch(function () {});
        }
      }
    }
    var te = function (e) {
        return parseInt((e / 60 / 60) % 60, 10);
      },
      ie = function (e) {
        return parseInt((e / 60) % 60, 10);
      },
      ne = function (e) {
        return parseInt(e % 60, 10);
      };
    function ae() {
      var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
        t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      if (!o.number(e)) return ae(null, t, i);
      var n = function (e) {
          return ("0" + e).slice(-2);
        },
        a = te(e),
        s = ie(e),
        r = ne(e);
      return (
        t || a > 0 ? (a += ":") : (a = ""),
        (i && e > 0 ? "-" : "") + a + n(s) + ":" + n(r)
      );
    }
    var se = {
      getIconUrl: function () {
        var e =
          new URL(this.config.iconUrl, window.location).host !==
            window.location.host ||
          (V.isIE && !window.svg4everybody);
        return { url: this.config.iconUrl, cors: e };
      },
      findElements: function () {
        try {
          return (
            (this.elements.controls = _.call(
              this,
              this.config.selectors.controls.wrapper
            )),
            (this.elements.buttons = {
              play: x.call(this, this.config.selectors.buttons.play),
              pause: _.call(this, this.config.selectors.buttons.pause),
              restart: _.call(this, this.config.selectors.buttons.restart),
              rewind: _.call(this, this.config.selectors.buttons.rewind),
              fastForward: _.call(
                this,
                this.config.selectors.buttons.fastForward
              ),
              mute: _.call(this, this.config.selectors.buttons.mute),
              pip: _.call(this, this.config.selectors.buttons.pip),
              airplay: _.call(this, this.config.selectors.buttons.airplay),
              settings: _.call(this, this.config.selectors.buttons.settings),
              captions: _.call(this, this.config.selectors.buttons.captions),
              fullscreen: _.call(
                this,
                this.config.selectors.buttons.fullscreen
              ),
            }),
            (this.elements.progress = _.call(
              this,
              this.config.selectors.progress
            )),
            (this.elements.inputs = {
              seek: _.call(this, this.config.selectors.inputs.seek),
              volume: _.call(this, this.config.selectors.inputs.volume),
            }),
            (this.elements.display = {
              buffer: _.call(this, this.config.selectors.display.buffer),
              currentTime: _.call(
                this,
                this.config.selectors.display.currentTime
              ),
              duration: _.call(this, this.config.selectors.display.duration),
            }),
            o.element(this.elements.progress) &&
              (this.elements.display.seekTooltip =
                this.elements.progress.querySelector(
                  "." + this.config.classNames.tooltip
                )),
            !0
          );
        } catch (e) {
          return (
            this.debug.warn(
              "It looks like there is a problem with your custom controls HTML",
              e
            ),
            this.toggleNativeControls(!0),
            !1
          );
        }
      },
      createIcon: function (e, t) {
        var i = se.getIconUrl.call(this),
          n = (i.cors ? "" : i.url) + "#" + this.config.iconPrefix,
          a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        k(a, z(t, { role: "presentation", focusable: "false" }));
        var s = document.createElementNS("http://www.w3.org/2000/svg", "use"),
          r = n + "-" + e;
        return (
          "href" in s
            ? s.setAttributeNS("http://www.w3.org/1999/xlink", "href", r)
            : s.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", r),
          a.appendChild(s),
          a
        );
      },
      createLabel: function (e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = { pip: "PIP", airplay: "AirPlay" }[e] || $(e, this.config);
        return w(
          "span",
          Object.assign({}, t, {
            class: [t.class, this.config.classNames.hidden]
              .filter(Boolean)
              .join(" "),
          }),
          i
        );
      },
      createBadge: function (e) {
        if (o.empty(e)) return null;
        var t = w("span", { class: this.config.classNames.menu.value });
        return (
          t.appendChild(
            w("span", { class: this.config.classNames.menu.badge }, e)
          ),
          t
        );
      },
      createButton: function (e, t) {
        var i = w("button"),
          n = Object.assign({}, t),
          a = Q(e),
          s = !1,
          r = void 0,
          l = void 0,
          c = void 0,
          u = void 0;
        switch (
          ("type" in n || (n.type = "button"),
          "class" in n
            ? n.class.includes(this.config.classNames.control) ||
              (n.class += " " + this.config.classNames.control)
            : (n.class = this.config.classNames.control),
          e)
        ) {
          case "play":
            (s = !0), (r = "play"), (c = "pause"), (l = "play"), (u = "pause");
            break;
          case "mute":
            (s = !0),
              (r = "mute"),
              (c = "unmute"),
              (l = "volume"),
              (u = "muted");
            break;
          case "captions":
            (s = !0),
              (r = "enableCaptions"),
              (c = "disableCaptions"),
              (l = "captions-off"),
              (u = "captions-on");
            break;
          case "fullscreen":
            (s = !0),
              (r = "enterFullscreen"),
              (c = "exitFullscreen"),
              (l = "enter-fullscreen"),
              (u = "exit-fullscreen");
            break;
          case "play-large":
            (n.class += " " + this.config.classNames.control + "--overlaid"),
              (a = "play"),
              (r = "play"),
              (l = "play");
            break;
          default:
            (r = a), (l = e);
        }
        s
          ? (i.appendChild(
              se.createIcon.call(this, u, { class: "icon--pressed" })
            ),
            i.appendChild(
              se.createIcon.call(this, l, { class: "icon--not-pressed" })
            ),
            i.appendChild(
              se.createLabel.call(this, c, { class: "label--pressed" })
            ),
            i.appendChild(
              se.createLabel.call(this, r, { class: "label--not-pressed" })
            ))
          : (i.appendChild(se.createIcon.call(this, l)),
            i.appendChild(se.createLabel.call(this, r))),
          z(n, S(this.config.selectors.buttons[a], n)),
          k(i, n),
          "play" === a
            ? (o.array(this.elements.buttons[a]) ||
                (this.elements.buttons[a] = []),
              this.elements.buttons[a].push(i))
            : (this.elements.buttons[a] = i);
        var d = this.config.classNames.controlPressed;
        return (
          Object.defineProperty(i, "pressed", {
            enumerable: !0,
            get: function () {
              return L(i, d);
            },
            set: function () {
              var e =
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
              N(i, d, e);
            },
          }),
          i
        );
      },
      createRange: function (e, t) {
        var i = w(
          "input",
          z(
            S(this.config.selectors.inputs[e]),
            {
              type: "range",
              min: 0,
              max: 100,
              step: 0.01,
              value: 0,
              autocomplete: "off",
              role: "slider",
              "aria-label": $(e, this.config),
              "aria-valuemin": 0,
              "aria-valuemax": 100,
              "aria-valuenow": 0,
            },
            t
          )
        );
        return (
          (this.elements.inputs[e] = i), se.updateRangeFill.call(this, i), i
        );
      },
      createProgress: function (e, t) {
        var i = w(
          "progress",
          z(
            S(this.config.selectors.display[e]),
            {
              min: 0,
              max: 100,
              value: 0,
              role: "presentation",
              "aria-hidden": !0,
            },
            t
          )
        );
        if ("volume" !== e) {
          i.appendChild(w("span", null, "0"));
          var n = { played: "played", buffer: "buffered" }[e],
            a = n ? $(n, this.config) : "";
          i.innerText = "% " + a.toLowerCase();
        }
        return (this.elements.display[e] = i), i;
      },
      createTime: function (e) {
        var t = S(this.config.selectors.display[e]),
          i = w(
            "div",
            z(t, {
              class: "plyr__time " + t.class,
              "aria-label": $(e, this.config),
            }),
            "00:00"
          );
        return (this.elements.display[e] = i), i;
      },
      createMenuItem: function (e) {
        var t = e.value,
          i = e.list,
          n = e.type,
          a = e.title,
          s = e.badge,
          r = void 0 === s ? null : s,
          l = e.checked,
          c = void 0 !== l && l,
          u = w("li"),
          d = w("label", { class: this.config.classNames.control }),
          p = w(
            "input",
            z(S(this.config.selectors.inputs[n]), {
              type: "radio",
              name: "plyr-" + n,
              value: t,
              checked: c,
              class: "plyr__sr-only",
            })
          ),
          h = w("span", { hidden: "" });
        d.appendChild(p),
          d.appendChild(h),
          d.insertAdjacentHTML("beforeend", a),
          o.element(r) && d.appendChild(r),
          u.appendChild(d),
          i.appendChild(u);
      },
      formatTime: function () {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
          t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        return o.number(e) ? ae(e, te(this.duration) > 0, t) : e;
      },
      updateTimeDisplay: function () {
        var e =
            arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : null,
          t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
          i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        o.element(e) && o.number(t) && (e.innerText = se.formatTime(t, i));
      },
      updateVolume: function () {
        this.supported.ui &&
          (o.element(this.elements.inputs.volume) &&
            se.setRange.call(
              this,
              this.elements.inputs.volume,
              this.muted ? 0 : this.volume
            ),
          o.element(this.elements.buttons.mute) &&
            (this.elements.buttons.mute.pressed =
              this.muted || 0 === this.volume));
      },
      setRange: function (e) {
        var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        o.element(e) && ((e.value = t), se.updateRangeFill.call(this, e));
      },
      updateProgress: function (e) {
        var t = this;
        if (this.supported.ui && o.event(e)) {
          var i,
            n,
            a = 0;
          if (e)
            switch (e.type) {
              case "timeupdate":
              case "seeking":
              case "seeked":
                (i = this.currentTime),
                  (n = this.duration),
                  (a =
                    0 === i || 0 === n || Number.isNaN(i) || Number.isNaN(n)
                      ? 0
                      : ((i / n) * 100).toFixed(2)),
                  "timeupdate" === e.type &&
                    se.setRange.call(this, this.elements.inputs.seek, a);
                break;
              case "playing":
              case "progress":
                !(function (e, i) {
                  var n = o.number(i) ? i : 0,
                    a = o.element(e) ? e : t.elements.display.buffer;
                  if (o.element(a)) {
                    a.value = n;
                    var s = a.getElementsByTagName("span")[0];
                    o.element(s) && (s.childNodes[0].nodeValue = n);
                  }
                })(this.elements.display.buffer, 100 * this.buffered);
            }
        }
      },
      updateRangeFill: function (e) {
        var t = o.event(e) ? e.target : e;
        if (o.element(t) && "range" === t.getAttribute("type")) {
          if (M(t, this.config.selectors.inputs.seek)) {
            t.setAttribute("aria-valuenow", this.currentTime);
            var i = se.formatTime(this.currentTime),
              n = se.formatTime(this.duration),
              a = $("seekLabel", this.config);
            t.setAttribute(
              "aria-valuetext",
              a.replace("{currentTime}", i).replace("{duration}", n)
            );
          } else if (M(t, this.config.selectors.inputs.volume)) {
            var s = 100 * t.value;
            t.setAttribute("aria-valuenow", s),
              t.setAttribute("aria-valuetext", s + "%");
          } else t.setAttribute("aria-valuenow", t.value);
          V.isWebkit &&
            t.style.setProperty("--value", (t.value / t.max) * 100 + "%");
        }
      },
      updateSeekTooltip: function (e) {
        var t = this;
        if (
          this.config.tooltips.seek &&
          o.element(this.elements.inputs.seek) &&
          o.element(this.elements.display.seekTooltip) &&
          0 !== this.duration
        ) {
          var i = 0,
            n = this.elements.progress.getBoundingClientRect(),
            a = this.config.classNames.tooltip + "--visible",
            s = function (e) {
              N(t.elements.display.seekTooltip, a, e);
            };
          if (this.touch) s(!1);
          else {
            if (o.event(e)) i = (100 / n.width) * (e.pageX - n.left);
            else {
              if (!L(this.elements.display.seekTooltip, a)) return;
              i = parseFloat(this.elements.display.seekTooltip.style.left, 10);
            }
            i < 0 ? (i = 0) : i > 100 && (i = 100),
              se.updateTimeDisplay.call(
                this,
                this.elements.display.seekTooltip,
                (this.duration / 100) * i
              ),
              (this.elements.display.seekTooltip.style.left = i + "%"),
              o.event(e) &&
                ["mouseenter", "mouseleave"].includes(e.type) &&
                s("mouseenter" === e.type);
          }
        }
      },
      timeUpdate: function (e) {
        var t =
          !o.element(this.elements.display.duration) && this.config.invertTime;
        se.updateTimeDisplay.call(
          this,
          this.elements.display.currentTime,
          t ? this.duration - this.currentTime : this.currentTime,
          t
        ),
          (e && "timeupdate" === e.type && this.media.seeking) ||
            se.updateProgress.call(this, e);
      },
      durationUpdate: function () {
        if (
          this.supported.ui &&
          (this.config.invertTime || !this.currentTime)
        ) {
          if (this.duration >= Math.pow(2, 32))
            return (
              P(this.elements.display.currentTime, !0),
              void P(this.elements.progress, !0)
            );
          o.element(this.elements.inputs.seek) &&
            this.elements.inputs.seek.setAttribute(
              "aria-valuemax",
              this.duration
            );
          var e = o.element(this.elements.display.duration);
          !e &&
            this.config.displayDuration &&
            this.paused &&
            se.updateTimeDisplay.call(
              this,
              this.elements.display.currentTime,
              this.duration
            ),
            e &&
              se.updateTimeDisplay.call(
                this,
                this.elements.display.duration,
                this.duration
              ),
            se.updateSeekTooltip.call(this);
        }
      },
      toggleTab: function (e, t) {
        P(this.elements.settings.tabs[e], !t);
      },
      setQualityMenu: function (e) {
        var t = this;
        if (o.element(this.elements.settings.panes.quality)) {
          var i = this.elements.settings.panes.quality.querySelector("ul");
          o.array(e) &&
            (this.options.quality = G(e).filter(function (e) {
              return t.config.quality.options.includes(e);
            }));
          var n =
            !o.empty(this.options.quality) && this.options.quality.length > 1;
          if (
            (se.toggleTab.call(this, "quality", n), se.checkMenu.call(this), n)
          ) {
            C(i);
            this.options.quality
              .sort(function (e, i) {
                var n = t.config.quality.options;
                return n.indexOf(e) > n.indexOf(i) ? 1 : -1;
              })
              .forEach(function (e) {
                se.createMenuItem.call(t, {
                  value: e,
                  list: i,
                  type: "quality",
                  title: se.getLabel.call(t, "quality", e),
                  badge: (function (e) {
                    var i = $("qualityBadge." + e, t.config);
                    return i.length ? se.createBadge.call(t, i) : null;
                  })(e),
                });
              }),
              se.updateSetting.call(this, "quality", i);
          }
        }
      },
      getLabel: function (e, t) {
        switch (e) {
          case "speed":
            return 1 === t ? $("normal", this.config) : t + "&times;";
          case "quality":
            if (o.number(t)) {
              var i = $("qualityLabel." + t, this.config);
              return i.length ? i : t + "p";
            }
            return Y(t);
          case "captions":
            return oe.getLabel.call(this);
          default:
            return null;
        }
      },
      updateSetting: function (e, t, i) {
        var n = this.elements.settings.panes[e],
          a = null,
          s = t;
        if ("captions" === e) a = this.currentTrack;
        else {
          if (
            ((a = o.empty(i) ? this[e] : i),
            o.empty(a) && (a = this.config[e].default),
            !o.empty(this.options[e]) && !this.options[e].includes(a))
          )
            return void this.debug.warn(
              "Unsupported value of '" + a + "' for " + e
            );
          if (!this.config[e].options.includes(a))
            return void this.debug.warn(
              "Disabled value of '" + a + "' for " + e
            );
        }
        if ((o.element(s) || (s = n && n.querySelector("ul")), o.element(s))) {
          this.elements.settings.tabs[e].querySelector(
            "." + this.config.classNames.menu.value
          ).innerHTML = se.getLabel.call(this, e, a);
          var r = s && s.querySelector('input[value="' + a + '"]');
          o.element(r) && (r.checked = !0);
        }
      },
      setCaptionsMenu: function () {
        var e = this,
          t = this.elements.settings.panes.captions.querySelector("ul"),
          i = oe.getTracks.call(this);
        if (
          (se.toggleTab.call(this, "captions", i.length),
          C(t),
          se.checkMenu.call(this),
          i.length)
        ) {
          var n = i.map(function (i, n) {
            return {
              value: n,
              checked: e.captions.toggled && e.currentTrack === n,
              title: oe.getLabel.call(e, i),
              badge:
                i.language && se.createBadge.call(e, i.language.toUpperCase()),
              list: t,
              type: "language",
            };
          });
          n.unshift({
            value: -1,
            checked: !this.captions.toggled,
            title: $("disabled", this.config),
            list: t,
            type: "language",
          }),
            n.forEach(se.createMenuItem.bind(this)),
            se.updateSetting.call(this, "captions", t);
        }
      },
      setSpeedMenu: function (e) {
        var t = this;
        if (
          this.config.controls.includes("settings") &&
          this.config.settings.includes("speed") &&
          o.element(this.elements.settings.panes.speed)
        ) {
          o.array(e)
            ? (this.options.speed = e)
            : (this.isHTML5 || this.isVimeo) &&
              (this.options.speed = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]),
            (this.options.speed = this.options.speed.filter(function (e) {
              return t.config.speed.options.includes(e);
            }));
          var i = !o.empty(this.options.speed) && this.options.speed.length > 1;
          if (
            (se.toggleTab.call(this, "speed", i), se.checkMenu.call(this), i)
          ) {
            var n = this.elements.settings.panes.speed.querySelector("ul");
            C(n),
              this.options.speed.forEach(function (e) {
                se.createMenuItem.call(t, {
                  value: e,
                  list: n,
                  type: "speed",
                  title: se.getLabel.call(t, "speed", e),
                });
              }),
              se.updateSetting.call(this, "speed", n);
          }
        }
      },
      checkMenu: function () {
        var e = this.elements.settings.tabs,
          t =
            !o.empty(e) &&
            Object.values(e).some(function (e) {
              return !e.hidden;
            });
        P(this.elements.settings.menu, !t);
      },
      toggleMenu: function (e) {
        var t = this.elements.settings.form,
          i = this.elements.buttons.settings;
        if (o.element(t) && o.element(i)) {
          var n = o.boolean(e) ? e : o.element(t) && t.hasAttribute("hidden");
          if (o.event(e)) {
            var a = o.element(t) && t.contains(e.target),
              s = e.target === this.elements.buttons.settings;
            if (a || (!a && !s && n)) return;
            s && e.stopPropagation();
          }
          o.element(i) && i.setAttribute("aria-expanded", n),
            o.element(t) &&
              (P(t, !n),
              N(this.elements.container, this.config.classNames.menu.open, n),
              n
                ? t.removeAttribute("tabindex")
                : t.setAttribute("tabindex", -1));
        }
      },
      getTabSize: function (e) {
        var t = e.cloneNode(!0);
        (t.style.position = "absolute"),
          (t.style.opacity = 0),
          t.removeAttribute("hidden"),
          Array.from(t.querySelectorAll("input[name]")).forEach(function (e) {
            var t = e.getAttribute("name");
            e.setAttribute("name", t + "-clone");
          }),
          e.parentNode.appendChild(t);
        var i = t.scrollWidth,
          n = t.scrollHeight;
        return A(t), { width: i, height: n };
      },
      showTab: function () {
        var e = this,
          t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
          i = this.elements.settings.menu,
          n = document.getElementById(t);
        if (o.element(n) && "tabpanel" === n.getAttribute("role")) {
          var a = i.querySelector('[role="tabpanel"]:not([hidden])'),
            s = a.parentNode;
          if (
            (Array.from(
              i.querySelectorAll(
                '[aria-controls="' + a.getAttribute("id") + '"]'
              )
            ).forEach(function (e) {
              e.setAttribute("aria-expanded", !1);
            }),
            D.transitions && !D.reducedMotion)
          ) {
            (s.style.width = a.scrollWidth + "px"),
              (s.style.height = a.scrollHeight + "px");
            var r = se.getTabSize.call(this, n);
            d.call(this, s, R, function t(i) {
              i.target === s &&
                ["width", "height"].includes(i.propertyName) &&
                ((s.style.width = ""),
                (s.style.height = ""),
                p.call(e, s, R, t));
            }),
              (s.style.width = r.width + "px"),
              (s.style.height = r.height + "px");
          }
          P(a, !0), a.setAttribute("tabindex", -1), P(n, !1);
          var l = x.call(this, '[aria-controls="' + t + '"]');
          Array.from(l).forEach(function (e) {
            e.setAttribute("aria-expanded", !0);
          }),
            n.removeAttribute("tabindex"),
            n
              .querySelectorAll(
                "button:not(:disabled), input:not(:disabled), [tabindex]"
              )[0]
              .focus();
        }
      },
      create: function (e) {
        var t = this;
        if (o.empty(this.config.controls)) return null;
        var i = w("div", S(this.config.selectors.controls.wrapper));
        if (
          (this.config.controls.includes("restart") &&
            i.appendChild(se.createButton.call(this, "restart")),
          this.config.controls.includes("rewind") &&
            i.appendChild(se.createButton.call(this, "rewind")),
          this.config.controls.includes("play") &&
            i.appendChild(se.createButton.call(this, "play")),
          this.config.controls.includes("fast-forward") &&
            i.appendChild(se.createButton.call(this, "fast-forward")),
          this.config.controls.includes("progress"))
        ) {
          var n = w("div", S(this.config.selectors.progress));
          if (
            (n.appendChild(
              se.createRange.call(this, "seek", { id: "plyr-seek-" + e.id })
            ),
            n.appendChild(se.createProgress.call(this, "buffer")),
            this.config.tooltips.seek)
          ) {
            var a = w(
              "span",
              { class: this.config.classNames.tooltip },
              "00:00"
            );
            n.appendChild(a), (this.elements.display.seekTooltip = a);
          }
          (this.elements.progress = n), i.appendChild(this.elements.progress);
        }
        if (
          (this.config.controls.includes("current-time") &&
            i.appendChild(se.createTime.call(this, "currentTime")),
          this.config.controls.includes("duration") &&
            i.appendChild(se.createTime.call(this, "duration")),
          this.config.controls.includes("mute") &&
            i.appendChild(se.createButton.call(this, "mute")),
          this.config.controls.includes("volume"))
        ) {
          var s = w("div", { class: "plyr__volume" }),
            r = { max: 1, step: 0.05, value: this.config.volume };
          s.appendChild(
            se.createRange.call(
              this,
              "volume",
              z(r, { id: "plyr-volume-" + e.id })
            )
          ),
            (this.elements.volume = s),
            i.appendChild(s);
        }
        if (
          (this.config.controls.includes("captions") &&
            i.appendChild(se.createButton.call(this, "captions")),
          this.config.controls.includes("settings") &&
            !o.empty(this.config.settings))
        ) {
          var l = w("div", { class: "plyr__menu", hidden: "" });
          l.appendChild(
            se.createButton.call(this, "settings", {
              id: "plyr-settings-toggle-" + e.id,
              "aria-haspopup": !0,
              "aria-controls": "plyr-settings-" + e.id,
              "aria-expanded": !1,
            })
          );
          var c = w("form", {
              class: "plyr__menu__container",
              id: "plyr-settings-" + e.id,
              hidden: "",
              "aria-labelled-by": "plyr-settings-toggle-" + e.id,
              role: "tablist",
              tabindex: -1,
            }),
            u = w("div"),
            d = w("div", {
              id: "plyr-settings-" + e.id + "-home",
              "aria-labelled-by": "plyr-settings-toggle-" + e.id,
              role: "tabpanel",
            }),
            p = w("ul", { role: "tablist" });
          this.config.settings.forEach(function (i) {
            var n = w("li", { role: "tab", hidden: "" }),
              a = w(
                "button",
                z(S(t.config.selectors.buttons.settings), {
                  type: "button",
                  class:
                    t.config.classNames.control +
                    " " +
                    t.config.classNames.control +
                    "--forward",
                  id: "plyr-settings-" + e.id + "-" + i + "-tab",
                  "aria-haspopup": !0,
                  "aria-controls": "plyr-settings-" + e.id + "-" + i,
                  "aria-expanded": !1,
                }),
                $(i, t.config)
              ),
              s = w("span", { class: t.config.classNames.menu.value });
            (s.innerHTML = e[i]),
              a.appendChild(s),
              n.appendChild(a),
              p.appendChild(n),
              (t.elements.settings.tabs[i] = n);
          }),
            d.appendChild(p),
            u.appendChild(d),
            this.config.settings.forEach(function (i) {
              var n = w("div", {
                  id: "plyr-settings-" + e.id + "-" + i,
                  hidden: "",
                  "aria-labelled-by":
                    "plyr-settings-" + e.id + "-" + i + "-tab",
                  role: "tabpanel",
                  tabindex: -1,
                }),
                a = w(
                  "button",
                  {
                    type: "button",
                    class:
                      t.config.classNames.control +
                      " " +
                      t.config.classNames.control +
                      "--back",
                    "aria-haspopup": !0,
                    "aria-controls": "plyr-settings-" + e.id + "-home",
                    "aria-expanded": !1,
                  },
                  $(i, t.config)
                );
              n.appendChild(a);
              var s = w("ul");
              n.appendChild(s),
                u.appendChild(n),
                (t.elements.settings.panes[i] = n);
            }),
            c.appendChild(u),
            l.appendChild(c),
            i.appendChild(l),
            (this.elements.settings.form = c),
            (this.elements.settings.menu = l);
        }
        return (
          this.config.controls.includes("pip") &&
            D.pip &&
            i.appendChild(se.createButton.call(this, "pip")),
          this.config.controls.includes("airplay") &&
            D.airplay &&
            i.appendChild(se.createButton.call(this, "airplay")),
          this.config.controls.includes("fullscreen") &&
            i.appendChild(se.createButton.call(this, "fullscreen")),
          this.config.controls.includes("play-large") &&
            this.elements.container.appendChild(
              se.createButton.call(this, "play-large")
            ),
          (this.elements.controls = i),
          this.isHTML5 &&
            se.setQualityMenu.call(this, F.getQualityOptions.call(this)),
          se.setSpeedMenu.call(this),
          i
        );
      },
      inject: function () {
        var e = this;
        if (this.config.loadSprite) {
          var t = se.getIconUrl.call(this);
          t.cors && ee(t.url, "sprite-plyr");
        }
        this.id = Math.floor(1e4 * Math.random());
        var i = null;
        this.elements.controls = null;
        var n = {
            id: this.id,
            seektime: this.config.seekTime,
            title: this.config.title,
          },
          a = !0;
        o.string(this.config.controls) || o.element(this.config.controls)
          ? (i = this.config.controls)
          : o.function(this.config.controls)
          ? (i = this.config.controls.call(this, n))
          : ((i = se.create.call(this, {
              id: this.id,
              seektime: this.config.seekTime,
              speed: this.speed,
              quality: this.quality,
              captions: oe.getLabel.call(this),
            })),
            (a = !1));
        var s = function (e) {
          var t = e;
          return (
            Object.entries(n).forEach(function (e) {
              var i = v(e, 2),
                n = i[0],
                a = i[1];
              t = K(t, "{" + n + "}", a);
            }),
            t
          );
        };
        a &&
          (o.string(this.config.controls)
            ? (i = s(i))
            : o.element(i) && (i.innerHTML = s(i.innerHTML)));
        var r,
          l = void 0;
        if (
          (o.string(this.config.selectors.controls.container) &&
            (l = document.querySelector(
              this.config.selectors.controls.container
            )),
          o.element(l) || (l = this.elements.container),
          o.element(i)
            ? l.appendChild(i)
            : i && l.insertAdjacentHTML("beforeend", i),
          o.element(this.elements.controls) || se.findElements.call(this),
          window.navigator.userAgent.includes("Edge") &&
            ((r = l),
            setTimeout(function () {
              P(r, !0), r.offsetHeight, P(r, !1);
            }, 0)),
          this.config.tooltips.controls)
        ) {
          var c = this.config,
            u = c.classNames,
            d = c.selectors,
            p = d.controls.wrapper + " " + d.labels + " ." + u.hidden,
            h = x.call(this, p);
          Array.from(h).forEach(function (t) {
            N(t, e.config.classNames.hidden, !1),
              N(t, e.config.classNames.tooltip, !0);
          });
        }
      },
    };
    function re(e) {
      var t = e;
      if (!(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]) {
        var i = document.createElement("a");
        (i.href = t), (t = i.href);
      }
      try {
        return new URL(t);
      } catch (e) {
        return null;
      }
    }
    function le(e) {
      var t = new URLSearchParams();
      return (
        o.object(e) &&
          Object.entries(e).forEach(function (e) {
            var i = v(e, 2),
              n = i[0],
              a = i[1];
            t.set(n, a);
          }),
        t
      );
    }
    var oe = {
        setup: function () {
          if (this.supported.ui)
            if (
              !this.isVideo ||
              this.isYouTube ||
              (this.isHTML5 && !D.textTracks)
            )
              o.array(this.config.controls) &&
                this.config.controls.includes("settings") &&
                this.config.settings.includes("captions") &&
                se.setCaptionsMenu.call(this);
            else {
              var e, t;
              if (
                (o.element(this.elements.captions) ||
                  ((this.elements.captions = w(
                    "div",
                    S(this.config.selectors.captions)
                  )),
                  (e = this.elements.captions),
                  (t = this.elements.wrapper).parentNode.insertBefore(
                    e,
                    t.nextSibling
                  )),
                V.isIE && window.URL)
              ) {
                var i = this.media.querySelectorAll("track");
                Array.from(i).forEach(function (e) {
                  var t = e.getAttribute("src"),
                    i = re(t);
                  null !== i &&
                    i.hostname !== window.location.href.hostname &&
                    ["http:", "https:"].includes(i.protocol) &&
                    Z(t, "blob")
                      .then(function (t) {
                        e.setAttribute("src", window.URL.createObjectURL(t));
                      })
                      .catch(function () {
                        A(e);
                      });
                });
              }
              var n = G(
                  Array.from(
                    navigator.languages ||
                      navigator.language ||
                      navigator.userLanguage
                  ).map(function (e) {
                    return e.split("-")[0];
                  })
                ),
                a = (
                  this.storage.get("language") ||
                  this.config.captions.language ||
                  "auto"
                ).toLowerCase();
              if ("auto" === a) a = v(n, 1)[0];
              var s = this.storage.get("captions");
              if (
                (o.boolean(s) || (s = this.config.captions.active),
                Object.assign(this.captions, {
                  toggled: !1,
                  active: s,
                  language: a,
                  languages: n,
                }),
                this.isHTML5)
              ) {
                var r = this.config.captions.update
                  ? "addtrack removetrack"
                  : "removetrack";
                d.call(this, this.media.textTracks, r, oe.update.bind(this));
              }
              setTimeout(oe.update.bind(this), 0);
            }
        },
        update: function () {
          var e = this,
            t = oe.getTracks.call(this, !0),
            i = this.captions,
            n = i.active,
            a = i.language,
            s = i.meta,
            r = i.currentTrackNode,
            l = Boolean(
              t.find(function (e) {
                return e.language === a;
              })
            );
          this.isHTML5 &&
            this.isVideo &&
            t
              .filter(function (e) {
                return !s.get(e);
              })
              .forEach(function (t) {
                e.debug.log("Track added", t),
                  s.set(t, { default: "showing" === t.mode }),
                  (t.mode = "hidden"),
                  d.call(e, t, "cuechange", function () {
                    return oe.updateCues.call(e);
                  });
              }),
            ((l && this.language !== a) || !t.includes(r)) &&
              (oe.setLanguage.call(this, a), oe.toggle.call(this, n && l)),
            N(
              this.elements.container,
              this.config.classNames.captions.enabled,
              !o.empty(t)
            ),
            (this.config.controls || []).includes("settings") &&
              this.config.settings.includes("captions") &&
              se.setCaptionsMenu.call(this);
        },
        toggle: function (e) {
          var t =
            !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          if (this.supported.ui) {
            var i = this.captions.toggled,
              n = this.config.classNames.captions.active,
              a = o.nullOrUndefined(e) ? !i : e;
            if (a !== i) {
              if (
                (t ||
                  ((this.captions.active = a),
                  this.storage.set({ captions: a })),
                !this.language && a && !t)
              ) {
                var s = oe.getTracks.call(this),
                  r = oe.findTrack.call(
                    this,
                    [this.captions.language].concat(
                      (function (e) {
                        if (Array.isArray(e)) {
                          for (
                            var t = 0, i = Array(e.length);
                            t < e.length;
                            t++
                          )
                            i[t] = e[t];
                          return i;
                        }
                        return Array.from(e);
                      })(this.captions.languages)
                    ),
                    !0
                  );
                return (
                  (this.captions.language = r.language),
                  void oe.set.call(this, s.indexOf(r))
                );
              }
              this.elements.buttons.captions &&
                (this.elements.buttons.captions.pressed = a),
                N(this.elements.container, n, a),
                (this.captions.toggled = a),
                se.updateSetting.call(this, "captions"),
                m.call(
                  this,
                  this.media,
                  a ? "captionsenabled" : "captionsdisabled"
                );
            }
          }
        },
        set: function (e) {
          var t =
              !(arguments.length > 1 && void 0 !== arguments[1]) ||
              arguments[1],
            i = oe.getTracks.call(this);
          if (-1 !== e)
            if (o.number(e))
              if (e in i) {
                if (this.captions.currentTrack !== e) {
                  this.captions.currentTrack = e;
                  var n = i[e],
                    a = (n || {}).language;
                  (this.captions.currentTrackNode = n),
                    se.updateSetting.call(this, "captions"),
                    t ||
                      ((this.captions.language = a),
                      this.storage.set({ language: a })),
                    this.isVimeo && this.embed.enableTextTrack(a),
                    m.call(this, this.media, "languagechange");
                }
                oe.toggle.call(this, !0, t),
                  this.isHTML5 && this.isVideo && oe.updateCues.call(this);
              } else this.debug.warn("Track not found", e);
            else this.debug.warn("Invalid caption argument", e);
          else oe.toggle.call(this, !1, t);
        },
        setLanguage: function (e) {
          var t =
            !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          if (o.string(e)) {
            var i = e.toLowerCase();
            this.captions.language = i;
            var n = oe.getTracks.call(this),
              a = oe.findTrack.call(this, [i]);
            oe.set.call(this, n.indexOf(a), t);
          } else this.debug.warn("Invalid language argument", e);
        },
        getTracks: function () {
          var e = this,
            t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          return Array.from((this.media || {}).textTracks || [])
            .filter(function (i) {
              return !e.isHTML5 || t || e.captions.meta.has(i);
            })
            .filter(function (e) {
              return ["captions", "subtitles"].includes(e.kind);
            });
        },
        findTrack: function (e) {
          var t = this,
            i = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            n = oe.getTracks.call(this),
            a = function (e) {
              return Number((t.captions.meta.get(e) || {}).default);
            },
            s = Array.from(n).sort(function (e, t) {
              return a(t) - a(e);
            }),
            r = void 0;
          return (
            e.every(function (e) {
              return !(r = s.find(function (t) {
                return t.language === e;
              }));
            }),
            r || (i ? s[0] : void 0)
          );
        },
        getCurrentTrack: function () {
          return oe.getTracks.call(this)[this.currentTrack];
        },
        getLabel: function (e) {
          var t = e;
          return (
            !o.track(t) &&
              D.textTracks &&
              this.captions.toggled &&
              (t = oe.getCurrentTrack.call(this)),
            o.track(t)
              ? o.empty(t.label)
                ? o.empty(t.language)
                  ? $("enabled", this.config)
                  : e.language.toUpperCase()
                : t.label
              : $("disabled", this.config)
          );
        },
        updateCues: function (e) {
          if (this.supported.ui)
            if (o.element(this.elements.captions))
              if (o.nullOrUndefined(e) || Array.isArray(e)) {
                var t = e;
                if (!t) {
                  var i = oe.getCurrentTrack.call(this);
                  t = Array.from((i || {}).activeCues || [])
                    .map(function (e) {
                      return e.getCueAsHTML();
                    })
                    .map(J);
                }
                var n = t
                  .map(function (e) {
                    return e.trim();
                  })
                  .join("\n");
                if (n !== this.elements.captions.innerHTML) {
                  C(this.elements.captions);
                  var a = w("span", S(this.config.selectors.caption));
                  (a.innerHTML = n),
                    this.elements.captions.appendChild(a),
                    m.call(this, this.media, "cuechange");
                }
              } else this.debug.warn("updateCues: Invalid input", e);
            else this.debug.warn("No captions element to render to");
        },
      },
      ce = {
        enabled: !0,
        title: "",
        debug: !1,
        autoplay: !1,
        autopause: !0,
        playsinline: !0,
        seekTime: 10,
        volume: 1,
        muted: !1,
        duration: null,
        displayDuration: !0,
        invertTime: !0,
        toggleInvert: !0,
        ratio: "16:9",
        clickToPlay: !0,
        hideControls: !0,
        resetOnEnd: !1,
        disableContextMenu: !0,
        loadSprite: !0,
        iconPrefix: "plyr",
        iconUrl: "https://cdn.plyr.io/3.3.12/plyr.svg",
        blankVideo: "https://cdn.plyr.io/static/blank.mp4",
        quality: {
          default: 576,
          options: [
            4320,
            2880,
            2160,
            1440,
            1080,
            720,
            576,
            480,
            360,
            240,
            "default",
          ],
        },
        loop: { active: !1 },
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
        keyboard: { focused: !0, global: !1 },
        tooltips: { controls: !1, seek: !0 },
        captions: { active: !1, language: "auto", update: !1 },
        fullscreen: { enabled: !0, fallback: !0, iosNative: !1 },
        storage: { enabled: !0, key: "plyr" },
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ],
        settings: ["captions", "quality", "speed"],
        i18n: {
          restart: "Restart",
          rewind: "Rewind {seektime}s",
          play: "Play",
          pause: "Pause",
          fastForward: "Forward {seektime}s",
          seek: "Seek",
          seekLabel: "{currentTime} of {duration}",
          played: "Played",
          buffered: "Buffered",
          currentTime: "Current time",
          duration: "Duration",
          volume: "Volume",
          mute: "Mute",
          unmute: "Unmute",
          enableCaptions: "Enable captions",
          disableCaptions: "Disable captions",
          enterFullscreen: "Enter fullscreen",
          exitFullscreen: "Exit fullscreen",
          frameTitle: "Player for {title}",
          captions: "Captions",
          settings: "Settings",
          menuBack: "Go back to previous menu",
          speed: "Speed",
          normal: "Normal",
          quality: "Quality",
          loop: "Loop",
          start: "Start",
          end: "End",
          all: "All",
          reset: "Reset",
          disabled: "Disabled",
          enabled: "Enabled",
          advertisement: "Ad",
          qualityBadge: {
            2160: "4K",
            1440: "HD",
            1080: "HD",
            720: "HD",
            576: "SD",
            480: "SD",
          },
        },
        urls: {
          vimeo: {
            sdk: "https://player.vimeo.com/api/player.js",
            iframe: "https://player.vimeo.com/video/{0}?{1}",
            api: "https://vimeo.com/api/v2/video/{0}.json",
          },
          youtube: {
            sdk: "https://www.youtube.com/iframe_api",
            api: "https://www.googleapis.com/youtube/v3/videos?id={0}&key={1}&fields=items(snippet(title))&part=snippet",
          },
          googleIMA: {
            sdk: "https://imasdk.googleapis.com/js/sdkloader/ima3.js",
          },
        },
        listeners: {
          seek: null,
          play: null,
          pause: null,
          restart: null,
          rewind: null,
          fastForward: null,
          mute: null,
          volume: null,
          captions: null,
          fullscreen: null,
          pip: null,
          airplay: null,
          speed: null,
          quality: null,
          loop: null,
          language: null,
        },
        events: [
          "ended",
          "progress",
          "stalled",
          "playing",
          "waiting",
          "canplay",
          "canplaythrough",
          "loadstart",
          "loadeddata",
          "loadedmetadata",
          "timeupdate",
          "volumechange",
          "play",
          "pause",
          "error",
          "seeking",
          "seeked",
          "emptied",
          "ratechange",
          "cuechange",
          "enterfullscreen",
          "exitfullscreen",
          "captionsenabled",
          "captionsdisabled",
          "languagechange",
          "controlshidden",
          "controlsshown",
          "ready",
          "statechange",
          "qualitychange",
          "qualityrequested",
          "adsloaded",
          "adscontentpause",
          "adscontentresume",
          "adstarted",
          "adsmidpoint",
          "adscomplete",
          "adsallcomplete",
          "adsimpression",
          "adsclick",
        ],
        selectors: {
          editable: "input, textarea, select, [contenteditable]",
          container: ".plyr",
          controls: { container: null, wrapper: ".plyr__controls" },
          labels: "[data-plyr]",
          buttons: {
            play: '[data-plyr="play"]',
            pause: '[data-plyr="pause"]',
            restart: '[data-plyr="restart"]',
            rewind: '[data-plyr="rewind"]',
            fastForward: '[data-plyr="fast-forward"]',
            mute: '[data-plyr="mute"]',
            captions: '[data-plyr="captions"]',
            fullscreen: '[data-plyr="fullscreen"]',
            pip: '[data-plyr="pip"]',
            airplay: '[data-plyr="airplay"]',
            settings: '[data-plyr="settings"]',
            loop: '[data-plyr="loop"]',
          },
          inputs: {
            seek: '[data-plyr="seek"]',
            volume: '[data-plyr="volume"]',
            speed: '[data-plyr="speed"]',
            language: '[data-plyr="language"]',
            quality: '[data-plyr="quality"]',
          },
          display: {
            currentTime: ".plyr__time--current",
            duration: ".plyr__time--duration",
            buffer: ".plyr__progress__buffer",
            loop: ".plyr__progress__loop",
            volume: ".plyr__volume--display",
          },
          progress: ".plyr__progress",
          captions: ".plyr__captions",
          caption: ".plyr__caption",
          menu: { quality: ".js-plyr__menu__list--quality" },
        },
        classNames: {
          type: "plyr--{0}",
          provider: "plyr--{0}",
          video: "plyr__video-wrapper",
          embed: "plyr__video-embed",
          embedContainer: "plyr__video-embed__container",
          poster: "plyr__poster",
          posterEnabled: "plyr__poster-enabled",
          ads: "plyr__ads",
          control: "plyr__control",
          controlPressed: "plyr__control--pressed",
          playing: "plyr--playing",
          paused: "plyr--paused",
          stopped: "plyr--stopped",
          loading: "plyr--loading",
          hover: "plyr--hover",
          tooltip: "plyr__tooltip",
          cues: "plyr__cues",
          hidden: "plyr__sr-only",
          hideControls: "plyr--hide-controls",
          isIos: "plyr--is-ios",
          isTouch: "plyr--is-touch",
          uiSupported: "plyr--full-ui",
          noTransition: "plyr--no-transition",
          menu: {
            value: "plyr__menu__value",
            badge: "plyr__badge",
            open: "plyr--menu-open",
          },
          captions: {
            enabled: "plyr--captions-enabled",
            active: "plyr--captions-active",
          },
          fullscreen: {
            enabled: "plyr--fullscreen-enabled",
            fallback: "plyr--fullscreen-fallback",
          },
          pip: { supported: "plyr--pip-supported", active: "plyr--pip-active" },
          airplay: {
            supported: "plyr--airplay-supported",
            active: "plyr--airplay-active",
          },
          tabFocus: "plyr__tab-focus",
        },
        attributes: {
          embed: { provider: "data-plyr-provider", id: "data-plyr-embed-id" },
        },
        keys: { google: null },
        ads: { enabled: !1, publisherId: "" },
      },
      ue = { html5: "html5", youtube: "youtube", vimeo: "vimeo" },
      de = { audio: "audio", video: "video" };
    var pe = function () {},
      he = (function () {
        function e() {
          var t =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          f(this, e),
            (this.enabled = window.console && t),
            this.enabled && this.log("Debugging enabled");
        }
        return (
          g(e, [
            {
              key: "log",
              get: function () {
                return this.enabled
                  ? Function.prototype.bind.call(console.log, console)
                  : pe;
              },
            },
            {
              key: "warn",
              get: function () {
                return this.enabled
                  ? Function.prototype.bind.call(console.warn, console)
                  : pe;
              },
            },
            {
              key: "error",
              get: function () {
                return this.enabled
                  ? Function.prototype.bind.call(console.error, console)
                  : pe;
              },
            },
          ]),
          e
        );
      })();
    function me() {
      if (this.enabled) {
        var e = this.player.elements.buttons.fullscreen;
        o.element(e) && (e.pressed = this.active),
          m.call(
            this.player,
            this.target,
            this.active ? "enterfullscreen" : "exitfullscreen",
            !0
          ),
          V.isIos ||
            function () {
              var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : null,
                t =
                  arguments.length > 1 &&
                  void 0 !== arguments[1] &&
                  arguments[1];
              if (o.element(e)) {
                var i = x.call(
                    this,
                    "button:not(:disabled), input:not(:disabled), [tabindex]"
                  ),
                  n = i[0],
                  a = i[i.length - 1];
                u.call(
                  this,
                  this.elements.container,
                  "keydown",
                  function (e) {
                    if ("Tab" === e.key && 9 === e.keyCode) {
                      var t = q();
                      t !== a || e.shiftKey
                        ? t === n &&
                          e.shiftKey &&
                          (a.focus(), e.preventDefault())
                        : (n.focus(), e.preventDefault());
                    }
                  },
                  t,
                  !1
                );
              }
            }.call(this.player, this.target, this.active);
      }
    }
    function fe() {
      var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      e
        ? (this.scrollPosition = {
            x: window.scrollX || 0,
            y: window.scrollY || 0,
          })
        : window.scrollTo(this.scrollPosition.x, this.scrollPosition.y),
        (document.body.style.overflow = e ? "hidden" : ""),
        N(this.target, this.player.config.classNames.fullscreen.fallback, e),
        me.call(this);
    }
    var ge = (function () {
      function e(t) {
        var i = this;
        f(this, e),
          (this.player = t),
          (this.prefix = e.prefix),
          (this.property = e.property),
          (this.scrollPosition = { x: 0, y: 0 }),
          d.call(
            this.player,
            document,
            "ms" === this.prefix
              ? "MSFullscreenChange"
              : this.prefix + "fullscreenchange",
            function () {
              me.call(i);
            }
          ),
          d.call(
            this.player,
            this.player.elements.container,
            "dblclick",
            function (e) {
              (o.element(i.player.elements.controls) &&
                i.player.elements.controls.contains(e.target)) ||
                i.toggle();
            }
          ),
          this.update();
      }
      return (
        g(
          e,
          [
            {
              key: "update",
              value: function () {
                this.enabled
                  ? this.player.debug.log(
                      (e.native ? "Native" : "Fallback") + " fullscreen enabled"
                    )
                  : this.player.debug.log(
                      "Fullscreen not supported and fallback disabled"
                    ),
                  N(
                    this.player.elements.container,
                    this.player.config.classNames.fullscreen.enabled,
                    this.enabled
                  );
              },
            },
            {
              key: "enter",
              value: function () {
                this.enabled &&
                  (V.isIos && this.player.config.fullscreen.iosNative
                    ? this.player.playing && this.target.webkitEnterFullscreen()
                    : e.native
                    ? this.prefix
                      ? o.empty(this.prefix) ||
                        this.target[this.prefix + "Request" + this.property]()
                      : this.target.requestFullscreen()
                    : fe.call(this, !0));
              },
            },
            {
              key: "exit",
              value: function () {
                if (this.enabled)
                  if (V.isIos && this.player.config.fullscreen.iosNative)
                    this.target.webkitExitFullscreen(), this.player.play();
                  else if (e.native)
                    if (this.prefix) {
                      if (!o.empty(this.prefix)) {
                        var t = "moz" === this.prefix ? "Cancel" : "Exit";
                        document["" + this.prefix + t + this.property]();
                      }
                    } else
                      (
                        document.cancelFullScreen || document.exitFullscreen
                      ).call(document);
                  else fe.call(this, !1);
              },
            },
            {
              key: "toggle",
              value: function () {
                this.active ? this.exit() : this.enter();
              },
            },
            {
              key: "enabled",
              get: function () {
                return (
                  (e.native || this.player.config.fullscreen.fallback) &&
                  this.player.config.fullscreen.enabled &&
                  this.player.supported.ui &&
                  this.player.isVideo
                );
              },
            },
            {
              key: "active",
              get: function () {
                return (
                  !!this.enabled &&
                  (e.native
                    ? (this.prefix
                        ? document["" + this.prefix + this.property + "Element"]
                        : document.fullscreenElement) === this.target
                    : L(
                        this.target,
                        this.player.config.classNames.fullscreen.fallback
                      ))
                );
              },
            },
            {
              key: "target",
              get: function () {
                return V.isIos && this.player.config.fullscreen.iosNative
                  ? this.player.media
                  : this.player.elements.container;
              },
            },
          ],
          [
            {
              key: "native",
              get: function () {
                return !!(
                  document.fullscreenEnabled ||
                  document.webkitFullscreenEnabled ||
                  document.mozFullScreenEnabled ||
                  document.msFullscreenEnabled
                );
              },
            },
            {
              key: "prefix",
              get: function () {
                if (o.function(document.fullscreenElement)) return "";
                var e = "";
                return (
                  ["webkit", "moz", "ms"].some(function (t) {
                    return (
                      !(
                        !o.function(document[t + "ExitFullscreen"]) &&
                        !o.function(document[t + "CancelFullScreen"])
                      ) && ((e = t), !0)
                    );
                  }),
                  e
                );
              },
            },
            {
              key: "property",
              get: function () {
                return "moz" === this.prefix ? "FullScreen" : "Fullscreen";
              },
            },
          ]
        ),
        e
      );
    })();
    function ye(e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
      return new Promise(function (i, n) {
        var a = new Image(),
          s = function () {
            delete a.onload, delete a.onerror, (a.naturalWidth >= t ? i : n)(a);
          };
        Object.assign(a, { onload: s, onerror: s, src: e });
      });
    }
    var ve = {
        addStyleHook: function () {
          N(
            this.elements.container,
            this.config.selectors.container.replace(".", ""),
            !0
          ),
            N(
              this.elements.container,
              this.config.classNames.uiSupported,
              this.supported.ui
            );
        },
        toggleNativeControls: function () {
          arguments.length > 0 &&
          void 0 !== arguments[0] &&
          arguments[0] &&
          this.isHTML5
            ? this.media.setAttribute("controls", "")
            : this.media.removeAttribute("controls");
        },
        build: function () {
          var e = this;
          if ((this.listeners.media(), !this.supported.ui))
            return (
              this.debug.warn(
                "Basic support only for " + this.provider + " " + this.type
              ),
              void ve.toggleNativeControls.call(this, !0)
            );
          o.element(this.elements.controls) ||
            (se.inject.call(this), this.listeners.controls()),
            ve.toggleNativeControls.call(this),
            this.isHTML5 && oe.setup.call(this),
            (this.volume = null),
            (this.muted = null),
            (this.speed = null),
            (this.loop = null),
            (this.quality = null),
            se.updateVolume.call(this),
            se.timeUpdate.call(this),
            ve.checkPlaying.call(this),
            N(
              this.elements.container,
              this.config.classNames.pip.supported,
              D.pip && this.isHTML5 && this.isVideo
            ),
            N(
              this.elements.container,
              this.config.classNames.airplay.supported,
              D.airplay && this.isHTML5
            ),
            N(this.elements.container, this.config.classNames.isIos, V.isIos),
            N(
              this.elements.container,
              this.config.classNames.isTouch,
              this.touch
            ),
            (this.ready = !0),
            setTimeout(function () {
              m.call(e, e.media, "ready");
            }, 0),
            ve.setTitle.call(this),
            this.poster &&
              ve.setPoster.call(this, this.poster, !1).catch(function () {}),
            this.config.duration && se.durationUpdate.call(this);
        },
        setTitle: function () {
          var e = $("play", this.config);
          if (
            (o.string(this.config.title) &&
              !o.empty(this.config.title) &&
              (e += ", " + this.config.title),
            Array.from(this.elements.buttons.play || []).forEach(function (t) {
              t.setAttribute("aria-label", e);
            }),
            this.isEmbed)
          ) {
            var t = _.call(this, "iframe");
            if (!o.element(t)) return;
            var i = o.empty(this.config.title) ? "video" : this.config.title,
              n = $("frameTitle", this.config);
            t.setAttribute("title", n.replace("{title}", i));
          }
        },
        togglePoster: function (e) {
          N(this.elements.container, this.config.classNames.posterEnabled, e);
        },
        setPoster: function (e) {
          var t = this;
          return (arguments.length > 1 &&
            void 0 !== arguments[1] &&
            !arguments[1]) ||
            !this.poster
            ? (this.media.setAttribute("poster", e),
              function () {
                var e = this;
                return new Promise(function (t) {
                  return e.ready
                    ? setTimeout(t, 0)
                    : d.call(e, e.elements.container, "ready", t);
                }).then(function () {});
              }
                .call(this)
                .then(function () {
                  return ye(e);
                })
                .catch(function (i) {
                  throw (e === t.poster && ve.togglePoster.call(t, !1), i);
                })
                .then(function () {
                  if (e !== t.poster)
                    throw new Error(
                      "setPoster cancelled by later call to setPoster"
                    );
                })
                .then(function () {
                  return (
                    Object.assign(t.elements.poster.style, {
                      backgroundImage: "url('" + e + "')",
                      backgroundSize: "",
                    }),
                    ve.togglePoster.call(t, !0),
                    e
                  );
                }))
            : Promise.reject(new Error("Poster already set"));
        },
        checkPlaying: function (e) {
          var t = this;
          N(
            this.elements.container,
            this.config.classNames.playing,
            this.playing
          ),
            N(
              this.elements.container,
              this.config.classNames.paused,
              this.paused
            ),
            N(
              this.elements.container,
              this.config.classNames.stopped,
              this.stopped
            ),
            Array.from(this.elements.buttons.play || []).forEach(function (e) {
              e.pressed = t.playing;
            }),
            (o.event(e) && "timeupdate" === e.type) ||
              ve.toggleControls.call(this);
        },
        checkLoading: function (e) {
          var t = this;
          (this.loading = ["stalled", "waiting"].includes(e.type)),
            clearTimeout(this.timers.loading),
            (this.timers.loading = setTimeout(
              function () {
                N(t.elements.container, t.config.classNames.loading, t.loading),
                  ve.toggleControls.call(t);
              },
              this.loading ? 250 : 0
            ));
        },
        toggleControls: function (e) {
          var t = this.elements.controls;
          t &&
            this.config.hideControls &&
            this.toggleControls(
              Boolean(e || this.loading || this.paused || t.pressed || t.hover)
            );
        },
      },
      be = (function () {
        function e(t) {
          f(this, e),
            (this.player = t),
            (this.lastKey = null),
            (this.handleKey = this.handleKey.bind(this)),
            (this.toggleMenu = this.toggleMenu.bind(this)),
            (this.firstTouch = this.firstTouch.bind(this));
        }
        return (
          g(e, [
            {
              key: "handleKey",
              value: function (e) {
                var t = this,
                  i = e.keyCode ? e.keyCode : e.which,
                  n = "keydown" === e.type,
                  a = n && i === this.lastKey;
                if (
                  !(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) &&
                  o.number(i)
                ) {
                  if (n) {
                    var s = q();
                    if (
                      o.element(s) &&
                      s !== this.player.elements.inputs.seek &&
                      M(s, this.player.config.selectors.editable)
                    )
                      return;
                    switch (
                      ([
                        32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 56, 57,
                        67, 70, 73, 75, 76, 77, 79,
                      ].includes(i) &&
                        (e.preventDefault(), e.stopPropagation()),
                      i)
                    ) {
                      case 48:
                      case 49:
                      case 50:
                      case 51:
                      case 52:
                      case 53:
                      case 54:
                      case 55:
                      case 56:
                      case 57:
                        a ||
                          (t.player.currentTime =
                            (t.player.duration / 10) * (i - 48));
                        break;
                      case 32:
                      case 75:
                        a || this.player.togglePlay();
                        break;
                      case 38:
                        this.player.increaseVolume(0.1);
                        break;
                      case 40:
                        this.player.decreaseVolume(0.1);
                        break;
                      case 77:
                        a || (this.player.muted = !this.player.muted);
                        break;
                      case 39:
                        this.player.forward();
                        break;
                      case 37:
                        this.player.rewind();
                        break;
                      case 70:
                        this.player.fullscreen.toggle();
                        break;
                      case 67:
                        a || this.player.toggleCaptions();
                        break;
                      case 76:
                        this.player.loop = !this.player.loop;
                    }
                    !this.player.fullscreen.enabled &&
                      this.player.fullscreen.active &&
                      27 === i &&
                      this.player.fullscreen.toggle(),
                      (this.lastKey = i);
                  } else this.lastKey = null;
                }
              },
            },
            {
              key: "toggleMenu",
              value: function (e) {
                se.toggleMenu.call(this.player, e);
              },
            },
            {
              key: "firstTouch",
              value: function () {
                (this.player.touch = !0),
                  N(
                    this.player.elements.container,
                    this.player.config.classNames.isTouch,
                    !0
                  );
              },
            },
            {
              key: "global",
              value: function () {
                var e =
                  !(arguments.length > 0 && void 0 !== arguments[0]) ||
                  arguments[0];
                this.player.config.keyboard.global &&
                  u.call(
                    this.player,
                    window,
                    "keydown keyup",
                    this.handleKey,
                    e,
                    !1
                  ),
                  u.call(
                    this.player,
                    document.body,
                    "click",
                    this.toggleMenu,
                    e
                  ),
                  h.call(
                    this.player,
                    document.body,
                    "touchstart",
                    this.firstTouch
                  );
              },
            },
            {
              key: "container",
              value: function () {
                var e = this;
                !this.player.config.keyboard.global &&
                  this.player.config.keyboard.focused &&
                  d.call(
                    this.player,
                    this.player.elements.container,
                    "keydown keyup",
                    this.handleKey,
                    !1
                  ),
                  d.call(
                    this.player,
                    this.player.elements.container,
                    "focusout",
                    function (t) {
                      N(t.target, e.player.config.classNames.tabFocus, !1);
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.elements.container,
                    "keydown",
                    function (t) {
                      9 === t.keyCode &&
                        setTimeout(function () {
                          N(q(), e.player.config.classNames.tabFocus, !0);
                        }, 0);
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.elements.container,
                    "mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen",
                    function (t) {
                      var i = e.player.elements.controls;
                      "enterfullscreen" === t.type &&
                        ((i.pressed = !1), (i.hover = !1));
                      var n = 0;
                      ["touchstart", "touchmove", "mousemove"].includes(
                        t.type
                      ) &&
                        (ve.toggleControls.call(e.player, !0),
                        (n = e.player.touch ? 3e3 : 2e3)),
                        clearTimeout(e.player.timers.controls),
                        (e.player.timers.controls = setTimeout(function () {
                          return ve.toggleControls.call(e.player, !1);
                        }, n));
                    }
                  );
              },
            },
            {
              key: "media",
              value: function () {
                var e = this;
                if (
                  (d.call(
                    this.player,
                    this.player.media,
                    "timeupdate seeking seeked",
                    function (t) {
                      return se.timeUpdate.call(e.player, t);
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.media,
                    "durationchange loadeddata loadedmetadata",
                    function (t) {
                      return se.durationUpdate.call(e.player, t);
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.media,
                    "canplay",
                    function () {
                      P(e.player.elements.volume, !e.player.hasAudio),
                        P(e.player.elements.buttons.mute, !e.player.hasAudio);
                    }
                  ),
                  d.call(this.player, this.player.media, "ended", function () {
                    e.player.isHTML5 &&
                      e.player.isVideo &&
                      e.player.config.resetOnEnd &&
                      e.player.restart();
                  }),
                  d.call(
                    this.player,
                    this.player.media,
                    "progress playing seeking seeked",
                    function (t) {
                      return se.updateProgress.call(e.player, t);
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.media,
                    "volumechange",
                    function (t) {
                      return se.updateVolume.call(e.player, t);
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.media,
                    "playing play pause ended emptied timeupdate",
                    function (t) {
                      return ve.checkPlaying.call(e.player, t);
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.media,
                    "waiting canplay seeked playing",
                    function (t) {
                      return ve.checkLoading.call(e.player, t);
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.media,
                    "playing",
                    function () {
                      e.player.ads &&
                        e.player.ads.enabled &&
                        !e.player.ads.initialized &&
                        e.player.ads.managerPromise
                          .then(function () {
                            return e.player.ads.play();
                          })
                          .catch(function () {
                            return e.player.play();
                          });
                    }
                  ),
                  this.player.supported.ui &&
                    this.player.config.clickToPlay &&
                    !this.player.isAudio)
                ) {
                  var t = _.call(
                    this.player,
                    "." + this.player.config.classNames.video
                  );
                  if (!o.element(t)) return;
                  d.call(this.player, t, "click", function () {
                    (e.player.config.hideControls &&
                      e.player.touch &&
                      !e.player.paused) ||
                      (e.player.paused
                        ? e.player.play()
                        : e.player.ended
                        ? (e.player.restart(), e.player.play())
                        : e.player.pause());
                  });
                }
                this.player.supported.ui &&
                  this.player.config.disableContextMenu &&
                  d.call(
                    this.player,
                    this.player.elements.wrapper,
                    "contextmenu",
                    function (e) {
                      e.preventDefault();
                    },
                    !1
                  ),
                  d.call(
                    this.player,
                    this.player.media,
                    "volumechange",
                    function () {
                      e.player.storage.set({
                        volume: e.player.volume,
                        muted: e.player.muted,
                      });
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.media,
                    "ratechange",
                    function () {
                      se.updateSetting.call(e.player, "speed"),
                        e.player.storage.set({ speed: e.player.speed });
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.media,
                    "qualityrequested",
                    function (t) {
                      e.player.storage.set({ quality: t.detail.quality });
                    }
                  ),
                  d.call(
                    this.player,
                    this.player.media,
                    "qualitychange",
                    function (t) {
                      se.updateSetting.call(
                        e.player,
                        "quality",
                        null,
                        t.detail.quality
                      );
                    }
                  );
                var i = this.player.config.events
                  .concat(["keyup", "keydown"])
                  .join(" ");
                d.call(this.player, this.player.media, i, function (t) {
                  var i = t.detail,
                    n = void 0 === i ? {} : i;
                  "error" === t.type && (n = e.player.media.error),
                    m.call(
                      e.player,
                      e.player.elements.container,
                      t.type,
                      !0,
                      n
                    );
                });
              },
            },
            {
              key: "controls",
              value: function () {
                var e = this,
                  t = V.isIE ? "change" : "input",
                  i = function (t, i, n) {
                    var a = e.player.config.listeners[n],
                      s = !0;
                    o.function(a) && (s = a.call(e.player, t)),
                      s && o.function(i) && i.call(e.player, t);
                  },
                  n = function (t, n, a, s) {
                    var r =
                        !(arguments.length > 4 && void 0 !== arguments[4]) ||
                        arguments[4],
                      l = e.player.config.listeners[s],
                      c = o.function(l);
                    d.call(
                      e.player,
                      t,
                      n,
                      function (e) {
                        return i(e, a, s);
                      },
                      r && !c
                    );
                  };
                this.player.elements.buttons.play &&
                  Array.from(this.player.elements.buttons.play).forEach(
                    function (t) {
                      n(t, "click", e.player.togglePlay, "play");
                    }
                  ),
                  n(
                    this.player.elements.buttons.restart,
                    "click",
                    this.player.restart,
                    "restart"
                  ),
                  n(
                    this.player.elements.buttons.rewind,
                    "click",
                    this.player.rewind,
                    "rewind"
                  ),
                  n(
                    this.player.elements.buttons.fastForward,
                    "click",
                    this.player.forward,
                    "fastForward"
                  ),
                  n(
                    this.player.elements.buttons.mute,
                    "click",
                    function () {
                      e.player.muted = !e.player.muted;
                    },
                    "mute"
                  ),
                  n(
                    this.player.elements.buttons.captions,
                    "click",
                    function () {
                      return e.player.toggleCaptions();
                    }
                  ),
                  n(
                    this.player.elements.buttons.fullscreen,
                    "click",
                    function () {
                      e.player.fullscreen.toggle();
                    },
                    "fullscreen"
                  ),
                  n(
                    this.player.elements.buttons.pip,
                    "click",
                    function () {
                      e.player.pip = "toggle";
                    },
                    "pip"
                  ),
                  n(
                    this.player.elements.buttons.airplay,
                    "click",
                    this.player.airplay,
                    "airplay"
                  ),
                  n(
                    this.player.elements.buttons.settings,
                    "click",
                    function (t) {
                      se.toggleMenu.call(e.player, t);
                    }
                  ),
                  n(this.player.elements.settings.form, "click", function (t) {
                    t.stopPropagation();
                    var n = function () {
                      var t = "plyr-settings-" + e.player.id + "-home";
                      se.showTab.call(e.player, t);
                    };
                    if (M(t.target, e.player.config.selectors.inputs.language))
                      i(
                        t,
                        function () {
                          (e.player.currentTrack = Number(t.target.value)), n();
                        },
                        "language"
                      );
                    else if (
                      M(t.target, e.player.config.selectors.inputs.quality)
                    )
                      i(
                        t,
                        function () {
                          (e.player.quality = t.target.value), n();
                        },
                        "quality"
                      );
                    else if (
                      M(t.target, e.player.config.selectors.inputs.speed)
                    )
                      i(
                        t,
                        function () {
                          (e.player.speed = parseFloat(t.target.value)), n();
                        },
                        "speed"
                      );
                    else {
                      var a = t.target;
                      se.showTab.call(
                        e.player,
                        a.getAttribute("aria-controls")
                      );
                    }
                  }),
                  n(
                    this.player.elements.inputs.seek,
                    "mousedown mousemove",
                    function (t) {
                      var i =
                          e.player.elements.progress.getBoundingClientRect(),
                        n = (100 / i.width) * (t.pageX - i.left);
                      t.currentTarget.setAttribute("seek-value", n);
                    }
                  ),
                  n(
                    this.player.elements.inputs.seek,
                    "mousedown mouseup keydown keyup touchstart touchend",
                    function (t) {
                      var i = t.currentTarget,
                        n = t.keyCode ? t.keyCode : t.which,
                        a = t.type;
                      if (
                        ("keydown" !== a && "keyup" !== a) ||
                        39 === n ||
                        37 === n
                      ) {
                        var s = i.hasAttribute("play-on-seeked"),
                          r = ["mouseup", "touchend", "keyup"].includes(t.type);
                        s && r
                          ? (i.removeAttribute("play-on-seeked"),
                            e.player.play())
                          : !r &&
                            e.player.playing &&
                            (i.setAttribute("play-on-seeked", ""),
                            e.player.pause());
                      }
                    }
                  ),
                  n(
                    this.player.elements.inputs.seek,
                    t,
                    function (t) {
                      var i = t.currentTarget,
                        n = i.getAttribute("seek-value");
                      o.empty(n) && (n = i.value),
                        i.removeAttribute("seek-value"),
                        (e.player.currentTime =
                          (n / i.max) * e.player.duration);
                    },
                    "seek"
                  ),
                  this.player.config.toggleInvert &&
                    !o.element(this.player.elements.display.duration) &&
                    n(
                      this.player.elements.display.currentTime,
                      "click",
                      function () {
                        0 !== e.player.currentTime &&
                          ((e.player.config.invertTime =
                            !e.player.config.invertTime),
                          se.timeUpdate.call(e.player));
                      }
                    ),
                  n(
                    this.player.elements.inputs.volume,
                    t,
                    function (t) {
                      e.player.volume = t.target.value;
                    },
                    "volume"
                  ),
                  V.isWebkit &&
                    Array.from(
                      x.call(this.player, 'input[type="range"]')
                    ).forEach(function (t) {
                      n(t, "input", function (t) {
                        return se.updateRangeFill.call(e.player, t.target);
                      });
                    }),
                  n(
                    this.player.elements.progress,
                    "mouseenter mouseleave mousemove",
                    function (t) {
                      return se.updateSeekTooltip.call(e.player, t);
                    }
                  ),
                  n(
                    this.player.elements.controls,
                    "mouseenter mouseleave",
                    function (t) {
                      e.player.elements.controls.hover =
                        !e.player.touch && "mouseenter" === t.type;
                    }
                  ),
                  n(
                    this.player.elements.controls,
                    "mousedown mouseup touchstart touchend touchcancel",
                    function (t) {
                      e.player.elements.controls.pressed = [
                        "mousedown",
                        "touchstart",
                      ].includes(t.type);
                    }
                  ),
                  n(
                    this.player.elements.controls,
                    "focusin focusout",
                    function (t) {
                      var i = e.player,
                        n = i.config,
                        a = i.elements,
                        s = i.timers;
                      if (
                        (N(
                          a.controls,
                          n.classNames.noTransition,
                          "focusin" === t.type
                        ),
                        ve.toggleControls.call(e.player, "focusin" === t.type),
                        "focusin" === t.type)
                      ) {
                        setTimeout(function () {
                          N(a.controls, n.classNames.noTransition, !1);
                        }, 0);
                        var r = e.touch ? 3e3 : 4e3;
                        clearTimeout(s.controls),
                          (s.controls = setTimeout(function () {
                            return ve.toggleControls.call(e.player, !1);
                          }, r));
                      }
                    }
                  ),
                  n(
                    this.player.elements.inputs.volume,
                    "wheel",
                    function (t) {
                      var i = t.webkitDirectionInvertedFromDevice,
                        n = [t.deltaX, -t.deltaY].map(function (e) {
                          return i ? -e : e;
                        }),
                        a = v(n, 2),
                        s = a[0],
                        r = a[1],
                        l = Math.sign(Math.abs(s) > Math.abs(r) ? s : r);
                      e.player.increaseVolume(l / 50);
                      var o = e.player.media.volume;
                      ((1 === l && o < 1) || (-1 === l && o > 0)) &&
                        t.preventDefault();
                    },
                    "volume",
                    !1
                  );
              },
            },
          ]),
          e
        );
      })();
    "undefined" != typeof window
      ? window
      : "undefined" != typeof global
      ? global
      : "undefined" != typeof self && self;
    var ke,
      we =
        ((function (e, t) {
          var i;
          (i = function () {
            var e = function () {},
              t = {},
              i = {},
              n = {};
            function a(e, t) {
              if (e) {
                var a = n[e];
                if (((i[e] = t), a))
                  for (; a.length; ) a[0](e, t), a.splice(0, 1);
              }
            }
            function s(t, i) {
              t.call && (t = { success: t }),
                i.length ? (t.error || e)(i) : (t.success || e)(t);
            }
            function r(t, i, n, a) {
              var s,
                l,
                o = document,
                c = n.async,
                u = (n.numRetries || 0) + 1,
                d = n.before || e,
                p = t.replace(/^(css|img)!/, "");
              (a = a || 0),
                /(^css!|\.css$)/.test(t)
                  ? ((s = !0),
                    ((l = o.createElement("link")).rel = "stylesheet"),
                    (l.href = p))
                  : /(^img!|\.(png|gif|jpg|svg)$)/.test(t)
                  ? ((l = o.createElement("img")).src = p)
                  : (((l = o.createElement("script")).src = t),
                    (l.async = void 0 === c || c)),
                (l.onload =
                  l.onerror =
                  l.onbeforeload =
                    function (e) {
                      var o = e.type[0];
                      if (s && "hideFocus" in l)
                        try {
                          l.sheet.cssText.length || (o = "e");
                        } catch (e) {
                          o = "e";
                        }
                      if ("e" == o && (a += 1) < u) return r(t, i, n, a);
                      i(t, o, e.defaultPrevented);
                    }),
                !1 !== d(t, l) && o.head.appendChild(l);
            }
            function l(e, i, n) {
              var l, o;
              if ((i && i.trim && (l = i), (o = (l ? n : i) || {}), l)) {
                if (l in t) throw "LoadJS";
                t[l] = !0;
              }
              !(function (e, t, i) {
                var n,
                  a,
                  s = (e = e.push ? e : [e]).length,
                  l = s,
                  o = [];
                for (
                  n = function (e, i, n) {
                    if (("e" == i && o.push(e), "b" == i)) {
                      if (!n) return;
                      o.push(e);
                    }
                    --s || t(o);
                  },
                    a = 0;
                  a < l;
                  a++
                )
                  r(e[a], n, i);
              })(
                e,
                function (e) {
                  s(o, e), a(l, e);
                },
                o
              );
            }
            return (
              (l.ready = function (e, t) {
                return (
                  (function (e, t) {
                    e = e.push ? e : [e];
                    var a,
                      s,
                      r,
                      l = [],
                      o = e.length,
                      c = o;
                    for (
                      a = function (e, i) {
                        i.length && l.push(e), --c || t(l);
                      };
                      o--;

                    )
                      (s = e[o]),
                        (r = i[s]) ? a(s, r) : (n[s] = n[s] || []).push(a);
                  })(e, function (e) {
                    s(t, e);
                  }),
                  l
                );
              }),
              (l.done = function (e) {
                a(e, []);
              }),
              (l.reset = function () {
                (t = {}), (i = {}), (n = {});
              }),
              (l.isDefined = function (e) {
                return e in t;
              }),
              l
            );
          }),
            (e.exports = i());
        })((ke = { exports: {} }), ke.exports),
        ke.exports);
    function Te(e) {
      return new Promise(function (t, i) {
        we(e, { success: t, error: i });
      });
    }
    function Ae(e) {
      e && !this.embed.hasPlayed && (this.embed.hasPlayed = !0),
        this.media.paused === e &&
          ((this.media.paused = !e),
          m.call(this, this.media, e ? "play" : "pause"));
    }
    var Ce = {
      setup: function () {
        var e = this;
        N(this.elements.wrapper, this.config.classNames.embed, !0),
          Ce.setAspectRatio.call(this),
          o.object(window.Vimeo)
            ? Ce.ready.call(this)
            : Te(this.config.urls.vimeo.sdk)
                .then(function () {
                  Ce.ready.call(e);
                })
                .catch(function (t) {
                  e.debug.warn("Vimeo API failed to load", t);
                });
      },
      setAspectRatio: function (e) {
        var t = (o.string(e) ? e : this.config.ratio).split(":"),
          i = v(t, 2),
          n = (100 / i[0]) * i[1];
        if (
          ((this.elements.wrapper.style.paddingBottom = n + "%"),
          this.supported.ui)
        ) {
          var a = (240 - n) / 4.8;
          this.media.style.transform = "translateY(-" + a + "%)";
        }
      },
      ready: function () {
        var e = this,
          t = this,
          i = le({
            loop: t.config.loop.active,
            autoplay: t.autoplay,
            byline: !1,
            portrait: !1,
            title: !1,
            speed: !0,
            transparent: 0,
            gesture: "media",
            playsinline: !this.config.fullscreen.iosNative,
          }),
          n = t.media.getAttribute("src");
        o.empty(n) && (n = t.media.getAttribute(t.config.attributes.embed.id));
        var a,
          s =
            ((a = n),
            o.empty(a)
              ? null
              : o.number(Number(a))
              ? a
              : a.match(/^.*(vimeo.com\/|video\/)(\d+).*/)
              ? RegExp.$2
              : a),
          r = w("iframe"),
          l = W(t.config.urls.vimeo.iframe, s, i);
        r.setAttribute("src", l),
          r.setAttribute("allowfullscreen", ""),
          r.setAttribute("allowtransparency", ""),
          r.setAttribute("allow", "autoplay");
        var c = w("div", {
          poster: t.poster,
          class: t.config.classNames.embedContainer,
        });
        c.appendChild(r),
          (t.media = E(c, t.media)),
          Z(W(t.config.urls.vimeo.api, s), "json").then(function (e) {
            if (!o.empty(e)) {
              var i = new URL(e[0].thumbnail_large);
              (i.pathname = i.pathname.split("_")[0] + ".jpg"),
                ve.setPoster.call(t, i.href).catch(function () {});
            }
          }),
          (t.embed = new window.Vimeo.Player(r, {
            autopause: t.config.autopause,
            muted: t.muted,
          })),
          (t.media.paused = !0),
          (t.media.currentTime = 0),
          t.supported.ui && t.embed.disableTextTrack(),
          (t.media.play = function () {
            return Ae.call(t, !0), t.embed.play();
          }),
          (t.media.pause = function () {
            return Ae.call(t, !1), t.embed.pause();
          }),
          (t.media.stop = function () {
            t.pause(), (t.currentTime = 0);
          });
        var u = t.media.currentTime;
        Object.defineProperty(t.media, "currentTime", {
          get: function () {
            return u;
          },
          set: function (e) {
            var i = t.embed,
              n = t.media,
              a = t.paused,
              s = t.volume,
              r = a && !i.hasPlayed;
            (n.seeking = !0),
              m.call(t, n, "seeking"),
              Promise.resolve(r && i.setVolume(0))
                .then(function () {
                  return i.setCurrentTime(e);
                })
                .then(function () {
                  return r && i.pause();
                })
                .then(function () {
                  return r && i.setVolume(s);
                })
                .catch(function () {});
          },
        });
        var d = t.config.speed.selected;
        Object.defineProperty(t.media, "playbackRate", {
          get: function () {
            return d;
          },
          set: function (e) {
            t.embed
              .setPlaybackRate(e)
              .then(function () {
                (d = e), m.call(t, t.media, "ratechange");
              })
              .catch(function (e) {
                "Error" === e.name && se.setSpeedMenu.call(t, []);
              });
          },
        });
        var p = t.config.volume;
        Object.defineProperty(t.media, "volume", {
          get: function () {
            return p;
          },
          set: function (e) {
            t.embed.setVolume(e).then(function () {
              (p = e), m.call(t, t.media, "volumechange");
            });
          },
        });
        var h = t.config.muted;
        Object.defineProperty(t.media, "muted", {
          get: function () {
            return h;
          },
          set: function (e) {
            var i = !!o.boolean(e) && e;
            t.embed.setVolume(i ? 0 : t.config.volume).then(function () {
              (h = i), m.call(t, t.media, "volumechange");
            });
          },
        });
        var f = t.config.loop;
        Object.defineProperty(t.media, "loop", {
          get: function () {
            return f;
          },
          set: function (e) {
            var i = o.boolean(e) ? e : t.config.loop.active;
            t.embed.setLoop(i).then(function () {
              f = i;
            });
          },
        });
        var g = void 0;
        t.embed
          .getVideoUrl()
          .then(function (e) {
            g = e;
          })
          .catch(function (t) {
            e.debug.warn(t);
          }),
          Object.defineProperty(t.media, "currentSrc", {
            get: function () {
              return g;
            },
          }),
          Object.defineProperty(t.media, "ended", {
            get: function () {
              return t.currentTime === t.duration;
            },
          }),
          Promise.all([t.embed.getVideoWidth(), t.embed.getVideoHeight()]).then(
            function (t) {
              var i = (function (e, t) {
                var i = (function e(t, i) {
                  return 0 === i ? t : e(i, t % i);
                })(e, t);
                return e / i + ":" + t / i;
              })(t[0], t[1]);
              Ce.setAspectRatio.call(e, i);
            }
          ),
          t.embed.setAutopause(t.config.autopause).then(function (e) {
            t.config.autopause = e;
          }),
          t.embed.getVideoTitle().then(function (i) {
            (t.config.title = i), ve.setTitle.call(e);
          }),
          t.embed.getCurrentTime().then(function (e) {
            (u = e), m.call(t, t.media, "timeupdate");
          }),
          t.embed.getDuration().then(function (e) {
            (t.media.duration = e), m.call(t, t.media, "durationchange");
          }),
          t.embed.getTextTracks().then(function (e) {
            (t.media.textTracks = e), oe.setup.call(t);
          }),
          t.embed.on("cuechange", function (e) {
            var i = e.cues,
              n = (void 0 === i ? [] : i).map(function (e) {
                return (
                  (t = e.text),
                  (i = document.createDocumentFragment()),
                  (n = document.createElement("div")),
                  i.appendChild(n),
                  (n.innerHTML = t),
                  i.firstChild.innerText
                );
              });
            oe.updateCues.call(t, n);
          }),
          t.embed.on("loaded", function () {
            (t.embed.getPaused().then(function (e) {
              Ae.call(t, !e), e || m.call(t, t.media, "playing");
            }),
            o.element(t.embed.element) && t.supported.ui) &&
              t.embed.element.setAttribute("tabindex", -1);
          }),
          t.embed.on("play", function () {
            Ae.call(t, !0), m.call(t, t.media, "playing");
          }),
          t.embed.on("pause", function () {
            Ae.call(t, !1);
          }),
          t.embed.on("timeupdate", function (e) {
            (t.media.seeking = !1),
              (u = e.seconds),
              m.call(t, t.media, "timeupdate");
          }),
          t.embed.on("progress", function (e) {
            (t.media.buffered = e.percent),
              m.call(t, t.media, "progress"),
              1 === parseInt(e.percent, 10) &&
                m.call(t, t.media, "canplaythrough"),
              t.embed.getDuration().then(function (e) {
                e !== t.media.duration &&
                  ((t.media.duration = e),
                  m.call(t, t.media, "durationchange"));
              });
          }),
          t.embed.on("seeked", function () {
            (t.media.seeking = !1), m.call(t, t.media, "seeked");
          }),
          t.embed.on("ended", function () {
            (t.media.paused = !0), m.call(t, t.media, "ended");
          }),
          t.embed.on("error", function (e) {
            (t.media.error = e), m.call(t, t.media, "error");
          }),
          setTimeout(function () {
            return ve.build.call(t);
          }, 0);
      },
    };
    function Ee(e) {
      var t = Object.entries({
        hd2160: 2160,
        hd1440: 1440,
        hd1080: 1080,
        hd720: 720,
        large: 480,
        medium: 360,
        small: 240,
        tiny: 144,
      }).find(function (t) {
        return t.includes(e);
      });
      return t
        ? t.find(function (t) {
            return t !== e;
          })
        : "default";
    }
    function Se(e) {
      e && !this.embed.hasPlayed && (this.embed.hasPlayed = !0),
        this.media.paused === e &&
          ((this.media.paused = !e),
          m.call(this, this.media, e ? "play" : "pause"));
    }
    var Pe,
      Ne = {
        setup: function () {
          var e = this;
          N(this.elements.wrapper, this.config.classNames.embed, !0),
            Ne.setAspectRatio.call(this),
            o.object(window.YT) && o.function(window.YT.Player)
              ? Ne.ready.call(this)
              : (Te(this.config.urls.youtube.sdk).catch(function (t) {
                  e.debug.warn("YouTube API failed to load", t);
                }),
                (window.onYouTubeReadyCallbacks =
                  window.onYouTubeReadyCallbacks || []),
                window.onYouTubeReadyCallbacks.push(function () {
                  Ne.ready.call(e);
                }),
                (window.onYouTubeIframeAPIReady = function () {
                  window.onYouTubeReadyCallbacks.forEach(function (e) {
                    e();
                  });
                }));
        },
        getTitle: function (e) {
          var t = this;
          if (o.function(this.embed.getVideoData)) {
            var i = this.embed.getVideoData().title;
            if (o.empty(i))
              return (this.config.title = i), void ve.setTitle.call(this);
          }
          var n = this.config.keys.google;
          o.string(n) &&
            !o.empty(n) &&
            Z(W(this.config.urls.youtube.api, e, n))
              .then(function (e) {
                o.object(e) &&
                  ((t.config.title = e.items[0].snippet.title),
                  ve.setTitle.call(t));
              })
              .catch(function () {});
        },
        setAspectRatio: function () {
          var e = this.config.ratio.split(":");
          this.elements.wrapper.style.paddingBottom = (100 / e[0]) * e[1] + "%";
        },
        ready: function () {
          var e = this,
            t = e.media.getAttribute("id");
          if (o.empty(t) || !t.startsWith("youtube-")) {
            var i = e.media.getAttribute("src");
            o.empty(i) &&
              (i = e.media.getAttribute(this.config.attributes.embed.id));
            var n,
              a =
                ((n = i),
                o.empty(n)
                  ? null
                  : n.match(
                      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
                    )
                  ? RegExp.$2
                  : n),
              s = e.provider + "-" + Math.floor(1e4 * Math.random()),
              r = w("div", { id: s, poster: e.poster });
            e.media = E(r, e.media);
            var l = function (e) {
              return (
                "https://img.youtube.com/vi/" + a + "/" + e + "default.jpg"
              );
            };
            ye(l("maxres"), 121)
              .catch(function () {
                return ye(l("sd"), 121);
              })
              .catch(function () {
                return ye(l("hq"));
              })
              .then(function (t) {
                return ve.setPoster.call(e, t.src);
              })
              .then(function (t) {
                t.includes("maxres") ||
                  (e.elements.poster.style.backgroundSize = "cover");
              })
              .catch(function () {}),
              (e.embed = new window.YT.Player(s, {
                videoId: a,
                playerVars: {
                  autoplay: e.config.autoplay ? 1 : 0,
                  controls: e.supported.ui ? 0 : 1,
                  rel: 0,
                  showinfo: 0,
                  iv_load_policy: 3,
                  modestbranding: 1,
                  disablekb: 1,
                  playsinline: 1,
                  widget_referrer: window ? window.location.href : null,
                  cc_load_policy: e.captions.active ? 1 : 0,
                  cc_lang_pref: e.config.captions.language,
                },
                events: {
                  onError: function (t) {
                    if (!e.media.error) {
                      var i = t.data,
                        n =
                          {
                            2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.",
                            5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.",
                            100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.",
                            101: "The owner of the requested video does not allow it to be played in embedded players.",
                            150: "The owner of the requested video does not allow it to be played in embedded players.",
                          }[i] || "An unknown error occured";
                      (e.media.error = { code: i, message: n }),
                        m.call(e, e.media, "error");
                    }
                  },
                  onPlaybackQualityChange: function () {
                    m.call(e, e.media, "qualitychange", !1, {
                      quality: e.media.quality,
                    });
                  },
                  onPlaybackRateChange: function (t) {
                    var i = t.target;
                    (e.media.playbackRate = i.getPlaybackRate()),
                      m.call(e, e.media, "ratechange");
                  },
                  onReady: function (t) {
                    var i = t.target;
                    Ne.getTitle.call(e, a),
                      (e.media.play = function () {
                        Se.call(e, !0), i.playVideo();
                      }),
                      (e.media.pause = function () {
                        Se.call(e, !1), i.pauseVideo();
                      }),
                      (e.media.stop = function () {
                        i.stopVideo();
                      }),
                      (e.media.duration = i.getDuration()),
                      (e.media.paused = !0),
                      (e.media.currentTime = 0),
                      Object.defineProperty(e.media, "currentTime", {
                        get: function () {
                          return Number(i.getCurrentTime());
                        },
                        set: function (t) {
                          e.paused && !e.embed.hasPlayed && e.embed.mute(),
                            (e.media.seeking = !0),
                            m.call(e, e.media, "seeking"),
                            i.seekTo(t);
                        },
                      }),
                      Object.defineProperty(e.media, "playbackRate", {
                        get: function () {
                          return i.getPlaybackRate();
                        },
                        set: function (e) {
                          i.setPlaybackRate(e);
                        },
                      }),
                      Object.defineProperty(e.media, "quality", {
                        get: function () {
                          return Ee(i.getPlaybackQuality());
                        },
                        set: function (e) {
                          i.setPlaybackQuality(Ee(e));
                        },
                      });
                    var n = e.config.volume;
                    Object.defineProperty(e.media, "volume", {
                      get: function () {
                        return n;
                      },
                      set: function (t) {
                        (n = t),
                          i.setVolume(100 * n),
                          m.call(e, e.media, "volumechange");
                      },
                    });
                    var s = e.config.muted;
                    Object.defineProperty(e.media, "muted", {
                      get: function () {
                        return s;
                      },
                      set: function (t) {
                        var n = o.boolean(t) ? t : s;
                        (s = n),
                          i[n ? "mute" : "unMute"](),
                          m.call(e, e.media, "volumechange");
                      },
                    }),
                      Object.defineProperty(e.media, "currentSrc", {
                        get: function () {
                          return i.getVideoUrl();
                        },
                      }),
                      Object.defineProperty(e.media, "ended", {
                        get: function () {
                          return e.currentTime === e.duration;
                        },
                      }),
                      (e.options.speed = i.getAvailablePlaybackRates()),
                      e.supported.ui && e.media.setAttribute("tabindex", -1),
                      m.call(e, e.media, "timeupdate"),
                      m.call(e, e.media, "durationchange"),
                      clearInterval(e.timers.buffering),
                      (e.timers.buffering = setInterval(function () {
                        (e.media.buffered = i.getVideoLoadedFraction()),
                          (null === e.media.lastBuffered ||
                            e.media.lastBuffered < e.media.buffered) &&
                            m.call(e, e.media, "progress"),
                          (e.media.lastBuffered = e.media.buffered),
                          1 === e.media.buffered &&
                            (clearInterval(e.timers.buffering),
                            m.call(e, e.media, "canplaythrough"));
                      }, 200)),
                      setTimeout(function () {
                        return ve.build.call(e);
                      }, 50);
                  },
                  onStateChange: function (t) {
                    var i,
                      n = t.target;
                    switch (
                      (clearInterval(e.timers.playing),
                      e.media.seeking &&
                        [1, 2].includes(t.data) &&
                        ((e.media.seeking = !1), m.call(e, e.media, "seeked")),
                      t.data)
                    ) {
                      case -1:
                        m.call(e, e.media, "timeupdate"),
                          (e.media.buffered = n.getVideoLoadedFraction()),
                          m.call(e, e.media, "progress");
                        break;
                      case 0:
                        Se.call(e, !1),
                          e.media.loop
                            ? (n.stopVideo(), n.playVideo())
                            : m.call(e, e.media, "ended");
                        break;
                      case 1:
                        e.media.paused && !e.embed.hasPlayed
                          ? e.media.pause()
                          : (Se.call(e, !0),
                            m.call(e, e.media, "playing"),
                            (e.timers.playing = setInterval(function () {
                              m.call(e, e.media, "timeupdate");
                            }, 50)),
                            e.media.duration !== n.getDuration() &&
                              ((e.media.duration = n.getDuration()),
                              m.call(e, e.media, "durationchange")),
                            se.setQualityMenu.call(
                              e,
                              ((i = n.getAvailableQualityLevels()),
                              o.empty(i)
                                ? i
                                : G(
                                    i.map(function (e) {
                                      return Ee(e);
                                    })
                                  ))
                            ));
                        break;
                      case 2:
                        e.muted || e.embed.unMute(), Se.call(e, !1);
                    }
                    m.call(e, e.elements.container, "statechange", !1, {
                      code: t.data,
                    });
                  },
                },
              }));
          }
        },
      },
      Le = {
        setup: function () {
          this.media
            ? (N(
                this.elements.container,
                this.config.classNames.type.replace("{0}", this.type),
                !0
              ),
              N(
                this.elements.container,
                this.config.classNames.provider.replace("{0}", this.provider),
                !0
              ),
              this.isEmbed &&
                N(
                  this.elements.container,
                  this.config.classNames.type.replace("{0}", "video"),
                  !0
                ),
              this.isVideo &&
                ((this.elements.wrapper = w("div", {
                  class: this.config.classNames.video,
                })),
                b(this.media, this.elements.wrapper),
                (this.elements.poster = w("div", {
                  class: this.config.classNames.poster,
                })),
                this.elements.wrapper.appendChild(this.elements.poster)),
              this.isHTML5
                ? F.extend.call(this)
                : this.isYouTube
                ? Ne.setup.call(this)
                : this.isVimeo && Ce.setup.call(this))
            : this.debug.warn("No media element found!");
        },
      },
      Me = (function () {
        function e(t) {
          var i = this;
          f(this, e),
            (this.player = t),
            (this.publisherId = t.config.ads.publisherId),
            (this.playing = !1),
            (this.initialized = !1),
            (this.elements = { container: null, displayContainer: null }),
            (this.manager = null),
            (this.loader = null),
            (this.cuePoints = null),
            (this.events = {}),
            (this.safetyTimer = null),
            (this.countdownTimer = null),
            (this.managerPromise = new Promise(function (e, t) {
              i.on("loaded", e), i.on("error", t);
            })),
            this.load();
        }
        return (
          g(e, [
            {
              key: "load",
              value: function () {
                var e = this;
                this.enabled &&
                  (o.object(window.google) && o.object(window.google.ima)
                    ? this.ready()
                    : Te(this.player.config.urls.googleIMA.sdk)
                        .then(function () {
                          e.ready();
                        })
                        .catch(function () {
                          e.trigger(
                            "error",
                            new Error("Google IMA SDK failed to load")
                          );
                        }));
              },
            },
            {
              key: "ready",
              value: function () {
                var e = this;
                this.startSafetyTimer(12e3, "ready()"),
                  this.managerPromise.then(function () {
                    e.clearSafetyTimer("onAdsManagerLoaded()");
                  }),
                  this.listeners(),
                  this.setupIMA();
              },
            },
            {
              key: "setupIMA",
              value: function () {
                (this.elements.container = w("div", {
                  class: this.player.config.classNames.ads,
                })),
                  this.player.elements.container.appendChild(
                    this.elements.container
                  ),
                  google.ima.settings.setVpaidMode(
                    google.ima.ImaSdkSettings.VpaidMode.ENABLED
                  ),
                  google.ima.settings.setLocale(
                    this.player.config.ads.language
                  ),
                  (this.elements.displayContainer =
                    new google.ima.AdDisplayContainer(this.elements.container)),
                  this.requestAds();
              },
            },
            {
              key: "requestAds",
              value: function () {
                var e = this,
                  t = this.player.elements.container;
                try {
                  (this.loader = new google.ima.AdsLoader(
                    this.elements.displayContainer
                  )),
                    this.loader.addEventListener(
                      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                      function (t) {
                        return e.onAdsManagerLoaded(t);
                      },
                      !1
                    ),
                    this.loader.addEventListener(
                      google.ima.AdErrorEvent.Type.AD_ERROR,
                      function (t) {
                        return e.onAdError(t);
                      },
                      !1
                    );
                  var i = new google.ima.AdsRequest();
                  (i.adTagUrl = this.tagUrl),
                    (i.linearAdSlotWidth = t.offsetWidth),
                    (i.linearAdSlotHeight = t.offsetHeight),
                    (i.nonLinearAdSlotWidth = t.offsetWidth),
                    (i.nonLinearAdSlotHeight = t.offsetHeight),
                    (i.forceNonLinearFullSlot = !1),
                    i.setAdWillPlayMuted(!this.player.muted),
                    this.loader.requestAds(i);
                } catch (e) {
                  this.onAdError(e);
                }
              },
            },
            {
              key: "pollCountdown",
              value: function () {
                var e = this;
                if (
                  !(
                    arguments.length > 0 &&
                    void 0 !== arguments[0] &&
                    arguments[0]
                  )
                )
                  return (
                    clearInterval(this.countdownTimer),
                    void this.elements.container.removeAttribute(
                      "data-badge-text"
                    )
                  );
                this.countdownTimer = setInterval(function () {
                  var t = ae(Math.max(e.manager.getRemainingTime(), 0)),
                    i = $("advertisement", e.player.config) + " - " + t;
                  e.elements.container.setAttribute("data-badge-text", i);
                }, 100);
              },
            },
            {
              key: "onAdsManagerLoaded",
              value: function (e) {
                var t = this,
                  i = new google.ima.AdsRenderingSettings();
                (i.restoreCustomPlaybackStateOnAdBreakComplete = !0),
                  (i.enablePreloading = !0),
                  (this.manager = e.getAdsManager(this.player, i)),
                  (this.cuePoints = this.manager.getCuePoints()),
                  o.empty(this.cuePoints) ||
                    this.cuePoints.forEach(function (e) {
                      if (0 !== e && -1 !== e && e < t.player.duration) {
                        var i = t.player.elements.progress;
                        if (o.element(i)) {
                          var n = (100 / t.player.duration) * e,
                            a = w("span", {
                              class: t.player.config.classNames.cues,
                            });
                          (a.style.left = n.toString() + "%"), i.appendChild(a);
                        }
                      }
                    }),
                  this.manager.setVolume(this.player.volume),
                  this.manager.addEventListener(
                    google.ima.AdErrorEvent.Type.AD_ERROR,
                    function (e) {
                      return t.onAdError(e);
                    }
                  ),
                  Object.keys(google.ima.AdEvent.Type).forEach(function (e) {
                    t.manager.addEventListener(
                      google.ima.AdEvent.Type[e],
                      function (e) {
                        return t.onAdEvent(e);
                      }
                    );
                  }),
                  this.trigger("loaded");
              },
            },
            {
              key: "onAdEvent",
              value: function (e) {
                var t = this,
                  i = this.player.elements.container,
                  n = e.getAd(),
                  a = function (e) {
                    var i = "ads" + e.replace(/_/g, "").toLowerCase();
                    m.call(t.player, t.player.media, i);
                  };
                switch (e.type) {
                  case google.ima.AdEvent.Type.LOADED:
                    this.trigger("loaded"),
                      a(e.type),
                      this.pollCountdown(!0),
                      n.isLinear() ||
                        ((n.width = i.offsetWidth),
                        (n.height = i.offsetHeight));
                    break;
                  case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                    a(e.type), this.loadAds();
                    break;
                  case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                    a(e.type), this.pauseContent();
                    break;
                  case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                    a(e.type), this.pollCountdown(), this.resumeContent();
                    break;
                  case google.ima.AdEvent.Type.STARTED:
                  case google.ima.AdEvent.Type.MIDPOINT:
                  case google.ima.AdEvent.Type.COMPLETE:
                  case google.ima.AdEvent.Type.IMPRESSION:
                  case google.ima.AdEvent.Type.CLICK:
                    a(e.type);
                }
              },
            },
            {
              key: "onAdError",
              value: function (e) {
                this.cancel(), this.player.debug.warn("Ads error", e);
              },
            },
            {
              key: "listeners",
              value: function () {
                var e = this,
                  t = this.player.elements.container,
                  i = void 0;
                this.player.on("ended", function () {
                  e.loader.contentComplete();
                }),
                  this.player.on("seeking", function () {
                    return (i = e.player.currentTime);
                  }),
                  this.player.on("seeked", function () {
                    var t = e.player.currentTime;
                    o.empty(e.cuePoints) ||
                      e.cuePoints.forEach(function (n, a) {
                        i < n &&
                          n < t &&
                          (e.manager.discardAdBreak(),
                          e.cuePoints.splice(a, 1));
                      });
                  }),
                  window.addEventListener("resize", function () {
                    e.manager &&
                      e.manager.resize(
                        t.offsetWidth,
                        t.offsetHeight,
                        google.ima.ViewMode.NORMAL
                      );
                  });
              },
            },
            {
              key: "play",
              value: function () {
                var e = this,
                  t = this.player.elements.container;
                this.managerPromise || this.resumeContent(),
                  this.managerPromise
                    .then(function () {
                      e.elements.displayContainer.initialize();
                      try {
                        e.initialized ||
                          (e.manager.init(
                            t.offsetWidth,
                            t.offsetHeight,
                            google.ima.ViewMode.NORMAL
                          ),
                          e.manager.start()),
                          (e.initialized = !0);
                      } catch (t) {
                        e.onAdError(t);
                      }
                    })
                    .catch(function () {});
              },
            },
            {
              key: "resumeContent",
              value: function () {
                (this.elements.container.style.zIndex = ""),
                  (this.playing = !1),
                  this.player.currentTime < this.player.duration &&
                    this.player.play();
              },
            },
            {
              key: "pauseContent",
              value: function () {
                (this.elements.container.style.zIndex = 3),
                  (this.playing = !0),
                  this.player.pause();
              },
            },
            {
              key: "cancel",
              value: function () {
                this.initialized && this.resumeContent(),
                  this.trigger("error"),
                  this.loadAds();
              },
            },
            {
              key: "loadAds",
              value: function () {
                var e = this;
                this.managerPromise
                  .then(function () {
                    e.manager && e.manager.destroy(),
                      (e.managerPromise = new Promise(function (t) {
                        e.on("loaded", t), e.player.debug.log(e.manager);
                      })),
                      e.requestAds();
                  })
                  .catch(function () {});
              },
            },
            {
              key: "trigger",
              value: function (e) {
                for (
                  var t = this,
                    i = arguments.length,
                    n = Array(i > 1 ? i - 1 : 0),
                    a = 1;
                  a < i;
                  a++
                )
                  n[a - 1] = arguments[a];
                var s = this.events[e];
                o.array(s) &&
                  s.forEach(function (e) {
                    o.function(e) && e.apply(t, n);
                  });
              },
            },
            {
              key: "on",
              value: function (e, t) {
                return (
                  o.array(this.events[e]) || (this.events[e] = []),
                  this.events[e].push(t),
                  this
                );
              },
            },
            {
              key: "startSafetyTimer",
              value: function (e, t) {
                var i = this;
                this.player.debug.log("Safety timer invoked from: " + t),
                  (this.safetyTimer = setTimeout(function () {
                    i.cancel(), i.clearSafetyTimer("startSafetyTimer()");
                  }, e));
              },
            },
            {
              key: "clearSafetyTimer",
              value: function (e) {
                o.nullOrUndefined(this.safetyTimer) ||
                  (this.player.debug.log("Safety timer cleared from: " + e),
                  clearTimeout(this.safetyTimer),
                  (this.safetyTimer = null));
              },
            },
            {
              key: "enabled",
              get: function () {
                return (
                  this.player.isHTML5 &&
                  this.player.isVideo &&
                  this.player.config.ads.enabled &&
                  !o.empty(this.publisherId)
                );
              },
            },
            {
              key: "tagUrl",
              get: function () {
                return (
                  "https://go.aniview.com/api/adserver6/vast/?" +
                  le({
                    AV_PUBLISHERID: "58c25bb0073ef448b1087ad6",
                    AV_CHANNELID: "5a0458dc28a06145e4519d21",
                    AV_URL: window.location.hostname,
                    cb: Date.now(),
                    AV_WIDTH: 640,
                    AV_HEIGHT: 480,
                    AV_CDIM2: this.publisherId,
                  })
                );
              },
            },
          ]),
          e
        );
      })(),
      xe = {
        insertElements: function (e, t) {
          var i = this;
          o.string(t)
            ? T(e, this.media, { src: t })
            : o.array(t) &&
              t.forEach(function (t) {
                T(e, i.media, t);
              });
        },
        change: function (e) {
          var t = this;
          U(e, "sources.length")
            ? (F.cancelRequests.call(this),
              this.destroy.call(
                this,
                function () {
                  (t.options.quality = []),
                    A(t.media),
                    (t.media = null),
                    o.element(t.elements.container) &&
                      t.elements.container.removeAttribute("class");
                  var i = e.sources,
                    n = e.type,
                    a = v(i, 1)[0],
                    s = a.provider,
                    r = void 0 === s ? ue.html5 : s,
                    l = a.src,
                    c = "html5" === r ? n : "div",
                    u = "html5" === r ? {} : { src: l };
                  Object.assign(t, {
                    provider: r,
                    type: n,
                    supported: D.check(n, r, t.config.playsinline),
                    media: w(c, u),
                  }),
                    t.elements.container.appendChild(t.media),
                    o.boolean(e.autoplay) && (t.config.autoplay = e.autoplay),
                    t.isHTML5 &&
                      (t.config.crossorigin &&
                        t.media.setAttribute("crossorigin", ""),
                      t.config.autoplay && t.media.setAttribute("autoplay", ""),
                      o.empty(e.poster) || (t.poster = e.poster),
                      t.config.loop.active && t.media.setAttribute("loop", ""),
                      t.config.muted && t.media.setAttribute("muted", ""),
                      t.config.playsinline &&
                        t.media.setAttribute("playsinline", "")),
                    ve.addStyleHook.call(t),
                    t.isHTML5 && xe.insertElements.call(t, "source", i),
                    (t.config.title = e.title),
                    Le.setup.call(t),
                    t.isHTML5 &&
                      ("tracks" in e &&
                        xe.insertElements.call(t, "track", e.tracks),
                      t.media.load()),
                    (t.isHTML5 || (t.isEmbed && !t.supported.ui)) &&
                      ve.build.call(t),
                    t.fullscreen.update();
                },
                !0
              ))
            : this.debug.warn("Invalid source format");
        },
      },
      _e = (function () {
        function e(t, i) {
          var n = this;
          if (
            (f(this, e),
            (this.timers = {}),
            (this.ready = !1),
            (this.loading = !1),
            (this.failed = !1),
            (this.touch = D.touch),
            (this.media = t),
            o.string(this.media) &&
              (this.media = document.querySelectorAll(this.media)),
            ((window.jQuery && this.media instanceof jQuery) ||
              o.nodeList(this.media) ||
              o.array(this.media)) &&
              (this.media = this.media[0]),
            (this.config = z(
              {},
              ce,
              e.defaults,
              i || {},
              (function () {
                try {
                  return JSON.parse(n.media.getAttribute("data-plyr-config"));
                } catch (e) {
                  return {};
                }
              })()
            )),
            (this.elements = {
              container: null,
              buttons: {},
              display: {},
              progress: {},
              inputs: {},
              settings: { menu: null, panes: {}, tabs: {} },
              captions: null,
            }),
            (this.captions = {
              active: null,
              currentTrack: -1,
              meta: new WeakMap(),
            }),
            (this.fullscreen = { active: !1 }),
            (this.options = { speed: [], quality: [] }),
            (this.debug = new he(this.config.debug)),
            this.debug.log("Config", this.config),
            this.debug.log("Support", D),
            !o.nullOrUndefined(this.media) && o.element(this.media))
          )
            if (this.media.plyr) this.debug.warn("Target already setup");
            else if (this.config.enabled)
              if (D.check().api) {
                var a = this.media.cloneNode(!0);
                (a.autoplay = !1), (this.elements.original = a);
                var s = this.media.tagName.toLowerCase(),
                  r = null,
                  l = null;
                switch (s) {
                  case "div":
                    if (
                      ((r = this.media.querySelector("iframe")), o.element(r))
                    ) {
                      if (
                        ((l = re(r.getAttribute("src"))),
                        (this.provider = (function (e) {
                          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(
                            e
                          )
                            ? ue.youtube
                            : /^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(
                                e
                              )
                            ? ue.vimeo
                            : null;
                        })(l.toString())),
                        (this.elements.container = this.media),
                        (this.media = r),
                        (this.elements.container.className = ""),
                        l.searchParams.length)
                      ) {
                        var c = ["1", "true"];
                        c.includes(l.searchParams.get("autoplay")) &&
                          (this.config.autoplay = !0),
                          c.includes(l.searchParams.get("loop")) &&
                            (this.config.loop.active = !0),
                          this.isYouTube
                            ? (this.config.playsinline = c.includes(
                                l.searchParams.get("playsinline")
                              ))
                            : (this.config.playsinline = !0);
                      }
                    } else
                      (this.provider = this.media.getAttribute(
                        this.config.attributes.embed.provider
                      )),
                        this.media.removeAttribute(
                          this.config.attributes.embed.provider
                        );
                    if (
                      o.empty(this.provider) ||
                      !Object.keys(ue).includes(this.provider)
                    )
                      return void this.debug.error(
                        "Setup failed: Invalid provider"
                      );
                    this.type = de.video;
                    break;
                  case "video":
                  case "audio":
                    (this.type = s),
                      (this.provider = ue.html5),
                      this.media.hasAttribute("crossorigin") &&
                        (this.config.crossorigin = !0),
                      this.media.hasAttribute("autoplay") &&
                        (this.config.autoplay = !0),
                      this.media.hasAttribute("playsinline") &&
                        (this.config.playsinline = !0),
                      this.media.hasAttribute("muted") &&
                        (this.config.muted = !0),
                      this.media.hasAttribute("loop") &&
                        (this.config.loop.active = !0);
                    break;
                  default:
                    return void this.debug.error(
                      "Setup failed: unsupported type"
                    );
                }
                (this.supported = D.check(
                  this.type,
                  this.provider,
                  this.config.playsinline
                )),
                  this.supported.api
                    ? ((this.eventListeners = []),
                      (this.listeners = new be(this)),
                      (this.storage = new X(this)),
                      (this.media.plyr = this),
                      o.element(this.elements.container) ||
                        ((this.elements.container = w("div")),
                        b(this.media, this.elements.container)),
                      ve.addStyleHook.call(this),
                      Le.setup.call(this),
                      this.config.debug &&
                        d.call(
                          this,
                          this.elements.container,
                          this.config.events.join(" "),
                          function (e) {
                            n.debug.log("event: " + e.type);
                          }
                        ),
                      (this.isHTML5 || (this.isEmbed && !this.supported.ui)) &&
                        ve.build.call(this),
                      this.listeners.container(),
                      this.listeners.global(),
                      (this.fullscreen = new ge(this)),
                      (this.ads = new Me(this)),
                      this.config.autoplay && this.play())
                    : this.debug.error("Setup failed: no support");
              } else this.debug.error("Setup failed: no support");
            else this.debug.error("Setup failed: disabled by config");
          else this.debug.error("Setup failed: no suitable element passed");
        }
        return (
          g(
            e,
            [
              {
                key: "play",
                value: function () {
                  return o.function(this.media.play) ? this.media.play() : null;
                },
              },
              {
                key: "pause",
                value: function () {
                  this.playing &&
                    o.function(this.media.pause) &&
                    this.media.pause();
                },
              },
              {
                key: "togglePlay",
                value: function (e) {
                  (o.boolean(e) ? e : !this.playing)
                    ? this.play()
                    : this.pause();
                },
              },
              {
                key: "stop",
                value: function () {
                  this.isHTML5
                    ? (this.pause(), this.restart())
                    : o.function(this.media.stop) && this.media.stop();
                },
              },
              {
                key: "restart",
                value: function () {
                  this.currentTime = 0;
                },
              },
              {
                key: "rewind",
                value: function (e) {
                  this.currentTime =
                    this.currentTime - (o.number(e) ? e : this.config.seekTime);
                },
              },
              {
                key: "forward",
                value: function (e) {
                  this.currentTime =
                    this.currentTime + (o.number(e) ? e : this.config.seekTime);
                },
              },
              {
                key: "increaseVolume",
                value: function (e) {
                  var t = this.media.muted ? 0 : this.volume;
                  this.volume = t + (o.number(e) ? e : 0);
                },
              },
              {
                key: "decreaseVolume",
                value: function (e) {
                  this.increaseVolume(-e);
                },
              },
              {
                key: "toggleCaptions",
                value: function (e) {
                  oe.toggle.call(this, e, !1);
                },
              },
              {
                key: "airplay",
                value: function () {
                  D.airplay && this.media.webkitShowPlaybackTargetPicker();
                },
              },
              {
                key: "toggleControls",
                value: function (e) {
                  if (this.supported.ui && !this.isAudio) {
                    var t = L(
                        this.elements.container,
                        this.config.classNames.hideControls
                      ),
                      i = void 0 === e ? void 0 : !e,
                      n = N(
                        this.elements.container,
                        this.config.classNames.hideControls,
                        i
                      );
                    if (
                      (n &&
                        this.config.controls.includes("settings") &&
                        !o.empty(this.config.settings) &&
                        se.toggleMenu.call(this, !1),
                      n !== t)
                    ) {
                      var a = n ? "controlshidden" : "controlsshown";
                      m.call(this, this.media, a);
                    }
                    return !n;
                  }
                  return !1;
                },
              },
              {
                key: "on",
                value: function (e, t) {
                  d.call(this, this.elements.container, e, t);
                },
              },
              {
                key: "once",
                value: function (e, t) {
                  h.call(this, this.elements.container, e, t);
                },
              },
              {
                key: "off",
                value: function (e, t) {
                  p(this.elements.container, e, t);
                },
              },
              {
                key: "destroy",
                value: function (e) {
                  var t = this,
                    i =
                      arguments.length > 1 &&
                      void 0 !== arguments[1] &&
                      arguments[1];
                  if (this.ready) {
                    var n = function () {
                      (document.body.style.overflow = ""),
                        (t.embed = null),
                        i
                          ? (Object.keys(t.elements).length &&
                              (A(t.elements.buttons.play),
                              A(t.elements.captions),
                              A(t.elements.controls),
                              A(t.elements.wrapper),
                              (t.elements.buttons.play = null),
                              (t.elements.captions = null),
                              (t.elements.controls = null),
                              (t.elements.wrapper = null)),
                            o.function(e) && e())
                          : (function () {
                              this &&
                                this.eventListeners &&
                                (this.eventListeners.forEach(function (e) {
                                  var t = e.element,
                                    i = e.type,
                                    n = e.callback,
                                    a = e.options;
                                  t.removeEventListener(i, n, a);
                                }),
                                (this.eventListeners = []));
                            }.call(t),
                            E(t.elements.original, t.elements.container),
                            m.call(t, t.elements.original, "destroyed", !0),
                            o.function(e) && e.call(t.elements.original),
                            (t.ready = !1),
                            setTimeout(function () {
                              (t.elements = null), (t.media = null);
                            }, 200));
                    };
                    this.stop(),
                      this.isHTML5
                        ? (clearTimeout(this.timers.loading),
                          ve.toggleNativeControls.call(this, !0),
                          n())
                        : this.isYouTube
                        ? (clearInterval(this.timers.buffering),
                          clearInterval(this.timers.playing),
                          null !== this.embed &&
                            o.function(this.embed.destroy) &&
                            this.embed.destroy(),
                          n())
                        : this.isVimeo &&
                          (null !== this.embed && this.embed.unload().then(n),
                          setTimeout(n, 200));
                  }
                },
              },
              {
                key: "supports",
                value: function (e) {
                  return D.mime.call(this, e);
                },
              },
              {
                key: "isHTML5",
                get: function () {
                  return Boolean(this.provider === ue.html5);
                },
              },
              {
                key: "isEmbed",
                get: function () {
                  return Boolean(this.isYouTube || this.isVimeo);
                },
              },
              {
                key: "isYouTube",
                get: function () {
                  return Boolean(this.provider === ue.youtube);
                },
              },
              {
                key: "isVimeo",
                get: function () {
                  return Boolean(this.provider === ue.vimeo);
                },
              },
              {
                key: "isVideo",
                get: function () {
                  return Boolean(this.type === de.video);
                },
              },
              {
                key: "isAudio",
                get: function () {
                  return Boolean(this.type === de.audio);
                },
              },
              {
                key: "playing",
                get: function () {
                  return Boolean(this.ready && !this.paused && !this.ended);
                },
              },
              {
                key: "paused",
                get: function () {
                  return Boolean(this.media.paused);
                },
              },
              {
                key: "stopped",
                get: function () {
                  return Boolean(this.paused && 0 === this.currentTime);
                },
              },
              {
                key: "ended",
                get: function () {
                  return Boolean(this.media.ended);
                },
              },
              {
                key: "currentTime",
                set: function (e) {
                  if (this.duration) {
                    var t = o.number(e) && e > 0;
                    (this.media.currentTime = t
                      ? Math.min(e, this.duration)
                      : 0),
                      this.debug.log(
                        "Seeking to " + this.currentTime + " seconds"
                      );
                  }
                },
                get: function () {
                  return Number(this.media.currentTime);
                },
              },
              {
                key: "buffered",
                get: function () {
                  var e = this.media.buffered;
                  return o.number(e)
                    ? e
                    : e && e.length && this.duration > 0
                    ? e.end(0) / this.duration
                    : 0;
                },
              },
              {
                key: "seeking",
                get: function () {
                  return Boolean(this.media.seeking);
                },
              },
              {
                key: "duration",
                get: function () {
                  var e = parseFloat(this.config.duration),
                    t = (this.media || {}).duration,
                    i = o.number(t) && t !== 1 / 0 ? t : 0;
                  return e || i;
                },
              },
              {
                key: "volume",
                set: function (e) {
                  var t = e;
                  o.string(t) && (t = Number(t)),
                    o.number(t) || (t = this.storage.get("volume")),
                    o.number(t) || (t = this.config.volume),
                    t > 1 && (t = 1),
                    t < 0 && (t = 0),
                    (this.config.volume = t),
                    (this.media.volume = t),
                    !o.empty(e) && this.muted && t > 0 && (this.muted = !1);
                },
                get: function () {
                  return Number(this.media.volume);
                },
              },
              {
                key: "muted",
                set: function (e) {
                  var t = e;
                  o.boolean(t) || (t = this.storage.get("muted")),
                    o.boolean(t) || (t = this.config.muted),
                    (this.config.muted = t),
                    (this.media.muted = t);
                },
                get: function () {
                  return Boolean(this.media.muted);
                },
              },
              {
                key: "hasAudio",
                get: function () {
                  return (
                    !this.isHTML5 ||
                    !!this.isAudio ||
                    Boolean(this.media.mozHasAudio) ||
                    Boolean(this.media.webkitAudioDecodedByteCount) ||
                    Boolean(
                      this.media.audioTracks && this.media.audioTracks.length
                    )
                  );
                },
              },
              {
                key: "speed",
                set: function (e) {
                  var t = null;
                  o.number(e) && (t = e),
                    o.number(t) || (t = this.storage.get("speed")),
                    o.number(t) || (t = this.config.speed.selected),
                    t < 0.1 && (t = 0.1),
                    t > 2 && (t = 2),
                    this.config.speed.options.includes(t)
                      ? ((this.config.speed.selected = t),
                        (this.media.playbackRate = t))
                      : this.debug.warn("Unsupported speed (" + t + ")");
                },
                get: function () {
                  return Number(this.media.playbackRate);
                },
              },
              {
                key: "quality",
                set: function (e) {
                  var t = this.config.quality,
                    i = this.options.quality;
                  if (i.length) {
                    var n = [
                      !o.empty(e) && Number(e),
                      this.storage.get("quality"),
                      t.selected,
                      t.default,
                    ].find(o.number);
                    if (!i.includes(n)) {
                      var a = (function (e, t) {
                        return o.array(e) && e.length
                          ? e.reduce(function (e, i) {
                              return Math.abs(i - t) < Math.abs(e - t) ? i : e;
                            })
                          : null;
                      })(i, n);
                      this.debug.warn(
                        "Unsupported quality option: " +
                          n +
                          ", using " +
                          a +
                          " instead"
                      ),
                        (n = a);
                    }
                    m.call(this, this.media, "qualityrequested", !1, {
                      quality: n,
                    }),
                      (t.selected = n),
                      (this.media.quality = n);
                  }
                },
                get: function () {
                  return this.media.quality;
                },
              },
              {
                key: "loop",
                set: function (e) {
                  var t = o.boolean(e) ? e : this.config.loop.active;
                  (this.config.loop.active = t), (this.media.loop = t);
                },
                get: function () {
                  return Boolean(this.media.loop);
                },
              },
              {
                key: "source",
                set: function (e) {
                  xe.change.call(this, e);
                },
                get: function () {
                  return this.media.currentSrc;
                },
              },
              {
                key: "poster",
                set: function (e) {
                  this.isVideo
                    ? ve.setPoster.call(this, e, !1).catch(function () {})
                    : this.debug.warn("Poster can only be set for video");
                },
                get: function () {
                  return this.isVideo
                    ? this.media.getAttribute("poster")
                    : null;
                },
              },
              {
                key: "autoplay",
                set: function (e) {
                  var t = o.boolean(e) ? e : this.config.autoplay;
                  this.config.autoplay = t;
                },
                get: function () {
                  return Boolean(this.config.autoplay);
                },
              },
              {
                key: "currentTrack",
                set: function (e) {
                  oe.set.call(this, e, !1);
                },
                get: function () {
                  var e = this.captions,
                    t = e.toggled,
                    i = e.currentTrack;
                  return t ? i : -1;
                },
              },
              {
                key: "language",
                set: function (e) {
                  oe.setLanguage.call(this, e, !1);
                },
                get: function () {
                  return (oe.getCurrentTrack.call(this) || {}).language;
                },
              },
              {
                key: "pip",
                set: function (e) {
                  var t = "picture-in-picture",
                    i = "inline";
                  if (D.pip) {
                    var n = o.boolean(e) ? e : this.pip === i;
                    this.media.webkitSetPresentationMode(n ? t : i);
                  }
                },
                get: function () {
                  return D.pip ? this.media.webkitPresentationMode : null;
                },
              },
            ],
            [
              {
                key: "supported",
                value: function (e, t, i) {
                  return D.check(e, t, i);
                },
              },
              {
                key: "loadSprite",
                value: function (e, t) {
                  return ee(e, t);
                },
              },
              {
                key: "setup",
                value: function (t) {
                  var i =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : {},
                    n = null;
                  return (
                    o.string(t)
                      ? (n = Array.from(document.querySelectorAll(t)))
                      : o.nodeList(t)
                      ? (n = Array.from(t))
                      : o.array(t) && (n = t.filter(o.element)),
                    o.empty(n)
                      ? null
                      : n.map(function (t) {
                          return new e(t, i);
                        })
                  );
                },
              },
            ]
          ),
          e
        );
      })();
    return (_e.defaults = ((Pe = ce), JSON.parse(JSON.stringify(Pe)))), _e;
  });
/*-----------------------------------------------------------------------------------*/
/*	08. LIGHTGALLERY
/*-----------------------------------------------------------------------------------*/
/*! lightgallery - v1.6.12 - 2019-02-19
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2019 Sachin N; Licensed GPLv3 */
!(function (a, b) {
  "function" == typeof define && define.amd
    ? define(["jquery"], function (a) {
        return b(a);
      })
    : "object" == typeof module && module.exports
    ? (module.exports = b(require("jquery")))
    : b(a.jQuery);
})(this, function (a) {
  !(function () {
    "use strict";
    function b(b, d) {
      if (
        ((this.el = b),
        (this.$el = a(b)),
        (this.s = a.extend({}, c, d)),
        this.s.dynamic &&
          "undefined" !== this.s.dynamicEl &&
          this.s.dynamicEl.constructor === Array &&
          !this.s.dynamicEl.length)
      )
        throw "When using dynamic mode, you must also define dynamicEl as an Array.";
      return (
        (this.modules = {}),
        (this.lGalleryOn = !1),
        (this.lgBusy = !1),
        (this.hideBartimeout = !1),
        (this.isTouch = "ontouchstart" in document.documentElement),
        this.s.slideEndAnimatoin && (this.s.hideControlOnEnd = !1),
        this.s.dynamic
          ? (this.$items = this.s.dynamicEl)
          : "this" === this.s.selector
          ? (this.$items = this.$el)
          : "" !== this.s.selector
          ? this.s.selectWithin
            ? (this.$items = a(this.s.selectWithin).find(this.s.selector))
            : (this.$items = this.$el.find(a(this.s.selector)))
          : (this.$items = this.$el.children()),
        (this.$slide = ""),
        (this.$outer = ""),
        this.init(),
        this
      );
    }
    var c = {
      mode: "lg-slide",
      cssEasing: "ease",
      easing: "linear",
      speed: 600,
      height: "100%",
      width: "100%",
      addClass: "",
      startClass: "lg-start-zoom",
      backdropDuration: 150,
      hideBarsDelay: 6e3,
      useLeft: !1,
      closable: !0,
      loop: !0,
      escKey: !0,
      keyPress: !0,
      controls: !0,
      slideEndAnimatoin: !0,
      hideControlOnEnd: !1,
      mousewheel: !0,
      getCaptionFromTitleOrAlt: !0,
      appendSubHtmlTo: ".lg-sub-html",
      subHtmlSelectorRelative: !1,
      preload: 1,
      showAfterLoad: !0,
      selector: "",
      selectWithin: "",
      nextHtml: "",
      prevHtml: "",
      index: !1,
      iframeMaxWidth: "100%",
      download: !0,
      counter: !0,
      appendCounterTo: ".lg-toolbar",
      swipeThreshold: 50,
      enableSwipe: !0,
      enableDrag: !0,
      dynamic: !1,
      dynamicEl: [],
      galleryId: 1,
    };
    (b.prototype.init = function () {
      var b = this;
      b.s.preload > b.$items.length && (b.s.preload = b.$items.length);
      var c = window.location.hash;
      c.indexOf("lg=" + this.s.galleryId) > 0 &&
        ((b.index = parseInt(c.split("&slide=")[1], 10)),
        a("body").addClass("lg-from-hash"),
        a("body").hasClass("lg-on") ||
          (setTimeout(function () {
            b.build(b.index);
          }),
          a("body").addClass("lg-on"))),
        b.s.dynamic
          ? (b.$el.trigger("onBeforeOpen.lg"),
            (b.index = b.s.index || 0),
            a("body").hasClass("lg-on") ||
              setTimeout(function () {
                b.build(b.index), a("body").addClass("lg-on");
              }))
          : b.$items.on("click.lgcustom", function (c) {
              try {
                c.preventDefault(), c.preventDefault();
              } catch (a) {
                c.returnValue = !1;
              }
              b.$el.trigger("onBeforeOpen.lg"),
                (b.index = b.s.index || b.$items.index(this)),
                a("body").hasClass("lg-on") ||
                  (b.build(b.index), a("body").addClass("lg-on"));
            });
    }),
      (b.prototype.build = function (b) {
        var c = this;
        c.structure(),
          a.each(a.fn.lightGallery.modules, function (b) {
            c.modules[b] = new a.fn.lightGallery.modules[b](c.el);
          }),
          c.slide(b, !1, !1, !1),
          c.s.keyPress && c.keyPress(),
          c.$items.length > 1
            ? (c.arrow(),
              setTimeout(function () {
                c.enableDrag(), c.enableSwipe();
              }, 50),
              c.s.mousewheel && c.mousewheel())
            : c.$slide.on("click.lg", function () {
                c.$el.trigger("onSlideClick.lg");
              }),
          c.counter(),
          c.closeGallery(),
          c.$el.trigger("onAfterOpen.lg"),
          c.$outer.on("mousemove.lg click.lg touchstart.lg", function () {
            c.$outer.removeClass("lg-hide-items"),
              clearTimeout(c.hideBartimeout),
              (c.hideBartimeout = setTimeout(function () {
                c.$outer.addClass("lg-hide-items");
              }, c.s.hideBarsDelay));
          }),
          c.$outer.trigger("mousemove.lg");
      }),
      (b.prototype.structure = function () {
        var b,
          c = "",
          d = "",
          e = 0,
          f = "",
          g = this;
        for (
          a("body").append('<div class="lg-backdrop"></div>'),
            a(".lg-backdrop").css(
              "transition-duration",
              this.s.backdropDuration + "ms"
            ),
            e = 0;
          e < this.$items.length;
          e++
        )
          c += '<div class="lg-item"></div>';
        if (
          (this.s.controls &&
            this.$items.length > 1 &&
            (d =
              '<div class="lg-actions"><button class="lg-prev lg-icon">' +
              this.s.prevHtml +
              '</button><button class="lg-next lg-icon">' +
              this.s.nextHtml +
              "</button></div>"),
          ".lg-sub-html" === this.s.appendSubHtmlTo &&
            (f = '<div class="lg-sub-html"></div>'),
          (b =
            '<div class="lg-outer ' +
            this.s.addClass +
            " " +
            this.s.startClass +
            '"><div class="lg" style="width:' +
            this.s.width +
            "; height:" +
            this.s.height +
            '"><div class="lg-inner">' +
            c +
            '</div><div class="lg-toolbar lg-group"><span class="lg-close lg-icon"></span></div>' +
            d +
            f +
            "</div></div>"),
          a("body").append(b),
          (this.$outer = a(".lg-outer")),
          (this.$slide = this.$outer.find(".lg-item")),
          this.s.useLeft
            ? (this.$outer.addClass("lg-use-left"), (this.s.mode = "lg-slide"))
            : this.$outer.addClass("lg-use-css3"),
          g.setTop(),
          a(window).on("resize.lg orientationchange.lg", function () {
            setTimeout(function () {
              g.setTop();
            }, 100);
          }),
          this.$slide.eq(this.index).addClass("lg-current"),
          this.doCss()
            ? this.$outer.addClass("lg-css3")
            : (this.$outer.addClass("lg-css"), (this.s.speed = 0)),
          this.$outer.addClass(this.s.mode),
          this.s.enableDrag &&
            this.$items.length > 1 &&
            this.$outer.addClass("lg-grab"),
          this.s.showAfterLoad && this.$outer.addClass("lg-show-after-load"),
          this.doCss())
        ) {
          var h = this.$outer.find(".lg-inner");
          h.css("transition-timing-function", this.s.cssEasing),
            h.css("transition-duration", this.s.speed + "ms");
        }
        setTimeout(function () {
          a(".lg-backdrop").addClass("in");
        }),
          setTimeout(function () {
            g.$outer.addClass("lg-visible");
          }, this.s.backdropDuration),
          this.s.download &&
            this.$outer
              .find(".lg-toolbar")
              .append(
                '<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>'
              ),
          (this.prevScrollTop = a(window).scrollTop());
      }),
      (b.prototype.setTop = function () {
        if ("100%" !== this.s.height) {
          var b = a(window).height(),
            c = (b - parseInt(this.s.height, 10)) / 2,
            d = this.$outer.find(".lg");
          b >= parseInt(this.s.height, 10)
            ? d.css("top", c + "px")
            : d.css("top", "0px");
        }
      }),
      (b.prototype.doCss = function () {
        return !!(function () {
          var a = [
              "transition",
              "MozTransition",
              "WebkitTransition",
              "OTransition",
              "msTransition",
              "KhtmlTransition",
            ],
            b = document.documentElement,
            c = 0;
          for (c = 0; c < a.length; c++) if (a[c] in b.style) return !0;
        })();
      }),
      (b.prototype.isVideo = function (a, b) {
        var c;
        if (
          ((c = this.s.dynamic
            ? this.s.dynamicEl[b].html
            : this.$items.eq(b).attr("data-html")),
          !a)
        )
          return c
            ? { html5: !0 }
            : (console.error(
                "lightGallery :- data-src is not pvovided on slide item " +
                  (b + 1) +
                  ". Please make sure the selector property is properly configured. More info - http://sachinchoolur.github.io/lightGallery/demos/html-markup.html"
              ),
              !1);
        var d = a.match(
            /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i
          ),
          e = a.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),
          f = a.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),
          g = a.match(
            /\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i
          );
        return d
          ? { youtube: d }
          : e
          ? { vimeo: e }
          : f
          ? { dailymotion: f }
          : g
          ? { vk: g }
          : void 0;
      }),
      (b.prototype.counter = function () {
        this.s.counter &&
          a(this.s.appendCounterTo).append(
            '<div id="lg-counter"><span id="lg-counter-current">' +
              (parseInt(this.index, 10) + 1) +
              '</span> / <span id="lg-counter-all">' +
              this.$items.length +
              "</span></div>"
          );
      }),
      (b.prototype.addHtml = function (b) {
        var c,
          d,
          e = null;
        if (
          (this.s.dynamic
            ? this.s.dynamicEl[b].subHtmlUrl
              ? (c = this.s.dynamicEl[b].subHtmlUrl)
              : (e = this.s.dynamicEl[b].subHtml)
            : ((d = this.$items.eq(b)),
              d.attr("data-sub-html-url")
                ? (c = d.attr("data-sub-html-url"))
                : ((e = d.attr("data-sub-html")),
                  this.s.getCaptionFromTitleOrAlt &&
                    !e &&
                    (e =
                      d.attr("title") || d.find("img").first().attr("alt")))),
          !c)
        )
          if (void 0 !== e && null !== e) {
            var f = e.substring(0, 1);
            ("." !== f && "#" !== f) ||
              (e =
                this.s.subHtmlSelectorRelative && !this.s.dynamic
                  ? d.find(e).html()
                  : a(e).html());
          } else e = "";
        ".lg-sub-html" === this.s.appendSubHtmlTo
          ? c
            ? this.$outer.find(this.s.appendSubHtmlTo).load(c)
            : this.$outer.find(this.s.appendSubHtmlTo).html(e)
          : c
          ? this.$slide.eq(b).load(c)
          : this.$slide.eq(b).append(e),
          void 0 !== e &&
            null !== e &&
            ("" === e
              ? this.$outer
                  .find(this.s.appendSubHtmlTo)
                  .addClass("lg-empty-html")
              : this.$outer
                  .find(this.s.appendSubHtmlTo)
                  .removeClass("lg-empty-html")),
          this.$el.trigger("onAfterAppendSubHtml.lg", [b]);
      }),
      (b.prototype.preload = function (a) {
        var b = 1,
          c = 1;
        for (b = 1; b <= this.s.preload && !(b >= this.$items.length - a); b++)
          this.loadContent(a + b, !1, 0);
        for (c = 1; c <= this.s.preload && !(a - c < 0); c++)
          this.loadContent(a - c, !1, 0);
      }),
      (b.prototype.loadContent = function (b, c, d) {
        var e,
          f,
          g,
          h,
          i,
          j,
          k = this,
          l = !1,
          m = function (b) {
            for (var c = [], d = [], e = 0; e < b.length; e++) {
              var g = b[e].split(" ");
              "" === g[0] && g.splice(0, 1), d.push(g[0]), c.push(g[1]);
            }
            for (var h = a(window).width(), i = 0; i < c.length; i++)
              if (parseInt(c[i], 10) > h) {
                f = d[i];
                break;
              }
          };
        if (k.s.dynamic) {
          if (
            (k.s.dynamicEl[b].poster &&
              ((l = !0), (g = k.s.dynamicEl[b].poster)),
            (j = k.s.dynamicEl[b].html),
            (f = k.s.dynamicEl[b].src),
            k.s.dynamicEl[b].responsive)
          ) {
            m(k.s.dynamicEl[b].responsive.split(","));
          }
          (h = k.s.dynamicEl[b].srcset), (i = k.s.dynamicEl[b].sizes);
        } else {
          if (
            (k.$items.eq(b).attr("data-poster") &&
              ((l = !0), (g = k.$items.eq(b).attr("data-poster"))),
            (j = k.$items.eq(b).attr("data-html")),
            (f =
              k.$items.eq(b).attr("href") || k.$items.eq(b).attr("data-src")),
            k.$items.eq(b).attr("data-responsive"))
          ) {
            m(k.$items.eq(b).attr("data-responsive").split(","));
          }
          (h = k.$items.eq(b).attr("data-srcset")),
            (i = k.$items.eq(b).attr("data-sizes"));
        }
        var n = !1;
        k.s.dynamic
          ? k.s.dynamicEl[b].iframe && (n = !0)
          : "true" === k.$items.eq(b).attr("data-iframe") && (n = !0);
        var o = k.isVideo(f, b);
        if (!k.$slide.eq(b).hasClass("lg-loaded")) {
          if (n)
            k.$slide
              .eq(b)
              .prepend(
                '<div class="lg-video-cont lg-has-iframe" style="max-width:' +
                  k.s.iframeMaxWidth +
                  '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' +
                  f +
                  '"  allowfullscreen="true"></iframe></div></div>'
              );
          else if (l) {
            var p = "";
            (p =
              o && o.youtube
                ? "lg-has-youtube"
                : o && o.vimeo
                ? "lg-has-vimeo"
                : "lg-has-html5"),
              k.$slide
                .eq(b)
                .prepend(
                  '<div class="lg-video-cont ' +
                    p +
                    ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' +
                    g +
                    '" /></div></div>'
                );
          } else
            o
              ? (k.$slide
                  .eq(b)
                  .prepend(
                    '<div class="lg-video-cont "><div class="lg-video"></div></div>'
                  ),
                k.$el.trigger("hasVideo.lg", [b, f, j]))
              : k.$slide
                  .eq(b)
                  .prepend(
                    '<div class="lg-img-wrap"><img class="lg-object lg-image" src="' +
                      f +
                      '" /></div>'
                  );
          if (
            (k.$el.trigger("onAferAppendSlide.lg", [b]),
            (e = k.$slide.eq(b).find(".lg-object")),
            i && e.attr("sizes", i),
            h)
          ) {
            e.attr("srcset", h);
            try {
              picturefill({ elements: [e[0]] });
            } catch (a) {
              console.warn(
                "lightGallery :- If you want srcset to be supported for older browser please include picturefil version 2 javascript library in your document."
              );
            }
          }
          ".lg-sub-html" !== this.s.appendSubHtmlTo && k.addHtml(b),
            k.$slide.eq(b).addClass("lg-loaded");
        }
        k.$slide
          .eq(b)
          .find(".lg-object")
          .on("load.lg error.lg", function () {
            var c = 0;
            d && !a("body").hasClass("lg-from-hash") && (c = d),
              setTimeout(function () {
                k.$slide.eq(b).addClass("lg-complete"),
                  k.$el.trigger("onSlideItemLoad.lg", [b, d || 0]);
              }, c);
          }),
          o && o.html5 && !l && k.$slide.eq(b).addClass("lg-complete"),
          !0 === c &&
            (k.$slide.eq(b).hasClass("lg-complete")
              ? k.preload(b)
              : k.$slide
                  .eq(b)
                  .find(".lg-object")
                  .on("load.lg error.lg", function () {
                    k.preload(b);
                  }));
      }),
      (b.prototype.slide = function (b, c, d, e) {
        var f = this.$outer.find(".lg-current").index(),
          g = this;
        if (!g.lGalleryOn || f !== b) {
          var h = this.$slide.length,
            i = g.lGalleryOn ? this.s.speed : 0;
          if (!g.lgBusy) {
            if (this.s.download) {
              var j;
              (j = g.s.dynamic
                ? !1 !== g.s.dynamicEl[b].downloadUrl &&
                  (g.s.dynamicEl[b].downloadUrl || g.s.dynamicEl[b].src)
                : "false" !== g.$items.eq(b).attr("data-download-url") &&
                  (g.$items.eq(b).attr("data-download-url") ||
                    g.$items.eq(b).attr("href") ||
                    g.$items.eq(b).attr("data-src"))),
                j
                  ? (a("#lg-download").attr("href", j),
                    g.$outer.removeClass("lg-hide-download"))
                  : g.$outer.addClass("lg-hide-download");
            }
            if (
              (this.$el.trigger("onBeforeSlide.lg", [f, b, c, d]),
              (g.lgBusy = !0),
              clearTimeout(g.hideBartimeout),
              ".lg-sub-html" === this.s.appendSubHtmlTo &&
                setTimeout(function () {
                  g.addHtml(b);
                }, i),
              this.arrowDisable(b),
              e || (b < f ? (e = "prev") : b > f && (e = "next")),
              c)
            ) {
              this.$slide.removeClass("lg-prev-slide lg-current lg-next-slide");
              var k, l;
              h > 2
                ? ((k = b - 1),
                  (l = b + 1),
                  0 === b && f === h - 1
                    ? ((l = 0), (k = h - 1))
                    : b === h - 1 && 0 === f && ((l = 0), (k = h - 1)))
                : ((k = 0), (l = 1)),
                "prev" === e
                  ? g.$slide.eq(l).addClass("lg-next-slide")
                  : g.$slide.eq(k).addClass("lg-prev-slide"),
                g.$slide.eq(b).addClass("lg-current");
            } else
              g.$outer.addClass("lg-no-trans"),
                this.$slide.removeClass("lg-prev-slide lg-next-slide"),
                "prev" === e
                  ? (this.$slide.eq(b).addClass("lg-prev-slide"),
                    this.$slide.eq(f).addClass("lg-next-slide"))
                  : (this.$slide.eq(b).addClass("lg-next-slide"),
                    this.$slide.eq(f).addClass("lg-prev-slide")),
                setTimeout(function () {
                  g.$slide.removeClass("lg-current"),
                    g.$slide.eq(b).addClass("lg-current"),
                    g.$outer.removeClass("lg-no-trans");
                }, 50);
            g.lGalleryOn
              ? (setTimeout(function () {
                  g.loadContent(b, !0, 0);
                }, this.s.speed + 50),
                setTimeout(function () {
                  (g.lgBusy = !1),
                    g.$el.trigger("onAfterSlide.lg", [f, b, c, d]);
                }, this.s.speed))
              : (g.loadContent(b, !0, g.s.backdropDuration),
                (g.lgBusy = !1),
                g.$el.trigger("onAfterSlide.lg", [f, b, c, d])),
              (g.lGalleryOn = !0),
              this.s.counter && a("#lg-counter-current").text(b + 1);
          }
          g.index = b;
        }
      }),
      (b.prototype.goToNextSlide = function (a) {
        var b = this,
          c = b.s.loop;
        a && b.$slide.length < 3 && (c = !1),
          b.lgBusy ||
            (b.index + 1 < b.$slide.length
              ? (b.index++,
                b.$el.trigger("onBeforeNextSlide.lg", [b.index]),
                b.slide(b.index, a, !1, "next"))
              : c
              ? ((b.index = 0),
                b.$el.trigger("onBeforeNextSlide.lg", [b.index]),
                b.slide(b.index, a, !1, "next"))
              : b.s.slideEndAnimatoin &&
                !a &&
                (b.$outer.addClass("lg-right-end"),
                setTimeout(function () {
                  b.$outer.removeClass("lg-right-end");
                }, 400)));
      }),
      (b.prototype.goToPrevSlide = function (a) {
        var b = this,
          c = b.s.loop;
        a && b.$slide.length < 3 && (c = !1),
          b.lgBusy ||
            (b.index > 0
              ? (b.index--,
                b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]),
                b.slide(b.index, a, !1, "prev"))
              : c
              ? ((b.index = b.$items.length - 1),
                b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]),
                b.slide(b.index, a, !1, "prev"))
              : b.s.slideEndAnimatoin &&
                !a &&
                (b.$outer.addClass("lg-left-end"),
                setTimeout(function () {
                  b.$outer.removeClass("lg-left-end");
                }, 400)));
      }),
      (b.prototype.keyPress = function () {
        var b = this;
        this.$items.length > 1 &&
          a(window).on("keyup.lg", function (a) {
            b.$items.length > 1 &&
              (37 === a.keyCode && (a.preventDefault(), b.goToPrevSlide()),
              39 === a.keyCode && (a.preventDefault(), b.goToNextSlide()));
          }),
          a(window).on("keydown.lg", function (a) {
            !0 === b.s.escKey &&
              27 === a.keyCode &&
              (a.preventDefault(),
              b.$outer.hasClass("lg-thumb-open")
                ? b.$outer.removeClass("lg-thumb-open")
                : b.destroy());
          });
      }),
      (b.prototype.arrow = function () {
        var a = this;
        this.$outer.find(".lg-prev").on("click.lg", function () {
          a.goToPrevSlide();
        }),
          this.$outer.find(".lg-next").on("click.lg", function () {
            a.goToNextSlide();
          });
      }),
      (b.prototype.arrowDisable = function (a) {
        !this.s.loop &&
          this.s.hideControlOnEnd &&
          (a + 1 < this.$slide.length
            ? this.$outer
                .find(".lg-next")
                .removeAttr("disabled")
                .removeClass("disabled")
            : this.$outer
                .find(".lg-next")
                .attr("disabled", "disabled")
                .addClass("disabled"),
          a > 0
            ? this.$outer
                .find(".lg-prev")
                .removeAttr("disabled")
                .removeClass("disabled")
            : this.$outer
                .find(".lg-prev")
                .attr("disabled", "disabled")
                .addClass("disabled"));
      }),
      (b.prototype.setTranslate = function (a, b, c) {
        this.s.useLeft
          ? a.css("left", b)
          : a.css({ transform: "translate3d(" + b + "px, " + c + "px, 0px)" });
      }),
      (b.prototype.touchMove = function (b, c) {
        var d = c - b;
        Math.abs(d) > 15 &&
          (this.$outer.addClass("lg-dragging"),
          this.setTranslate(this.$slide.eq(this.index), d, 0),
          this.setTranslate(
            a(".lg-prev-slide"),
            -this.$slide.eq(this.index).width() + d,
            0
          ),
          this.setTranslate(
            a(".lg-next-slide"),
            this.$slide.eq(this.index).width() + d,
            0
          ));
      }),
      (b.prototype.touchEnd = function (a) {
        var b = this;
        "lg-slide" !== b.s.mode && b.$outer.addClass("lg-slide"),
          this.$slide
            .not(".lg-current, .lg-prev-slide, .lg-next-slide")
            .css("opacity", "0"),
          setTimeout(function () {
            b.$outer.removeClass("lg-dragging"),
              a < 0 && Math.abs(a) > b.s.swipeThreshold
                ? b.goToNextSlide(!0)
                : a > 0 && Math.abs(a) > b.s.swipeThreshold
                ? b.goToPrevSlide(!0)
                : Math.abs(a) < 5 && b.$el.trigger("onSlideClick.lg"),
              b.$slide.removeAttr("style");
          }),
          setTimeout(function () {
            b.$outer.hasClass("lg-dragging") ||
              "lg-slide" === b.s.mode ||
              b.$outer.removeClass("lg-slide");
          }, b.s.speed + 100);
      }),
      (b.prototype.enableSwipe = function () {
        var a = this,
          b = 0,
          c = 0,
          d = !1;
        a.s.enableSwipe &&
          a.doCss() &&
          (a.$slide.on("touchstart.lg", function (c) {
            a.$outer.hasClass("lg-zoomed") ||
              a.lgBusy ||
              (c.preventDefault(),
              a.manageSwipeClass(),
              (b = c.originalEvent.targetTouches[0].pageX));
          }),
          a.$slide.on("touchmove.lg", function (e) {
            a.$outer.hasClass("lg-zoomed") ||
              (e.preventDefault(),
              (c = e.originalEvent.targetTouches[0].pageX),
              a.touchMove(b, c),
              (d = !0));
          }),
          a.$slide.on("touchend.lg", function () {
            a.$outer.hasClass("lg-zoomed") ||
              (d
                ? ((d = !1), a.touchEnd(c - b))
                : a.$el.trigger("onSlideClick.lg"));
          }));
      }),
      (b.prototype.enableDrag = function () {
        var b = this,
          c = 0,
          d = 0,
          e = !1,
          f = !1;
        b.s.enableDrag &&
          b.doCss() &&
          (b.$slide.on("mousedown.lg", function (d) {
            b.$outer.hasClass("lg-zoomed") ||
              b.lgBusy ||
              a(d.target).text().trim() ||
              (d.preventDefault(),
              b.manageSwipeClass(),
              (c = d.pageX),
              (e = !0),
              (b.$outer.scrollLeft += 1),
              (b.$outer.scrollLeft -= 1),
              b.$outer.removeClass("lg-grab").addClass("lg-grabbing"),
              b.$el.trigger("onDragstart.lg"));
          }),
          a(window).on("mousemove.lg", function (a) {
            e &&
              ((f = !0),
              (d = a.pageX),
              b.touchMove(c, d),
              b.$el.trigger("onDragmove.lg"));
          }),
          a(window).on("mouseup.lg", function (g) {
            f
              ? ((f = !1), b.touchEnd(d - c), b.$el.trigger("onDragend.lg"))
              : (a(g.target).hasClass("lg-object") ||
                  a(g.target).hasClass("lg-video-play")) &&
                b.$el.trigger("onSlideClick.lg"),
              e &&
                ((e = !1),
                b.$outer.removeClass("lg-grabbing").addClass("lg-grab"));
          }));
      }),
      (b.prototype.manageSwipeClass = function () {
        var a = this.index + 1,
          b = this.index - 1;
        this.s.loop &&
          this.$slide.length > 2 &&
          (0 === this.index
            ? (b = this.$slide.length - 1)
            : this.index === this.$slide.length - 1 && (a = 0)),
          this.$slide.removeClass("lg-next-slide lg-prev-slide"),
          b > -1 && this.$slide.eq(b).addClass("lg-prev-slide"),
          this.$slide.eq(a).addClass("lg-next-slide");
      }),
      (b.prototype.mousewheel = function () {
        var a = this;
        a.$outer.on("mousewheel.lg", function (b) {
          b.deltaY &&
            (b.deltaY > 0 ? a.goToPrevSlide() : a.goToNextSlide(),
            b.preventDefault());
        });
      }),
      (b.prototype.closeGallery = function () {
        var b = this,
          c = !1;
        this.$outer.find(".lg-close").on("click.lg", function () {
          b.destroy();
        }),
          b.s.closable &&
            (b.$outer.on("mousedown.lg", function (b) {
              c = !!(
                a(b.target).is(".lg-outer") ||
                a(b.target).is(".lg-item ") ||
                a(b.target).is(".lg-img-wrap")
              );
            }),
            b.$outer.on("mousemove.lg", function () {
              c = !1;
            }),
            b.$outer.on("mouseup.lg", function (d) {
              (a(d.target).is(".lg-outer") ||
                a(d.target).is(".lg-item ") ||
                (a(d.target).is(".lg-img-wrap") && c)) &&
                (b.$outer.hasClass("lg-dragging") || b.destroy());
            }));
      }),
      (b.prototype.destroy = function (b) {
        var c = this;
        b ||
          (c.$el.trigger("onBeforeClose.lg"),
          a(window).scrollTop(c.prevScrollTop)),
          b &&
            (c.s.dynamic || this.$items.off("click.lg click.lgcustom"),
            a.removeData(c.el, "lightGallery")),
          this.$el.off(".lg.tm"),
          a.each(a.fn.lightGallery.modules, function (a) {
            c.modules[a] && c.modules[a].destroy();
          }),
          (this.lGalleryOn = !1),
          clearTimeout(c.hideBartimeout),
          (this.hideBartimeout = !1),
          a(window).off(".lg"),
          a("body").removeClass("lg-on lg-from-hash"),
          c.$outer && c.$outer.removeClass("lg-visible"),
          a(".lg-backdrop").removeClass("in"),
          setTimeout(function () {
            c.$outer && c.$outer.remove(),
              a(".lg-backdrop").remove(),
              b || c.$el.trigger("onCloseAfter.lg");
          }, c.s.backdropDuration + 50);
      }),
      (a.fn.lightGallery = function (c) {
        return this.each(function () {
          if (a.data(this, "lightGallery"))
            try {
              a(this).data("lightGallery").init();
            } catch (a) {
              console.error("lightGallery has not initiated properly");
            }
          else a.data(this, "lightGallery", new b(this, c));
        });
      }),
      (a.fn.lightGallery.modules = {});
  })();
}),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = {
          autoplay: !1,
          pause: 5e3,
          progressBar: !0,
          fourceAutoplay: !1,
          autoplayControls: !0,
          appendAutoplayControlsTo: ".lg-toolbar",
        },
        c = function (c) {
          return (
            (this.core = a(c).data("lightGallery")),
            (this.$el = a(c)),
            !(this.core.$items.length < 2) &&
              ((this.core.s = a.extend({}, b, this.core.s)),
              (this.interval = !1),
              (this.fromAuto = !0),
              (this.canceledOnTouch = !1),
              (this.fourceAutoplayTemp = this.core.s.fourceAutoplay),
              this.core.doCss() || (this.core.s.progressBar = !1),
              this.init(),
              this)
          );
        };
      (c.prototype.init = function () {
        var a = this;
        a.core.s.autoplayControls && a.controls(),
          a.core.s.progressBar &&
            a.core.$outer
              .find(".lg")
              .append(
                '<div class="lg-progress-bar"><div class="lg-progress"></div></div>'
              ),
          a.progress(),
          a.core.s.autoplay &&
            a.$el.one("onSlideItemLoad.lg.tm", function () {
              a.startlAuto();
            }),
          a.$el.on("onDragstart.lg.tm touchstart.lg.tm", function () {
            a.interval && (a.cancelAuto(), (a.canceledOnTouch = !0));
          }),
          a.$el.on(
            "onDragend.lg.tm touchend.lg.tm onSlideClick.lg.tm",
            function () {
              !a.interval &&
                a.canceledOnTouch &&
                (a.startlAuto(), (a.canceledOnTouch = !1));
            }
          );
      }),
        (c.prototype.progress = function () {
          var a,
            b,
            c = this;
          c.$el.on("onBeforeSlide.lg.tm", function () {
            c.core.s.progressBar &&
              c.fromAuto &&
              ((a = c.core.$outer.find(".lg-progress-bar")),
              (b = c.core.$outer.find(".lg-progress")),
              c.interval &&
                (b.removeAttr("style"),
                a.removeClass("lg-start"),
                setTimeout(function () {
                  b.css(
                    "transition",
                    "width " + (c.core.s.speed + c.core.s.pause) + "ms ease 0s"
                  ),
                    a.addClass("lg-start");
                }, 20))),
              c.fromAuto || c.core.s.fourceAutoplay || c.cancelAuto(),
              (c.fromAuto = !1);
          });
        }),
        (c.prototype.controls = function () {
          var b = this;
          a(this.core.s.appendAutoplayControlsTo).append(
            '<span class="lg-autoplay-button lg-icon"></span>'
          ),
            b.core.$outer
              .find(".lg-autoplay-button")
              .on("click.lg", function () {
                a(b.core.$outer).hasClass("lg-show-autoplay")
                  ? (b.cancelAuto(), (b.core.s.fourceAutoplay = !1))
                  : b.interval ||
                    (b.startlAuto(),
                    (b.core.s.fourceAutoplay = b.fourceAutoplayTemp));
              });
        }),
        (c.prototype.startlAuto = function () {
          var a = this;
          a.core.$outer
            .find(".lg-progress")
            .css(
              "transition",
              "width " + (a.core.s.speed + a.core.s.pause) + "ms ease 0s"
            ),
            a.core.$outer.addClass("lg-show-autoplay"),
            a.core.$outer.find(".lg-progress-bar").addClass("lg-start"),
            (a.interval = setInterval(function () {
              a.core.index + 1 < a.core.$items.length
                ? a.core.index++
                : (a.core.index = 0),
                (a.fromAuto = !0),
                a.core.slide(a.core.index, !1, !1, "next");
            }, a.core.s.speed + a.core.s.pause));
        }),
        (c.prototype.cancelAuto = function () {
          clearInterval(this.interval),
            (this.interval = !1),
            this.core.$outer.find(".lg-progress").removeAttr("style"),
            this.core.$outer.removeClass("lg-show-autoplay"),
            this.core.$outer.find(".lg-progress-bar").removeClass("lg-start");
        }),
        (c.prototype.destroy = function () {
          this.cancelAuto(), this.core.$outer.find(".lg-progress-bar").remove();
        }),
        (a.fn.lightGallery.modules.autoplay = c);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof module && module.exports
      ? (module.exports = b(require("jquery")))
      : b(a.jQuery);
  })(this, function (a) {
    !(function () {
      "use strict";
      function b() {
        return (
          document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        );
      }
      var c = { fullScreen: !0 },
        d = function (b) {
          return (
            (this.core = a(b).data("lightGallery")),
            (this.$el = a(b)),
            (this.core.s = a.extend({}, c, this.core.s)),
            this.init(),
            this
          );
        };
      (d.prototype.init = function () {
        var a = "";
        if (this.core.s.fullScreen) {
          if (
            !(
              document.fullscreenEnabled ||
              document.webkitFullscreenEnabled ||
              document.mozFullScreenEnabled ||
              document.msFullscreenEnabled
            )
          )
            return;
          (a = '<span class="lg-fullscreen lg-icon"></span>'),
            this.core.$outer.find(".lg-toolbar").append(a),
            this.fullScreen();
        }
      }),
        (d.prototype.requestFullscreen = function () {
          var a = document.documentElement;
          a.requestFullscreen
            ? a.requestFullscreen()
            : a.msRequestFullscreen
            ? a.msRequestFullscreen()
            : a.mozRequestFullScreen
            ? a.mozRequestFullScreen()
            : a.webkitRequestFullscreen && a.webkitRequestFullscreen();
        }),
        (d.prototype.exitFullscreen = function () {
          document.exitFullscreen
            ? document.exitFullscreen()
            : document.msExitFullscreen
            ? document.msExitFullscreen()
            : document.mozCancelFullScreen
            ? document.mozCancelFullScreen()
            : document.webkitExitFullscreen && document.webkitExitFullscreen();
        }),
        (d.prototype.fullScreen = function () {
          var c = this;
          a(document).on(
            "fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg",
            function () {
              c.core.$outer.toggleClass("lg-fullscreen-on");
            }
          ),
            this.core.$outer.find(".lg-fullscreen").on("click.lg", function () {
              b() ? c.exitFullscreen() : c.requestFullscreen();
            });
        }),
        (d.prototype.destroy = function () {
          b() && this.exitFullscreen(),
            a(document).off(
              "fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg"
            );
        }),
        (a.fn.lightGallery.modules.fullscreen = d);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = { pager: !1 },
        c = function (c) {
          return (
            (this.core = a(c).data("lightGallery")),
            (this.$el = a(c)),
            (this.core.s = a.extend({}, b, this.core.s)),
            this.core.s.pager && this.core.$items.length > 1 && this.init(),
            this
          );
        };
      (c.prototype.init = function () {
        var b,
          c,
          d,
          e = this,
          f = "";
        if (
          (e.core.$outer
            .find(".lg")
            .append('<div class="lg-pager-outer"></div>'),
          e.core.s.dynamic)
        )
          for (var g = 0; g < e.core.s.dynamicEl.length; g++)
            f +=
              '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' +
              e.core.s.dynamicEl[g].thumb +
              '" /></div></span>';
        else
          e.core.$items.each(function () {
            e.core.s.exThumbImage
              ? (f +=
                  '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' +
                  a(this).attr(e.core.s.exThumbImage) +
                  '" /></div></span>')
              : (f +=
                  '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' +
                  a(this).find("img").attr("src") +
                  '" /></div></span>');
          });
        (c = e.core.$outer.find(".lg-pager-outer")),
          c.html(f),
          (b = e.core.$outer.find(".lg-pager-cont")),
          b.on("click.lg touchend.lg", function () {
            var b = a(this);
            (e.core.index = b.index()), e.core.slide(e.core.index, !1, !0, !1);
          }),
          c.on("mouseover.lg", function () {
            clearTimeout(d), c.addClass("lg-pager-hover");
          }),
          c.on("mouseout.lg", function () {
            d = setTimeout(function () {
              c.removeClass("lg-pager-hover");
            });
          }),
          e.core.$el.on("onBeforeSlide.lg.tm", function (a, c, d) {
            b.removeClass("lg-pager-active"),
              b.eq(d).addClass("lg-pager-active");
          });
      }),
        (c.prototype.destroy = function () {}),
        (a.fn.lightGallery.modules.pager = c);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = {
          thumbnail: !0,
          animateThumb: !0,
          currentPagerPosition: "middle",
          thumbWidth: 100,
          thumbHeight: "80px",
          thumbContHeight: 100,
          thumbMargin: 5,
          exThumbImage: !1,
          showThumbByDefault: !0,
          toogleThumb: !0,
          pullCaptionUp: !0,
          enableThumbDrag: !0,
          enableThumbSwipe: !0,
          swipeThreshold: 50,
          loadYoutubeThumbnail: !0,
          youtubeThumbSize: 1,
          loadVimeoThumbnail: !0,
          vimeoThumbSize: "thumbnail_small",
          loadDailymotionThumbnail: !0,
        },
        c = function (c) {
          return (
            (this.core = a(c).data("lightGallery")),
            (this.core.s = a.extend({}, b, this.core.s)),
            (this.$el = a(c)),
            (this.$thumbOuter = null),
            (this.thumbOuterWidth = 0),
            (this.thumbTotalWidth =
              this.core.$items.length *
              (this.core.s.thumbWidth + this.core.s.thumbMargin)),
            (this.thumbIndex = this.core.index),
            this.core.s.animateThumb && (this.core.s.thumbHeight = "100%"),
            (this.left = 0),
            this.init(),
            this
          );
        };
      (c.prototype.init = function () {
        var a = this;
        this.core.s.thumbnail &&
          this.core.$items.length > 1 &&
          (this.core.s.showThumbByDefault &&
            setTimeout(function () {
              a.core.$outer.addClass("lg-thumb-open");
            }, 700),
          this.core.s.pullCaptionUp &&
            this.core.$outer.addClass("lg-pull-caption-up"),
          this.build(),
          this.core.s.animateThumb && this.core.doCss()
            ? (this.core.s.enableThumbDrag && this.enableThumbDrag(),
              this.core.s.enableThumbSwipe && this.enableThumbSwipe(),
              (this.thumbClickable = !1))
            : (this.thumbClickable = !0),
          this.toogle(),
          this.thumbkeyPress());
      }),
        (c.prototype.build = function () {
          function b(a, b, c) {
            var g,
              h = d.core.isVideo(a, c) || {},
              i = "";
            h.youtube || h.vimeo || h.dailymotion
              ? h.youtube
                ? (g = d.core.s.loadYoutubeThumbnail
                    ? "//img.youtube.com/vi/" +
                      h.youtube[1] +
                      "/" +
                      d.core.s.youtubeThumbSize +
                      ".jpg"
                    : b)
                : h.vimeo
                ? d.core.s.loadVimeoThumbnail
                  ? ((g = "//i.vimeocdn.com/video/error_" + f + ".jpg"),
                    (i = h.vimeo[1]))
                  : (g = b)
                : h.dailymotion &&
                  (g = d.core.s.loadDailymotionThumbnail
                    ? "//www.dailymotion.com/thumbnail/video/" +
                      h.dailymotion[1]
                    : b)
              : (g = b),
              (e +=
                '<div data-vimeo-id="' +
                i +
                '" class="lg-thumb-item" style="width:' +
                d.core.s.thumbWidth +
                "px; height: " +
                d.core.s.thumbHeight +
                "; margin-right: " +
                d.core.s.thumbMargin +
                'px"><img src="' +
                g +
                '" /></div>'),
              (i = "");
          }
          var c,
            d = this,
            e = "",
            f = "",
            g =
              '<div class="lg-thumb-outer"><div class="lg-thumb lg-group"></div></div>';
          switch (this.core.s.vimeoThumbSize) {
            case "thumbnail_large":
              f = "640";
              break;
            case "thumbnail_medium":
              f = "200x150";
              break;
            case "thumbnail_small":
              f = "100x75";
          }
          if (
            (d.core.$outer.addClass("lg-has-thumb"),
            d.core.$outer.find(".lg").append(g),
            (d.$thumbOuter = d.core.$outer.find(".lg-thumb-outer")),
            (d.thumbOuterWidth = d.$thumbOuter.width()),
            d.core.s.animateThumb &&
              d.core.$outer
                .find(".lg-thumb")
                .css({ width: d.thumbTotalWidth + "px", position: "relative" }),
            this.core.s.animateThumb &&
              d.$thumbOuter.css("height", d.core.s.thumbContHeight + "px"),
            d.core.s.dynamic)
          )
            for (var h = 0; h < d.core.s.dynamicEl.length; h++)
              b(d.core.s.dynamicEl[h].src, d.core.s.dynamicEl[h].thumb, h);
          else
            d.core.$items.each(function (c) {
              d.core.s.exThumbImage
                ? b(
                    a(this).attr("href") || a(this).attr("data-src"),
                    a(this).attr(d.core.s.exThumbImage),
                    c
                  )
                : b(
                    a(this).attr("href") || a(this).attr("data-src"),
                    a(this).find("img").attr("src"),
                    c
                  );
            });
          d.core.$outer.find(".lg-thumb").html(e),
            (c = d.core.$outer.find(".lg-thumb-item")),
            c.each(function () {
              var b = a(this),
                c = b.attr("data-vimeo-id");
              c &&
                a.getJSON(
                  "//www.vimeo.com/api/v2/video/" + c + ".json?callback=?",
                  { format: "json" },
                  function (a) {
                    b.find("img").attr("src", a[0][d.core.s.vimeoThumbSize]);
                  }
                );
            }),
            c.eq(d.core.index).addClass("active"),
            d.core.$el.on("onBeforeSlide.lg.tm", function () {
              c.removeClass("active"), c.eq(d.core.index).addClass("active");
            }),
            c.on("click.lg touchend.lg", function () {
              var b = a(this);
              setTimeout(function () {
                ((d.thumbClickable && !d.core.lgBusy) || !d.core.doCss()) &&
                  ((d.core.index = b.index()),
                  d.core.slide(d.core.index, !1, !0, !1));
              }, 50);
            }),
            d.core.$el.on("onBeforeSlide.lg.tm", function () {
              d.animateThumb(d.core.index);
            }),
            a(window).on(
              "resize.lg.thumb orientationchange.lg.thumb",
              function () {
                setTimeout(function () {
                  d.animateThumb(d.core.index),
                    (d.thumbOuterWidth = d.$thumbOuter.width());
                }, 200);
              }
            );
        }),
        (c.prototype.setTranslate = function (a) {
          this.core.$outer
            .find(".lg-thumb")
            .css({ transform: "translate3d(-" + a + "px, 0px, 0px)" });
        }),
        (c.prototype.animateThumb = function (a) {
          var b = this.core.$outer.find(".lg-thumb");
          if (this.core.s.animateThumb) {
            var c;
            switch (this.core.s.currentPagerPosition) {
              case "left":
                c = 0;
                break;
              case "middle":
                c = this.thumbOuterWidth / 2 - this.core.s.thumbWidth / 2;
                break;
              case "right":
                c = this.thumbOuterWidth - this.core.s.thumbWidth;
            }
            (this.left =
              (this.core.s.thumbWidth + this.core.s.thumbMargin) * a - 1 - c),
              this.left > this.thumbTotalWidth - this.thumbOuterWidth &&
                (this.left = this.thumbTotalWidth - this.thumbOuterWidth),
              this.left < 0 && (this.left = 0),
              this.core.lGalleryOn
                ? (b.hasClass("on") ||
                    this.core.$outer
                      .find(".lg-thumb")
                      .css("transition-duration", this.core.s.speed + "ms"),
                  this.core.doCss() ||
                    b.animate({ left: -this.left + "px" }, this.core.s.speed))
                : this.core.doCss() || b.css("left", -this.left + "px"),
              this.setTranslate(this.left);
          }
        }),
        (c.prototype.enableThumbDrag = function () {
          var b = this,
            c = 0,
            d = 0,
            e = !1,
            f = !1,
            g = 0;
          b.$thumbOuter.addClass("lg-grab"),
            b.core.$outer
              .find(".lg-thumb")
              .on("mousedown.lg.thumb", function (a) {
                b.thumbTotalWidth > b.thumbOuterWidth &&
                  (a.preventDefault(),
                  (c = a.pageX),
                  (e = !0),
                  (b.core.$outer.scrollLeft += 1),
                  (b.core.$outer.scrollLeft -= 1),
                  (b.thumbClickable = !1),
                  b.$thumbOuter.removeClass("lg-grab").addClass("lg-grabbing"));
              }),
            a(window).on("mousemove.lg.thumb", function (a) {
              e &&
                ((g = b.left),
                (f = !0),
                (d = a.pageX),
                b.$thumbOuter.addClass("lg-dragging"),
                (g -= d - c),
                g > b.thumbTotalWidth - b.thumbOuterWidth &&
                  (g = b.thumbTotalWidth - b.thumbOuterWidth),
                g < 0 && (g = 0),
                b.setTranslate(g));
            }),
            a(window).on("mouseup.lg.thumb", function () {
              f
                ? ((f = !1),
                  b.$thumbOuter.removeClass("lg-dragging"),
                  (b.left = g),
                  Math.abs(d - c) < b.core.s.swipeThreshold &&
                    (b.thumbClickable = !0))
                : (b.thumbClickable = !0),
                e &&
                  ((e = !1),
                  b.$thumbOuter.removeClass("lg-grabbing").addClass("lg-grab"));
            });
        }),
        (c.prototype.enableThumbSwipe = function () {
          var a = this,
            b = 0,
            c = 0,
            d = !1,
            e = 0;
          a.core.$outer.find(".lg-thumb").on("touchstart.lg", function (c) {
            a.thumbTotalWidth > a.thumbOuterWidth &&
              (c.preventDefault(),
              (b = c.originalEvent.targetTouches[0].pageX),
              (a.thumbClickable = !1));
          }),
            a.core.$outer.find(".lg-thumb").on("touchmove.lg", function (f) {
              a.thumbTotalWidth > a.thumbOuterWidth &&
                (f.preventDefault(),
                (c = f.originalEvent.targetTouches[0].pageX),
                (d = !0),
                a.$thumbOuter.addClass("lg-dragging"),
                (e = a.left),
                (e -= c - b),
                e > a.thumbTotalWidth - a.thumbOuterWidth &&
                  (e = a.thumbTotalWidth - a.thumbOuterWidth),
                e < 0 && (e = 0),
                a.setTranslate(e));
            }),
            a.core.$outer.find(".lg-thumb").on("touchend.lg", function () {
              a.thumbTotalWidth > a.thumbOuterWidth && d
                ? ((d = !1),
                  a.$thumbOuter.removeClass("lg-dragging"),
                  Math.abs(c - b) < a.core.s.swipeThreshold &&
                    (a.thumbClickable = !0),
                  (a.left = e))
                : (a.thumbClickable = !0);
            });
        }),
        (c.prototype.toogle = function () {
          var a = this;
          a.core.s.toogleThumb &&
            (a.core.$outer.addClass("lg-can-toggle"),
            a.$thumbOuter.append(
              '<span class="lg-toogle-thumb lg-icon"></span>'
            ),
            a.core.$outer.find(".lg-toogle-thumb").on("click.lg", function () {
              a.core.$outer.toggleClass("lg-thumb-open");
            }));
        }),
        (c.prototype.thumbkeyPress = function () {
          var b = this;
          a(window).on("keydown.lg.thumb", function (a) {
            38 === a.keyCode
              ? (a.preventDefault(), b.core.$outer.addClass("lg-thumb-open"))
              : 40 === a.keyCode &&
                (a.preventDefault(),
                b.core.$outer.removeClass("lg-thumb-open"));
          });
        }),
        (c.prototype.destroy = function () {
          this.core.s.thumbnail &&
            this.core.$items.length > 1 &&
            (a(window).off(
              "resize.lg.thumb orientationchange.lg.thumb keydown.lg.thumb"
            ),
            this.$thumbOuter.remove(),
            this.core.$outer.removeClass("lg-has-thumb"));
        }),
        (a.fn.lightGallery.modules.Thumbnail = c);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof module && module.exports
      ? (module.exports = b(require("jquery")))
      : b(a.jQuery);
  })(this, function (a) {
    !(function () {
      "use strict";
      function b(a, b, c, d) {
        var e = this;
        if (
          (e.core.$slide
            .eq(b)
            .find(".lg-video")
            .append(e.loadVideo(c, "lg-object", !0, b, d)),
          d)
        )
          if (e.core.s.videojs)
            try {
              videojs(
                e.core.$slide.eq(b).find(".lg-html5").get(0),
                e.core.s.videojsOptions,
                function () {
                  !e.videoLoaded && e.core.s.autoplayFirstVideo && this.play();
                }
              );
            } catch (a) {
              console.error("Make sure you have included videojs");
            }
          else
            !e.videoLoaded &&
              e.core.s.autoplayFirstVideo &&
              e.core.$slide.eq(b).find(".lg-html5").get(0).play();
      }
      function c(a, b) {
        var c = this.core.$slide.eq(b).find(".lg-video-cont");
        c.hasClass("lg-has-iframe") ||
          (c.css("max-width", this.core.s.videoMaxWidth),
          (this.videoLoaded = !0));
      }
      function d(b, c, d) {
        var e = this,
          f = e.core.$slide.eq(c),
          g = f.find(".lg-youtube").get(0),
          h = f.find(".lg-vimeo").get(0),
          i = f.find(".lg-dailymotion").get(0),
          j = f.find(".lg-vk").get(0),
          k = f.find(".lg-html5").get(0);
        if (g)
          g.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            "*"
          );
        else if (h)
          try {
            $f(h).api("pause");
          } catch (a) {
            console.error("Make sure you have included froogaloop2 js");
          }
        else if (i) i.contentWindow.postMessage("pause", "*");
        else if (k)
          if (e.core.s.videojs)
            try {
              videojs(k).pause();
            } catch (a) {
              console.error("Make sure you have included videojs");
            }
          else k.pause();
        j && a(j).attr("src", a(j).attr("src").replace("&autoplay", "&noplay"));
        var l;
        l = e.core.s.dynamic
          ? e.core.s.dynamicEl[d].src
          : e.core.$items.eq(d).attr("href") ||
            e.core.$items.eq(d).attr("data-src");
        var m = e.core.isVideo(l, d) || {};
        (m.youtube || m.vimeo || m.dailymotion || m.vk) &&
          e.core.$outer.addClass("lg-hide-download");
      }
      var e = {
          videoMaxWidth: "855px",
          autoplayFirstVideo: !0,
          youtubePlayerParams: !1,
          vimeoPlayerParams: !1,
          dailymotionPlayerParams: !1,
          vkPlayerParams: !1,
          videojs: !1,
          videojsOptions: {},
        },
        f = function (b) {
          return (
            (this.core = a(b).data("lightGallery")),
            (this.$el = a(b)),
            (this.core.s = a.extend({}, e, this.core.s)),
            (this.videoLoaded = !1),
            this.init(),
            this
          );
        };
      (f.prototype.init = function () {
        var e = this;
        e.core.$el.on("hasVideo.lg.tm", b.bind(this)),
          e.core.$el.on("onAferAppendSlide.lg.tm", c.bind(this)),
          e.core.doCss() &&
          e.core.$items.length > 1 &&
          (e.core.s.enableSwipe || e.core.s.enableDrag)
            ? e.core.$el.on("onSlideClick.lg.tm", function () {
                var a = e.core.$slide.eq(e.core.index);
                e.loadVideoOnclick(a);
              })
            : e.core.$slide.on("click.lg", function () {
                e.loadVideoOnclick(a(this));
              }),
          e.core.$el.on("onBeforeSlide.lg.tm", d.bind(this)),
          e.core.$el.on("onAfterSlide.lg.tm", function (a, b) {
            e.core.$slide.eq(b).removeClass("lg-video-playing");
          }),
          e.core.s.autoplayFirstVideo &&
            e.core.$el.on("onAferAppendSlide.lg.tm", function (a, b) {
              if (!e.core.lGalleryOn) {
                var c = e.core.$slide.eq(b);
                setTimeout(function () {
                  e.loadVideoOnclick(c);
                }, 100);
              }
            });
      }),
        (f.prototype.loadVideo = function (b, c, d, e, f) {
          var g = "",
            h = 1,
            i = "",
            j = this.core.isVideo(b, e) || {};
          if (
            (d &&
              (h = this.videoLoaded
                ? 0
                : this.core.s.autoplayFirstVideo
                ? 1
                : 0),
            j.youtube)
          )
            (i = "?wmode=opaque&autoplay=" + h + "&enablejsapi=1"),
              this.core.s.youtubePlayerParams &&
                (i = i + "&" + a.param(this.core.s.youtubePlayerParams)),
              (g =
                '<iframe class="lg-video-object lg-youtube ' +
                c +
                '" width="560" height="315" src="//www.youtube.com/embed/' +
                j.youtube[1] +
                i +
                '" frameborder="0" allowfullscreen></iframe>');
          else if (j.vimeo)
            (i = "?autoplay=" + h + "&api=1"),
              this.core.s.vimeoPlayerParams &&
                (i = i + "&" + a.param(this.core.s.vimeoPlayerParams)),
              (g =
                '<iframe class="lg-video-object lg-vimeo ' +
                c +
                '" width="560" height="315"  src="//player.vimeo.com/video/' +
                j.vimeo[1] +
                i +
                '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
          else if (j.dailymotion)
            (i = "?wmode=opaque&autoplay=" + h + "&api=postMessage"),
              this.core.s.dailymotionPlayerParams &&
                (i = i + "&" + a.param(this.core.s.dailymotionPlayerParams)),
              (g =
                '<iframe class="lg-video-object lg-dailymotion ' +
                c +
                '" width="560" height="315" src="//www.dailymotion.com/embed/video/' +
                j.dailymotion[1] +
                i +
                '" frameborder="0" allowfullscreen></iframe>');
          else if (j.html5) {
            var k = f.substring(0, 1);
            ("." !== k && "#" !== k) || (f = a(f).html()), (g = f);
          } else
            j.vk &&
              ((i = "&autoplay=" + h),
              this.core.s.vkPlayerParams &&
                (i = i + "&" + a.param(this.core.s.vkPlayerParams)),
              (g =
                '<iframe class="lg-video-object lg-vk ' +
                c +
                '" width="560" height="315" src="//vk.com/video_ext.php?' +
                j.vk[1] +
                i +
                '" frameborder="0" allowfullscreen></iframe>'));
          return g;
        }),
        (f.prototype.loadVideoOnclick = function (a) {
          var b = this;
          if (
            a.find(".lg-object").hasClass("lg-has-poster") &&
            a.find(".lg-object").is(":visible")
          )
            if (a.hasClass("lg-has-video")) {
              var c = a.find(".lg-youtube").get(0),
                d = a.find(".lg-vimeo").get(0),
                e = a.find(".lg-dailymotion").get(0),
                f = a.find(".lg-html5").get(0);
              if (c)
                c.contentWindow.postMessage(
                  '{"event":"command","func":"playVideo","args":""}',
                  "*"
                );
              else if (d)
                try {
                  $f(d).api("play");
                } catch (a) {
                  console.error("Make sure you have included froogaloop2 js");
                }
              else if (e) e.contentWindow.postMessage("play", "*");
              else if (f)
                if (b.core.s.videojs)
                  try {
                    videojs(f).play();
                  } catch (a) {
                    console.error("Make sure you have included videojs");
                  }
                else f.play();
              a.addClass("lg-video-playing");
            } else {
              a.addClass("lg-video-playing lg-has-video");
              var g,
                h,
                i = function (c, d) {
                  if (
                    (a
                      .find(".lg-video")
                      .append(b.loadVideo(c, "", !1, b.core.index, d)),
                    d)
                  )
                    if (b.core.s.videojs)
                      try {
                        videojs(
                          b.core.$slide
                            .eq(b.core.index)
                            .find(".lg-html5")
                            .get(0),
                          b.core.s.videojsOptions,
                          function () {
                            this.play();
                          }
                        );
                      } catch (a) {
                        console.error("Make sure you have included videojs");
                      }
                    else
                      b.core.$slide
                        .eq(b.core.index)
                        .find(".lg-html5")
                        .get(0)
                        .play();
                };
              b.core.s.dynamic
                ? ((g = b.core.s.dynamicEl[b.core.index].src),
                  (h = b.core.s.dynamicEl[b.core.index].html),
                  i(g, h))
                : ((g =
                    b.core.$items.eq(b.core.index).attr("href") ||
                    b.core.$items.eq(b.core.index).attr("data-src")),
                  (h = b.core.$items.eq(b.core.index).attr("data-html")),
                  i(g, h));
              var j = a.find(".lg-object");
              a.find(".lg-video").append(j),
                a.find(".lg-video-object").hasClass("lg-html5") ||
                  (a.removeClass("lg-complete"),
                  a
                    .find(".lg-video-object")
                    .on("load.lg error.lg", function () {
                      a.addClass("lg-complete");
                    }));
            }
        }),
        (f.prototype.destroy = function () {
          this.videoLoaded = !1;
        }),
        (a.fn.lightGallery.modules.video = f);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = function () {
          var a = !1,
            b = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
          return b && parseInt(b[2], 10) < 54 && (a = !0), a;
        },
        c = {
          scale: 1,
          zoom: !0,
          actualSize: !0,
          enableZoomAfter: 300,
          useLeftForZoom: b(),
        },
        d = function (b) {
          return (
            (this.core = a(b).data("lightGallery")),
            (this.core.s = a.extend({}, c, this.core.s)),
            this.core.s.zoom &&
              this.core.doCss() &&
              (this.init(),
              (this.zoomabletimeout = !1),
              (this.pageX = a(window).width() / 2),
              (this.pageY = a(window).height() / 2 + a(window).scrollTop())),
            this
          );
        };
      (d.prototype.init = function () {
        var b = this,
          c =
            '<span id="lg-zoom-in" class="lg-icon"></span><span id="lg-zoom-out" class="lg-icon"></span>';
        b.core.s.actualSize &&
          (c += '<span id="lg-actual-size" class="lg-icon"></span>'),
          b.core.s.useLeftForZoom
            ? b.core.$outer.addClass("lg-use-left-for-zoom")
            : b.core.$outer.addClass("lg-use-transition-for-zoom"),
          this.core.$outer.find(".lg-toolbar").append(c),
          b.core.$el.on("onSlideItemLoad.lg.tm.zoom", function (c, d, e) {
            var f = b.core.s.enableZoomAfter + e;
            a("body").hasClass("lg-from-hash") && e
              ? (f = 0)
              : a("body").removeClass("lg-from-hash"),
              (b.zoomabletimeout = setTimeout(function () {
                b.core.$slide.eq(d).addClass("lg-zoomable");
              }, f + 30));
          });
        var d = 1,
          e = function (c) {
            var d,
              e,
              f = b.core.$outer.find(".lg-current .lg-image"),
              g = (a(window).width() - f.prop("offsetWidth")) / 2,
              h =
                (a(window).height() - f.prop("offsetHeight")) / 2 +
                a(window).scrollTop();
            (d = b.pageX - g), (e = b.pageY - h);
            var i = (c - 1) * d,
              j = (c - 1) * e;
            f
              .css("transform", "scale3d(" + c + ", " + c + ", 1)")
              .attr("data-scale", c),
              b.core.s.useLeftForZoom
                ? f
                    .parent()
                    .css({ left: -i + "px", top: -j + "px" })
                    .attr("data-x", i)
                    .attr("data-y", j)
                : f
                    .parent()
                    .css(
                      "transform",
                      "translate3d(-" + i + "px, -" + j + "px, 0)"
                    )
                    .attr("data-x", i)
                    .attr("data-y", j);
          },
          f = function () {
            d > 1 ? b.core.$outer.addClass("lg-zoomed") : b.resetZoom(),
              d < 1 && (d = 1),
              e(d);
          },
          g = function (c, e, g, h) {
            var i,
              j = e.prop("offsetWidth");
            i = b.core.s.dynamic
              ? b.core.s.dynamicEl[g].width || e[0].naturalWidth || j
              : b.core.$items.eq(g).attr("data-width") ||
                e[0].naturalWidth ||
                j;
            var k;
            b.core.$outer.hasClass("lg-zoomed")
              ? (d = 1)
              : i > j && ((k = i / j), (d = k || 2)),
              h
                ? ((b.pageX = a(window).width() / 2),
                  (b.pageY = a(window).height() / 2 + a(window).scrollTop()))
                : ((b.pageX =
                    c.pageX || c.originalEvent.targetTouches[0].pageX),
                  (b.pageY =
                    c.pageY || c.originalEvent.targetTouches[0].pageY)),
              f(),
              setTimeout(function () {
                b.core.$outer.removeClass("lg-grabbing").addClass("lg-grab");
              }, 10);
          },
          h = !1;
        b.core.$el.on("onAferAppendSlide.lg.tm.zoom", function (a, c) {
          var d = b.core.$slide.eq(c).find(".lg-image");
          d.on("dblclick", function (a) {
            g(a, d, c);
          }),
            d.on("touchstart", function (a) {
              h
                ? (clearTimeout(h), (h = null), g(a, d, c))
                : (h = setTimeout(function () {
                    h = null;
                  }, 300)),
                a.preventDefault();
            });
        }),
          a(window).on(
            "resize.lg.zoom scroll.lg.zoom orientationchange.lg.zoom",
            function () {
              (b.pageX = a(window).width() / 2),
                (b.pageY = a(window).height() / 2 + a(window).scrollTop()),
                e(d);
            }
          ),
          a("#lg-zoom-out").on("click.lg", function () {
            b.core.$outer.find(".lg-current .lg-image").length &&
              ((d -= b.core.s.scale), f());
          }),
          a("#lg-zoom-in").on("click.lg", function () {
            b.core.$outer.find(".lg-current .lg-image").length &&
              ((d += b.core.s.scale), f());
          }),
          a("#lg-actual-size").on("click.lg", function (a) {
            g(
              a,
              b.core.$slide.eq(b.core.index).find(".lg-image"),
              b.core.index,
              !0
            );
          }),
          b.core.$el.on("onBeforeSlide.lg.tm", function () {
            (d = 1), b.resetZoom();
          }),
          b.zoomDrag(),
          b.zoomSwipe();
      }),
        (d.prototype.resetZoom = function () {
          this.core.$outer.removeClass("lg-zoomed"),
            this.core.$slide
              .find(".lg-img-wrap")
              .removeAttr("style data-x data-y"),
            this.core.$slide.find(".lg-image").removeAttr("style data-scale"),
            (this.pageX = a(window).width() / 2),
            (this.pageY = a(window).height() / 2 + a(window).scrollTop());
        }),
        (d.prototype.zoomSwipe = function () {
          var a = this,
            b = {},
            c = {},
            d = !1,
            e = !1,
            f = !1;
          a.core.$slide.on("touchstart.lg", function (c) {
            if (a.core.$outer.hasClass("lg-zoomed")) {
              var d = a.core.$slide.eq(a.core.index).find(".lg-object");
              (f =
                d.prop("offsetHeight") * d.attr("data-scale") >
                a.core.$outer.find(".lg").height()),
                (e =
                  d.prop("offsetWidth") * d.attr("data-scale") >
                  a.core.$outer.find(".lg").width()),
                (e || f) &&
                  (c.preventDefault(),
                  (b = {
                    x: c.originalEvent.targetTouches[0].pageX,
                    y: c.originalEvent.targetTouches[0].pageY,
                  }));
            }
          }),
            a.core.$slide.on("touchmove.lg", function (g) {
              if (a.core.$outer.hasClass("lg-zoomed")) {
                var h,
                  i,
                  j = a.core.$slide.eq(a.core.index).find(".lg-img-wrap");
                g.preventDefault(),
                  (d = !0),
                  (c = {
                    x: g.originalEvent.targetTouches[0].pageX,
                    y: g.originalEvent.targetTouches[0].pageY,
                  }),
                  a.core.$outer.addClass("lg-zoom-dragging"),
                  (i = f
                    ? -Math.abs(j.attr("data-y")) + (c.y - b.y)
                    : -Math.abs(j.attr("data-y"))),
                  (h = e
                    ? -Math.abs(j.attr("data-x")) + (c.x - b.x)
                    : -Math.abs(j.attr("data-x"))),
                  (Math.abs(c.x - b.x) > 15 || Math.abs(c.y - b.y) > 15) &&
                    (a.core.s.useLeftForZoom
                      ? j.css({ left: h + "px", top: i + "px" })
                      : j.css(
                          "transform",
                          "translate3d(" + h + "px, " + i + "px, 0)"
                        ));
              }
            }),
            a.core.$slide.on("touchend.lg", function () {
              a.core.$outer.hasClass("lg-zoomed") &&
                d &&
                ((d = !1),
                a.core.$outer.removeClass("lg-zoom-dragging"),
                a.touchendZoom(b, c, e, f));
            });
        }),
        (d.prototype.zoomDrag = function () {
          var b = this,
            c = {},
            d = {},
            e = !1,
            f = !1,
            g = !1,
            h = !1;
          b.core.$slide.on("mousedown.lg.zoom", function (d) {
            var f = b.core.$slide.eq(b.core.index).find(".lg-object");
            (h =
              f.prop("offsetHeight") * f.attr("data-scale") >
              b.core.$outer.find(".lg").height()),
              (g =
                f.prop("offsetWidth") * f.attr("data-scale") >
                b.core.$outer.find(".lg").width()),
              b.core.$outer.hasClass("lg-zoomed") &&
                a(d.target).hasClass("lg-object") &&
                (g || h) &&
                (d.preventDefault(),
                (c = { x: d.pageX, y: d.pageY }),
                (e = !0),
                (b.core.$outer.scrollLeft += 1),
                (b.core.$outer.scrollLeft -= 1),
                b.core.$outer.removeClass("lg-grab").addClass("lg-grabbing"));
          }),
            a(window).on("mousemove.lg.zoom", function (a) {
              if (e) {
                var i,
                  j,
                  k = b.core.$slide.eq(b.core.index).find(".lg-img-wrap");
                (f = !0),
                  (d = { x: a.pageX, y: a.pageY }),
                  b.core.$outer.addClass("lg-zoom-dragging"),
                  (j = h
                    ? -Math.abs(k.attr("data-y")) + (d.y - c.y)
                    : -Math.abs(k.attr("data-y"))),
                  (i = g
                    ? -Math.abs(k.attr("data-x")) + (d.x - c.x)
                    : -Math.abs(k.attr("data-x"))),
                  b.core.s.useLeftForZoom
                    ? k.css({ left: i + "px", top: j + "px" })
                    : k.css(
                        "transform",
                        "translate3d(" + i + "px, " + j + "px, 0)"
                      );
              }
            }),
            a(window).on("mouseup.lg.zoom", function (a) {
              e &&
                ((e = !1),
                b.core.$outer.removeClass("lg-zoom-dragging"),
                !f ||
                  (c.x === d.x && c.y === d.y) ||
                  ((d = { x: a.pageX, y: a.pageY }),
                  b.touchendZoom(c, d, g, h)),
                (f = !1)),
                b.core.$outer.removeClass("lg-grabbing").addClass("lg-grab");
            });
        }),
        (d.prototype.touchendZoom = function (a, b, c, d) {
          var e = this,
            f = e.core.$slide.eq(e.core.index).find(".lg-img-wrap"),
            g = e.core.$slide.eq(e.core.index).find(".lg-object"),
            h = -Math.abs(f.attr("data-x")) + (b.x - a.x),
            i = -Math.abs(f.attr("data-y")) + (b.y - a.y),
            j =
              (e.core.$outer.find(".lg").height() - g.prop("offsetHeight")) / 2,
            k = Math.abs(
              g.prop("offsetHeight") * Math.abs(g.attr("data-scale")) -
                e.core.$outer.find(".lg").height() +
                j
            ),
            l = (e.core.$outer.find(".lg").width() - g.prop("offsetWidth")) / 2,
            m = Math.abs(
              g.prop("offsetWidth") * Math.abs(g.attr("data-scale")) -
                e.core.$outer.find(".lg").width() +
                l
            );
          (Math.abs(b.x - a.x) > 15 || Math.abs(b.y - a.y) > 15) &&
            (d && (i <= -k ? (i = -k) : i >= -j && (i = -j)),
            c && (h <= -m ? (h = -m) : h >= -l && (h = -l)),
            d
              ? f.attr("data-y", Math.abs(i))
              : (i = -Math.abs(f.attr("data-y"))),
            c
              ? f.attr("data-x", Math.abs(h))
              : (h = -Math.abs(f.attr("data-x"))),
            e.core.s.useLeftForZoom
              ? f.css({ left: h + "px", top: i + "px" })
              : f.css("transform", "translate3d(" + h + "px, " + i + "px, 0)"));
        }),
        (d.prototype.destroy = function () {
          var b = this;
          b.core.$el.off(".lg.zoom"),
            a(window).off(".lg.zoom"),
            b.core.$slide.off(".lg.zoom"),
            b.core.$el.off(".lg.tm.zoom"),
            b.resetZoom(),
            clearTimeout(b.zoomabletimeout),
            (b.zoomabletimeout = !1);
        }),
        (a.fn.lightGallery.modules.zoom = d);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = { hash: !0 },
        c = function (c) {
          return (
            (this.core = a(c).data("lightGallery")),
            (this.core.s = a.extend({}, b, this.core.s)),
            this.core.s.hash &&
              ((this.oldHash = window.location.hash), this.init()),
            this
          );
        };
      (c.prototype.init = function () {
        var b,
          c = this;
        c.core.$el.on("onAfterSlide.lg.tm", function (a, b, d) {
          history.replaceState
            ? history.replaceState(
                null,
                null,
                window.location.pathname +
                  window.location.search +
                  "#lg=" +
                  c.core.s.galleryId +
                  "&slide=" +
                  d
              )
            : (window.location.hash =
                "lg=" + c.core.s.galleryId + "&slide=" + d);
        }),
          a(window).on("hashchange.lg.hash", function () {
            b = window.location.hash;
            var a = parseInt(b.split("&slide=")[1], 10);
            b.indexOf("lg=" + c.core.s.galleryId) > -1
              ? c.core.slide(a, !1, !1)
              : c.core.lGalleryOn && c.core.destroy();
          });
      }),
        (c.prototype.destroy = function () {
          this.core.s.hash &&
            (this.oldHash &&
            this.oldHash.indexOf("lg=" + this.core.s.galleryId) < 0
              ? history.replaceState
                ? history.replaceState(null, null, this.oldHash)
                : (window.location.hash = this.oldHash)
              : history.replaceState
              ? history.replaceState(
                  null,
                  document.title,
                  window.location.pathname + window.location.search
                )
              : (window.location.hash = ""),
            this.core.$el.off(".lg.hash"));
        }),
        (a.fn.lightGallery.modules.hash = c);
    })();
  }),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(["jquery"], function (a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("jquery")))
      : b(jQuery);
  })(0, function (a) {
    !(function () {
      "use strict";
      var b = {
          share: !0,
          facebook: !0,
          facebookDropdownText: "Facebook",
          twitter: !0,
          twitterDropdownText: "Twitter",
          googlePlus: !0,
          googlePlusDropdownText: "GooglePlus",
          pinterest: !0,
          pinterestDropdownText: "Pinterest",
        },
        c = function (c) {
          return (
            (this.core = a(c).data("lightGallery")),
            (this.core.s = a.extend({}, b, this.core.s)),
            this.core.s.share && this.init(),
            this
          );
        };
      (c.prototype.init = function () {
        var b = this,
          c =
            '<span id="lg-share" class="lg-icon"><ul class="lg-dropdown" style="position: absolute;">';
        (c += b.core.s.facebook
          ? '<li><a id="lg-share-facebook" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
            this.core.s.facebookDropdownText +
            "</span></a></li>"
          : ""),
          (c += b.core.s.twitter
            ? '<li><a id="lg-share-twitter" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
              this.core.s.twitterDropdownText +
              "</span></a></li>"
            : ""),
          (c += b.core.s.googlePlus
            ? '<li><a id="lg-share-googleplus" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
              this.core.s.googlePlusDropdownText +
              "</span></a></li>"
            : ""),
          (c += b.core.s.pinterest
            ? '<li><a id="lg-share-pinterest" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
              this.core.s.pinterestDropdownText +
              "</span></a></li>"
            : ""),
          (c += "</ul></span>"),
          this.core.$outer.find(".lg-toolbar").append(c),
          this.core.$outer
            .find(".lg")
            .append('<div id="lg-dropdown-overlay"></div>'),
          a("#lg-share").on("click.lg", function () {
            b.core.$outer.toggleClass("lg-dropdown-active");
          }),
          a("#lg-dropdown-overlay").on("click.lg", function () {
            b.core.$outer.removeClass("lg-dropdown-active");
          }),
          b.core.$el.on("onAfterSlide.lg.tm", function (c, d, e) {
            setTimeout(function () {
              a("#lg-share-facebook").attr(
                "href",
                "https://www.facebook.com/sharer/sharer.php?u=" +
                  encodeURIComponent(
                    b.getSahreProps(e, "facebookShareUrl") ||
                      window.location.href
                  )
              ),
                a("#lg-share-twitter").attr(
                  "href",
                  "https://twitter.com/intent/tweet?text=" +
                    b.getSahreProps(e, "tweetText") +
                    "&url=" +
                    encodeURIComponent(
                      b.getSahreProps(e, "twitterShareUrl") ||
                        window.location.href
                    )
                ),
                a("#lg-share-googleplus").attr(
                  "href",
                  "https://plus.google.com/share?url=" +
                    encodeURIComponent(
                      b.getSahreProps(e, "googleplusShareUrl") ||
                        window.location.href
                    )
                ),
                a("#lg-share-pinterest").attr(
                  "href",
                  "http://www.pinterest.com/pin/create/button/?url=" +
                    encodeURIComponent(
                      b.getSahreProps(e, "pinterestShareUrl") ||
                        window.location.href
                    ) +
                    "&media=" +
                    encodeURIComponent(b.getSahreProps(e, "src")) +
                    "&description=" +
                    b.getSahreProps(e, "pinterestText")
                );
            }, 100);
          });
      }),
        (c.prototype.getSahreProps = function (a, b) {
          var c = "";
          if (this.core.s.dynamic) c = this.core.s.dynamicEl[a][b];
          else {
            var d = this.core.$items.eq(a).attr("href"),
              e = this.core.$items.eq(a).data(b);
            c = "src" === b ? d || e : e;
          }
          return c;
        }),
        (c.prototype.destroy = function () {}),
        (a.fn.lightGallery.modules.share = c);
    })();
  });
/*-----------------------------------------------------------------------------------*/
/*	09. MOUSEWHEEL
/*-----------------------------------------------------------------------------------*/
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery"], a)
    : "object" == typeof exports
    ? (module.exports = a)
    : a(jQuery);
})(function (a) {
  function b(b) {
    var g = b || window.event,
      h = i.call(arguments, 1),
      j = 0,
      l = 0,
      m = 0,
      n = 0,
      o = 0,
      p = 0;
    if (
      ((b = a.event.fix(g)),
      (b.type = "mousewheel"),
      "detail" in g && (m = -1 * g.detail),
      "wheelDelta" in g && (m = g.wheelDelta),
      "wheelDeltaY" in g && (m = g.wheelDeltaY),
      "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX),
      "axis" in g && g.axis === g.HORIZONTAL_AXIS && ((l = -1 * m), (m = 0)),
      (j = 0 === m ? l : m),
      "deltaY" in g && ((m = -1 * g.deltaY), (j = m)),
      "deltaX" in g && ((l = g.deltaX), 0 === m && (j = -1 * l)),
      0 !== m || 0 !== l)
    ) {
      if (1 === g.deltaMode) {
        var q = a.data(this, "mousewheel-line-height");
        (j *= q), (m *= q), (l *= q);
      } else if (2 === g.deltaMode) {
        var r = a.data(this, "mousewheel-page-height");
        (j *= r), (m *= r), (l *= r);
      }
      if (
        ((n = Math.max(Math.abs(m), Math.abs(l))),
        (!f || f > n) && ((f = n), d(g, n) && (f /= 40)),
        d(g, n) && ((j /= 40), (l /= 40), (m /= 40)),
        (j = Math[j >= 1 ? "floor" : "ceil"](j / f)),
        (l = Math[l >= 1 ? "floor" : "ceil"](l / f)),
        (m = Math[m >= 1 ? "floor" : "ceil"](m / f)),
        k.settings.normalizeOffset && this.getBoundingClientRect)
      ) {
        var s = this.getBoundingClientRect();
        (o = b.clientX - s.left), (p = b.clientY - s.top);
      }
      return (
        (b.deltaX = l),
        (b.deltaY = m),
        (b.deltaFactor = f),
        (b.offsetX = o),
        (b.offsetY = p),
        (b.deltaMode = 0),
        h.unshift(b, j, l, m),
        e && clearTimeout(e),
        (e = setTimeout(c, 200)),
        (a.event.dispatch || a.event.handle).apply(this, h)
      );
    }
  }
  function c() {
    f = null;
  }
  function d(a, b) {
    return (
      k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
    );
  }
  var e,
    f,
    g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
    h =
      "onwheel" in document || document.documentMode >= 9
        ? ["wheel"]
        : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
    i = Array.prototype.slice;
  if (a.event.fixHooks)
    for (var j = g.length; j; ) a.event.fixHooks[g[--j]] = a.event.mouseHooks;
  var k = (a.event.special.mousewheel = {
    version: "3.1.12",
    setup: function () {
      if (this.addEventListener)
        for (var c = h.length; c; ) this.addEventListener(h[--c], b, !1);
      else this.onmousewheel = b;
      a.data(this, "mousewheel-line-height", k.getLineHeight(this)),
        a.data(this, "mousewheel-page-height", k.getPageHeight(this));
    },
    teardown: function () {
      if (this.removeEventListener)
        for (var c = h.length; c; ) this.removeEventListener(h[--c], b, !1);
      else this.onmousewheel = null;
      a.removeData(this, "mousewheel-line-height"),
        a.removeData(this, "mousewheel-page-height");
    },
    getLineHeight: function (b) {
      var c = a(b),
        d = c["offsetParent" in a.fn ? "offsetParent" : "parent"]();
      return (
        d.length || (d = a("body")),
        parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16
      );
    },
    getPageHeight: function (b) {
      return a(b).height();
    },
    settings: { adjustOldDeltas: !0, normalizeOffset: !0 },
  });
  a.fn.extend({
    mousewheel: function (a) {
      return a ? this.bind("mousewheel", a) : this.trigger("mousewheel");
    },
    unmousewheel: function (a) {
      return this.unbind("mousewheel", a);
    },
  });
});
/*-----------------------------------------------------------------------------------*/
/*	10. VALIDATOR
/*-----------------------------------------------------------------------------------*/
/*!
 * Validator v0.11.9 for Bootstrap 3, by @1000hz
 * Copyright 2017 Cina Saffary
 * Licensed under http://opensource.org/licenses/MIT
 *
 * https://github.com/1000hz/bootstrap-validator
 */

+(function (a) {
  "use strict";
  function b(b) {
    return b.is('[type="checkbox"]')
      ? b.prop("checked")
      : b.is('[type="radio"]')
      ? !!a('[name="' + b.attr("name") + '"]:checked').length
      : b.is("select[multiple]")
      ? (b.val() || []).length
      : b.val();
  }
  function c(b) {
    return this.each(function () {
      var c = a(this),
        e = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b),
        f = c.data("bs.validator");
      (f || "destroy" != b) &&
        (f || c.data("bs.validator", (f = new d(this, e))),
        "string" == typeof b && f[b]());
    });
  }
  var d = function (c, e) {
    (this.options = e),
      (this.validators = a.extend({}, d.VALIDATORS, e.custom)),
      (this.$element = a(c)),
      (this.$btn = a('button[type="submit"], input[type="submit"]')
        .filter('[form="' + this.$element.attr("id") + '"]')
        .add(
          this.$element.find('input[type="submit"], button[type="submit"]')
        )),
      this.update(),
      this.$element.on(
        "input.bs.validator change.bs.validator focusout.bs.validator",
        a.proxy(this.onInput, this)
      ),
      this.$element.on("submit.bs.validator", a.proxy(this.onSubmit, this)),
      this.$element.on("reset.bs.validator", a.proxy(this.reset, this)),
      this.$element.find("[data-match]").each(function () {
        var c = a(this),
          d = c.attr("data-match");
        a(d).on("input.bs.validator", function () {
          b(c) && c.trigger("input.bs.validator");
        });
      }),
      this.$inputs
        .filter(function () {
          return b(a(this)) && !a(this).closest(".has-error").length;
        })
        .trigger("focusout"),
      this.$element.attr("novalidate", !0);
  };
  (d.VERSION = "0.11.9"),
    (d.INPUT_SELECTOR =
      ':input:not([type="hidden"], [type="submit"], [type="reset"], button)'),
    (d.FOCUS_OFFSET = 20),
    (d.DEFAULTS = {
      delay: 500,
      html: !1,
      disable: !0,
      focus: !0,
      custom: {},
      errors: { match: "Does not match", minlength: "Not long enough" },
      feedback: { success: "glyphicon-ok", error: "glyphicon-remove" },
    }),
    (d.VALIDATORS = {
      native: function (a) {
        var b = a[0];
        return b.checkValidity
          ? !b.checkValidity() &&
              !b.validity.valid &&
              (b.validationMessage || "error!")
          : void 0;
      },
      match: function (b) {
        var c = b.attr("data-match");
        return b.val() !== a(c).val() && d.DEFAULTS.errors.match;
      },
      minlength: function (a) {
        var b = a.attr("data-minlength");
        return a.val().length < b && d.DEFAULTS.errors.minlength;
      },
    }),
    (d.prototype.update = function () {
      var b = this;
      return (
        (this.$inputs = this.$element
          .find(d.INPUT_SELECTOR)
          .add(this.$element.find('[data-validate="true"]'))
          .not(
            this.$element.find('[data-validate="false"]').each(function () {
              b.clearErrors(a(this));
            })
          )),
        this.toggleSubmit(),
        this
      );
    }),
    (d.prototype.onInput = function (b) {
      var c = this,
        d = a(b.target),
        e = "focusout" !== b.type;
      this.$inputs.is(d) &&
        this.validateInput(d, e).done(function () {
          c.toggleSubmit();
        });
    }),
    (d.prototype.validateInput = function (c, d) {
      var e = (b(c), c.data("bs.validator.errors"));
      c.is('[type="radio"]') &&
        (c = this.$element.find('input[name="' + c.attr("name") + '"]'));
      var f = a.Event("validate.bs.validator", { relatedTarget: c[0] });
      if ((this.$element.trigger(f), !f.isDefaultPrevented())) {
        var g = this;
        return this.runValidators(c).done(function (b) {
          c.data("bs.validator.errors", b),
            b.length
              ? d
                ? g.defer(c, g.showErrors)
                : g.showErrors(c)
              : g.clearErrors(c),
            (e && b.toString() === e.toString()) ||
              ((f = b.length
                ? a.Event("invalid.bs.validator", {
                    relatedTarget: c[0],
                    detail: b,
                  })
                : a.Event("valid.bs.validator", {
                    relatedTarget: c[0],
                    detail: e,
                  })),
              g.$element.trigger(f)),
            g.toggleSubmit(),
            g.$element.trigger(
              a.Event("validated.bs.validator", { relatedTarget: c[0] })
            );
        });
      }
    }),
    (d.prototype.runValidators = function (c) {
      function d(a) {
        return c.attr("data-" + a + "-error");
      }
      function e() {
        var a = c[0].validity;
        return a.typeMismatch
          ? c.attr("data-type-error")
          : a.patternMismatch
          ? c.attr("data-pattern-error")
          : a.stepMismatch
          ? c.attr("data-step-error")
          : a.rangeOverflow
          ? c.attr("data-max-error")
          : a.rangeUnderflow
          ? c.attr("data-min-error")
          : a.valueMissing
          ? c.attr("data-required-error")
          : null;
      }
      function f() {
        return c.attr("data-error");
      }
      function g(a) {
        return d(a) || e() || f();
      }
      var h = [],
        i = a.Deferred();
      return (
        c.data("bs.validator.deferred") &&
          c.data("bs.validator.deferred").reject(),
        c.data("bs.validator.deferred", i),
        a.each(
          this.validators,
          a.proxy(function (a, d) {
            var e = null;
            (!b(c) && !c.attr("required")) ||
              (void 0 === c.attr("data-" + a) && "native" != a) ||
              !(e = d.call(this, c)) ||
              ((e = g(a) || e), !~h.indexOf(e) && h.push(e));
          }, this)
        ),
        !h.length && b(c) && c.attr("data-remote")
          ? this.defer(c, function () {
              var d = {};
              (d[c.attr("name")] = b(c)),
                a
                  .get(c.attr("data-remote"), d)
                  .fail(function (a, b, c) {
                    h.push(g("remote") || c);
                  })
                  .always(function () {
                    i.resolve(h);
                  });
            })
          : i.resolve(h),
        i.promise()
      );
    }),
    (d.prototype.validate = function () {
      var b = this;
      return (
        a
          .when(
            this.$inputs.map(function () {
              return b.validateInput(a(this), !1);
            })
          )
          .then(function () {
            b.toggleSubmit(), b.focusError();
          }),
        this
      );
    }),
    (d.prototype.focusError = function () {
      if (this.options.focus) {
        var b = this.$element.find(".has-error :input:first");
        0 !== b.length &&
          (a("html, body").animate(
            { scrollTop: b.offset().top - d.FOCUS_OFFSET },
            250
          ),
          b.focus());
      }
    }),
    (d.prototype.showErrors = function (b) {
      var c = this.options.html ? "html" : "text",
        d = b.data("bs.validator.errors"),
        e = b.closest(".form-group"),
        f = e.find(".help-block.with-errors"),
        g = e.find(".form-control-feedback");
      d.length &&
        ((d = a("<ul/>")
          .addClass("list-unstyled")
          .append(
            a.map(d, function (b) {
              return a("<li/>")[c](b);
            })
          )),
        void 0 === f.data("bs.validator.originalContent") &&
          f.data("bs.validator.originalContent", f.html()),
        f.empty().append(d),
        e.addClass("has-error has-danger"),
        e.hasClass("has-feedback") &&
          g.removeClass(this.options.feedback.success) &&
          g.addClass(this.options.feedback.error) &&
          e.removeClass("has-success"));
    }),
    (d.prototype.clearErrors = function (a) {
      var c = a.closest(".form-group"),
        d = c.find(".help-block.with-errors"),
        e = c.find(".form-control-feedback");
      d.html(d.data("bs.validator.originalContent")),
        c.removeClass("has-error has-danger has-success"),
        c.hasClass("has-feedback") &&
          e.removeClass(this.options.feedback.error) &&
          e.removeClass(this.options.feedback.success) &&
          b(a) &&
          e.addClass(this.options.feedback.success) &&
          c.addClass("has-success");
    }),
    (d.prototype.hasErrors = function () {
      function b() {
        return !!(a(this).data("bs.validator.errors") || []).length;
      }
      return !!this.$inputs.filter(b).length;
    }),
    (d.prototype.isIncomplete = function () {
      function c() {
        var c = b(a(this));
        return !("string" == typeof c ? a.trim(c) : c);
      }
      return !!this.$inputs.filter("[required]").filter(c).length;
    }),
    (d.prototype.onSubmit = function (a) {
      this.validate(),
        (this.isIncomplete() || this.hasErrors()) && a.preventDefault();
    }),
    (d.prototype.toggleSubmit = function () {
      this.options.disable &&
        this.$btn.toggleClass(
          "disabled",
          this.isIncomplete() || this.hasErrors()
        );
    }),
    (d.prototype.defer = function (b, c) {
      return (
        (c = a.proxy(c, this, b)),
        this.options.delay
          ? (window.clearTimeout(b.data("bs.validator.timeout")),
            void b.data(
              "bs.validator.timeout",
              window.setTimeout(c, this.options.delay)
            ))
          : c()
      );
    }),
    (d.prototype.reset = function () {
      return (
        this.$element
          .find(".form-control-feedback")
          .removeClass(this.options.feedback.error)
          .removeClass(this.options.feedback.success),
        this.$inputs
          .removeData(["bs.validator.errors", "bs.validator.deferred"])
          .each(function () {
            var b = a(this),
              c = b.data("bs.validator.timeout");
            window.clearTimeout(c) && b.removeData("bs.validator.timeout");
          }),
        this.$element.find(".help-block.with-errors").each(function () {
          var b = a(this),
            c = b.data("bs.validator.originalContent");
          b.removeData("bs.validator.originalContent").html(c);
        }),
        this.$btn.removeClass("disabled"),
        this.$element
          .find(".has-error, .has-danger, .has-success")
          .removeClass("has-error has-danger has-success"),
        this
      );
    }),
    (d.prototype.destroy = function () {
      return (
        this.reset(),
        this.$element
          .removeAttr("novalidate")
          .removeData("bs.validator")
          .off(".bs.validator"),
        this.$inputs.off(".bs.validator"),
        (this.options = null),
        (this.validators = null),
        (this.$element = null),
        (this.$btn = null),
        (this.$inputs = null),
        this
      );
    });
  var e = a.fn.validator;
  (a.fn.validator = c),
    (a.fn.validator.Constructor = d),
    (a.fn.validator.noConflict = function () {
      return (a.fn.validator = e), this;
    }),
    a(window).on("load", function () {
      a('form[data-toggle="validator"]').each(function () {
        var b = a(this);
        c.call(b, b.data());
      });
    });
})(jQuery);
/*-----------------------------------------------------------------------------------*/
/*	11. CIRCLE INFO BOX
/*-----------------------------------------------------------------------------------*/
!(function (a) {
  a.fn.s8CircleInfoBox = function (b) {
    var l,
      c = a.extend(
        {
          autoSlide: !0,
          slideSpeed: 3e3,
          notResponsive: !1,
          action: "mouseover",
          responsive: !0,
          breakpoint: 760,
          hoverStyle: "active",
          spreadStyle: "all",
        },
        b
      ),
      d = a(this).find(".dial"),
      e = d.find(".dial-item"),
      f = e.length,
      g = c.spreadStyle.toLowerCase(),
      h = !0,
      i = d.find(".dial-item-info"),
      j = 0,
      k = null,
      m = !1;
    c.notResponsive &&
      (i.addClass("noResponsive"),
      e.addClass("noResponsive"),
      d.addClass("noResponsive"));
    var o,
      n = function () {
        var b = 0;
        switch (g) {
          case "left":
            b = 90;
            break;
          case "top":
            b = 180;
            break;
          case "right":
            b = 270;
            break;
          default:
            b = 0;
        }
        var c = "all" === g ? 360 / f : 180 / (f - 1);
        d.css("height", d.width()),
          (l = d.width() / 2),
          e.css("lineHeight", e.height() + "px"),
          e.each(function () {
            a(this).css({
              transform:
                "rotate(" +
                b +
                "deg) translate(" +
                l +
                "px) rotate(" +
                -1 * b +
                "deg)",
            }),
              (b += c);
          });
      },
      p = function (a) {
        e.removeClass(c.hoverStyle),
          (o = a.attr("data-cyrcleBox")),
          a.addClass(c.hoverStyle),
          i.filter("#" + o).fadeIn();
      },
      q = function (a) {
        i.fadeOut(), a.removeClass(c.hoverStyle);
      };
    if (c.autoSlide) {
      var r = function () {
          return setInterval(function () {
            m || (q(a(e[j])), (j = (j + 1) % f), p(a(e[j])));
          }, c.slideSpeed);
        },
        s = function () {
          k = r();
        };
      d.hover(
        function (a) {
          m = !0;
        },
        function () {
          h || (m = !1);
        }
      );
    }
    e.on(c.action, function () {
      j == a(this).parent().index() ||
        h ||
        (i.fadeOut(), (j = a(this).parent().index()), p(a(this)));
    }),
      a(window).resize(function () {
        c.responsive && !h && n(),
          a(window).width() < c.breakpoint
            ? ((h = !0),
              (m = !0),
              e.removeClass(c.hoverStyle),
              d.css("height", "auto"))
            : ((h = !1), (m = !1), null === k && c.autoSlide && s());
      }),
      a(window).width() >= c.breakpoint && (n(), (h = !1), c.autoSlide && s());
  };
})(jQuery);
/*-----------------------------------------------------------------------------------*/
/*	12. PROGRESSBAR
/*-----------------------------------------------------------------------------------*/
// ProgressBar.js 1.0.1
// https://kimmobrunfeldt.github.io/progressbar.js
// License: MIT
!(function (a) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = a();
  else if ("function" == typeof define && define.amd) define([], a);
  else {
    var b;
    (b =
      "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : this),
      (b.ProgressBar = a());
  }
})(function () {
  var a;
  return (function b(a, c, d) {
    function e(g, h) {
      if (!c[g]) {
        if (!a[g]) {
          var i = "function" == typeof require && require;
          if (!h && i) return i(g, !0);
          if (f) return f(g, !0);
          var j = new Error("Cannot find module '" + g + "'");
          throw ((j.code = "MODULE_NOT_FOUND"), j);
        }
        var k = (c[g] = { exports: {} });
        a[g][0].call(
          k.exports,
          function (b) {
            var c = a[g][1][b];
            return e(c ? c : b);
          },
          k,
          k.exports,
          b,
          a,
          c,
          d
        );
      }
      return c[g].exports;
    }
    for (
      var f = "function" == typeof require && require, g = 0;
      g < d.length;
      g++
    )
      e(d[g]);
    return e;
  })(
    {
      1: [
        function (b, c, d) {
          (function () {
            var b = this || Function("return this")(),
              e = (function () {
                "use strict";
                function e() {}
                function f(a, b) {
                  var c;
                  for (c in a) Object.hasOwnProperty.call(a, c) && b(c);
                }
                function g(a, b) {
                  return (
                    f(b, function (c) {
                      a[c] = b[c];
                    }),
                    a
                  );
                }
                function h(a, b) {
                  f(b, function (c) {
                    "undefined" == typeof a[c] && (a[c] = b[c]);
                  });
                }
                function i(a, b, c, d, e, f, g) {
                  var h,
                    i,
                    k,
                    l = f > a ? 0 : (a - f) / e;
                  for (h in b)
                    b.hasOwnProperty(h) &&
                      ((i = g[h]),
                      (k = "function" == typeof i ? i : o[i]),
                      (b[h] = j(c[h], d[h], k, l)));
                  return b;
                }
                function j(a, b, c, d) {
                  return a + (b - a) * c(d);
                }
                function k(a, b) {
                  var c = n.prototype.filter,
                    d = a._filterArgs;
                  f(c, function (e) {
                    "undefined" != typeof c[e][b] && c[e][b].apply(a, d);
                  });
                }
                function l(a, b, c, d, e, f, g, h, j, l, m) {
                  (v = b + c + d),
                    (w = Math.min(m || u(), v)),
                    (x = w >= v),
                    (y = d - (v - w)),
                    a.isPlaying() &&
                      (x
                        ? (j(g, a._attachment, y), a.stop(!0))
                        : ((a._scheduleId = l(a._timeoutHandler, s)),
                          k(a, "beforeTween"),
                          b + c > w
                            ? i(1, e, f, g, 1, 1, h)
                            : i(w, e, f, g, d, b + c, h),
                          k(a, "afterTween"),
                          j(e, a._attachment, y)));
                }
                function m(a, b) {
                  var c = {},
                    d = typeof b;
                  return (
                    "string" === d || "function" === d
                      ? f(a, function (a) {
                          c[a] = b;
                        })
                      : f(a, function (a) {
                          c[a] || (c[a] = b[a] || q);
                        }),
                    c
                  );
                }
                function n(a, b) {
                  (this._currentState = a || {}),
                    (this._configured = !1),
                    (this._scheduleFunction = p),
                    "undefined" != typeof b && this.setConfig(b);
                }
                var o,
                  p,
                  q = "linear",
                  r = 500,
                  s = 1e3 / 60,
                  t = Date.now
                    ? Date.now
                    : function () {
                        return +new Date();
                      },
                  u =
                    "undefined" != typeof SHIFTY_DEBUG_NOW
                      ? SHIFTY_DEBUG_NOW
                      : t;
                p =
                  "undefined" != typeof window
                    ? window.requestAnimationFrame ||
                      window.webkitRequestAnimationFrame ||
                      window.oRequestAnimationFrame ||
                      window.msRequestAnimationFrame ||
                      (window.mozCancelRequestAnimationFrame &&
                        window.mozRequestAnimationFrame) ||
                      setTimeout
                    : setTimeout;
                var v, w, x, y;
                return (
                  (n.prototype.tween = function (a) {
                    return this._isTweening
                      ? this
                      : ((void 0 === a && this._configured) ||
                          this.setConfig(a),
                        (this._timestamp = u()),
                        this._start(this.get(), this._attachment),
                        this.resume());
                  }),
                  (n.prototype.setConfig = function (a) {
                    (a = a || {}),
                      (this._configured = !0),
                      (this._attachment = a.attachment),
                      (this._pausedAtTime = null),
                      (this._scheduleId = null),
                      (this._delay = a.delay || 0),
                      (this._start = a.start || e),
                      (this._step = a.step || e),
                      (this._finish = a.finish || e),
                      (this._duration = a.duration || r),
                      (this._currentState = g({}, a.from) || this.get()),
                      (this._originalState = this.get()),
                      (this._targetState = g({}, a.to) || this.get());
                    var b = this;
                    this._timeoutHandler = function () {
                      l(
                        b,
                        b._timestamp,
                        b._delay,
                        b._duration,
                        b._currentState,
                        b._originalState,
                        b._targetState,
                        b._easing,
                        b._step,
                        b._scheduleFunction
                      );
                    };
                    var c = this._currentState,
                      d = this._targetState;
                    return (
                      h(d, c),
                      (this._easing = m(c, a.easing || q)),
                      (this._filterArgs = [
                        c,
                        this._originalState,
                        d,
                        this._easing,
                      ]),
                      k(this, "tweenCreated"),
                      this
                    );
                  }),
                  (n.prototype.get = function () {
                    return g({}, this._currentState);
                  }),
                  (n.prototype.set = function (a) {
                    this._currentState = a;
                  }),
                  (n.prototype.pause = function () {
                    return (
                      (this._pausedAtTime = u()), (this._isPaused = !0), this
                    );
                  }),
                  (n.prototype.resume = function () {
                    return (
                      this._isPaused &&
                        (this._timestamp += u() - this._pausedAtTime),
                      (this._isPaused = !1),
                      (this._isTweening = !0),
                      this._timeoutHandler(),
                      this
                    );
                  }),
                  (n.prototype.seek = function (a) {
                    a = Math.max(a, 0);
                    var b = u();
                    return this._timestamp + a === 0
                      ? this
                      : ((this._timestamp = b - a),
                        this.isPlaying() ||
                          ((this._isTweening = !0),
                          (this._isPaused = !1),
                          l(
                            this,
                            this._timestamp,
                            this._delay,
                            this._duration,
                            this._currentState,
                            this._originalState,
                            this._targetState,
                            this._easing,
                            this._step,
                            this._scheduleFunction,
                            b
                          ),
                          this.pause()),
                        this);
                  }),
                  (n.prototype.stop = function (a) {
                    return (
                      (this._isTweening = !1),
                      (this._isPaused = !1),
                      (this._timeoutHandler = e),
                      (
                        b.cancelAnimationFrame ||
                        b.webkitCancelAnimationFrame ||
                        b.oCancelAnimationFrame ||
                        b.msCancelAnimationFrame ||
                        b.mozCancelRequestAnimationFrame ||
                        b.clearTimeout
                      )(this._scheduleId),
                      a &&
                        (k(this, "beforeTween"),
                        i(
                          1,
                          this._currentState,
                          this._originalState,
                          this._targetState,
                          1,
                          0,
                          this._easing
                        ),
                        k(this, "afterTween"),
                        k(this, "afterTweenEnd"),
                        this._finish.call(
                          this,
                          this._currentState,
                          this._attachment
                        )),
                      this
                    );
                  }),
                  (n.prototype.isPlaying = function () {
                    return this._isTweening && !this._isPaused;
                  }),
                  (n.prototype.setScheduleFunction = function (a) {
                    this._scheduleFunction = a;
                  }),
                  (n.prototype.dispose = function () {
                    var a;
                    for (a in this) this.hasOwnProperty(a) && delete this[a];
                  }),
                  (n.prototype.filter = {}),
                  (n.prototype.formula = {
                    linear: function (a) {
                      return a;
                    },
                  }),
                  (o = n.prototype.formula),
                  g(n, {
                    now: u,
                    each: f,
                    tweenProps: i,
                    tweenProp: j,
                    applyFilter: k,
                    shallowCopy: g,
                    defaults: h,
                    composeEasingObject: m,
                  }),
                  "function" == typeof SHIFTY_DEBUG_NOW &&
                    (b.timeoutHandler = l),
                  "object" == typeof d
                    ? (c.exports = n)
                    : "function" == typeof a && a.amd
                    ? a(function () {
                        return n;
                      })
                    : "undefined" == typeof b.Tweenable && (b.Tweenable = n),
                  n
                );
              })();
            !(function () {
              e.shallowCopy(e.prototype.formula, {
                easeInQuad: function (a) {
                  return Math.pow(a, 2);
                },
                easeOutQuad: function (a) {
                  return -(Math.pow(a - 1, 2) - 1);
                },
                easeInOutQuad: function (a) {
                  return (a /= 0.5) < 1
                    ? 0.5 * Math.pow(a, 2)
                    : -0.5 * ((a -= 2) * a - 2);
                },
                easeInCubic: function (a) {
                  return Math.pow(a, 3);
                },
                easeOutCubic: function (a) {
                  return Math.pow(a - 1, 3) + 1;
                },
                easeInOutCubic: function (a) {
                  return (a /= 0.5) < 1
                    ? 0.5 * Math.pow(a, 3)
                    : 0.5 * (Math.pow(a - 2, 3) + 2);
                },
                easeInQuart: function (a) {
                  return Math.pow(a, 4);
                },
                easeOutQuart: function (a) {
                  return -(Math.pow(a - 1, 4) - 1);
                },
                easeInOutQuart: function (a) {
                  return (a /= 0.5) < 1
                    ? 0.5 * Math.pow(a, 4)
                    : -0.5 * ((a -= 2) * Math.pow(a, 3) - 2);
                },
                easeInQuint: function (a) {
                  return Math.pow(a, 5);
                },
                easeOutQuint: function (a) {
                  return Math.pow(a - 1, 5) + 1;
                },
                easeInOutQuint: function (a) {
                  return (a /= 0.5) < 1
                    ? 0.5 * Math.pow(a, 5)
                    : 0.5 * (Math.pow(a - 2, 5) + 2);
                },
                easeInSine: function (a) {
                  return -Math.cos(a * (Math.PI / 2)) + 1;
                },
                easeOutSine: function (a) {
                  return Math.sin(a * (Math.PI / 2));
                },
                easeInOutSine: function (a) {
                  return -0.5 * (Math.cos(Math.PI * a) - 1);
                },
                easeInExpo: function (a) {
                  return 0 === a ? 0 : Math.pow(2, 10 * (a - 1));
                },
                easeOutExpo: function (a) {
                  return 1 === a ? 1 : -Math.pow(2, -10 * a) + 1;
                },
                easeInOutExpo: function (a) {
                  return 0 === a
                    ? 0
                    : 1 === a
                    ? 1
                    : (a /= 0.5) < 1
                    ? 0.5 * Math.pow(2, 10 * (a - 1))
                    : 0.5 * (-Math.pow(2, -10 * --a) + 2);
                },
                easeInCirc: function (a) {
                  return -(Math.sqrt(1 - a * a) - 1);
                },
                easeOutCirc: function (a) {
                  return Math.sqrt(1 - Math.pow(a - 1, 2));
                },
                easeInOutCirc: function (a) {
                  return (a /= 0.5) < 1
                    ? -0.5 * (Math.sqrt(1 - a * a) - 1)
                    : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1);
                },
                easeOutBounce: function (a) {
                  return 1 / 2.75 > a
                    ? 7.5625 * a * a
                    : 2 / 2.75 > a
                    ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75
                    : 2.5 / 2.75 > a
                    ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375
                    : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375;
                },
                easeInBack: function (a) {
                  var b = 1.70158;
                  return a * a * ((b + 1) * a - b);
                },
                easeOutBack: function (a) {
                  var b = 1.70158;
                  return (a -= 1) * a * ((b + 1) * a + b) + 1;
                },
                easeInOutBack: function (a) {
                  var b = 1.70158;
                  return (a /= 0.5) < 1
                    ? 0.5 * (a * a * (((b *= 1.525) + 1) * a - b))
                    : 0.5 * ((a -= 2) * a * (((b *= 1.525) + 1) * a + b) + 2);
                },
                elastic: function (a) {
                  return (
                    -1 *
                      Math.pow(4, -8 * a) *
                      Math.sin(((6 * a - 1) * (2 * Math.PI)) / 2) +
                    1
                  );
                },
                swingFromTo: function (a) {
                  var b = 1.70158;
                  return (a /= 0.5) < 1
                    ? 0.5 * (a * a * (((b *= 1.525) + 1) * a - b))
                    : 0.5 * ((a -= 2) * a * (((b *= 1.525) + 1) * a + b) + 2);
                },
                swingFrom: function (a) {
                  var b = 1.70158;
                  return a * a * ((b + 1) * a - b);
                },
                swingTo: function (a) {
                  var b = 1.70158;
                  return (a -= 1) * a * ((b + 1) * a + b) + 1;
                },
                bounce: function (a) {
                  return 1 / 2.75 > a
                    ? 7.5625 * a * a
                    : 2 / 2.75 > a
                    ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75
                    : 2.5 / 2.75 > a
                    ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375
                    : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375;
                },
                bouncePast: function (a) {
                  return 1 / 2.75 > a
                    ? 7.5625 * a * a
                    : 2 / 2.75 > a
                    ? 2 - (7.5625 * (a -= 1.5 / 2.75) * a + 0.75)
                    : 2.5 / 2.75 > a
                    ? 2 - (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375)
                    : 2 - (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375);
                },
                easeFromTo: function (a) {
                  return (a /= 0.5) < 1
                    ? 0.5 * Math.pow(a, 4)
                    : -0.5 * ((a -= 2) * Math.pow(a, 3) - 2);
                },
                easeFrom: function (a) {
                  return Math.pow(a, 4);
                },
                easeTo: function (a) {
                  return Math.pow(a, 0.25);
                },
              });
            })(),
              (function () {
                function a(a, b, c, d, e, f) {
                  function g(a) {
                    return ((n * a + o) * a + p) * a;
                  }
                  function h(a) {
                    return ((q * a + r) * a + s) * a;
                  }
                  function i(a) {
                    return (3 * n * a + 2 * o) * a + p;
                  }
                  function j(a) {
                    return 1 / (200 * a);
                  }
                  function k(a, b) {
                    return h(m(a, b));
                  }
                  function l(a) {
                    return a >= 0 ? a : 0 - a;
                  }
                  function m(a, b) {
                    var c, d, e, f, h, j;
                    for (e = a, j = 0; 8 > j; j++) {
                      if (((f = g(e) - a), l(f) < b)) return e;
                      if (((h = i(e)), l(h) < 1e-6)) break;
                      e -= f / h;
                    }
                    if (((c = 0), (d = 1), (e = a), c > e)) return c;
                    if (e > d) return d;
                    for (; d > c; ) {
                      if (((f = g(e)), l(f - a) < b)) return e;
                      a > f ? (c = e) : (d = e), (e = 0.5 * (d - c) + c);
                    }
                    return e;
                  }
                  var n = 0,
                    o = 0,
                    p = 0,
                    q = 0,
                    r = 0,
                    s = 0;
                  return (
                    (p = 3 * b),
                    (o = 3 * (d - b) - p),
                    (n = 1 - p - o),
                    (s = 3 * c),
                    (r = 3 * (e - c) - s),
                    (q = 1 - s - r),
                    k(a, j(f))
                  );
                }
                function b(b, c, d, e) {
                  return function (f) {
                    return a(f, b, c, d, e, 1);
                  };
                }
                (e.setBezierFunction = function (a, c, d, f, g) {
                  var h = b(c, d, f, g);
                  return (
                    (h.displayName = a),
                    (h.x1 = c),
                    (h.y1 = d),
                    (h.x2 = f),
                    (h.y2 = g),
                    (e.prototype.formula[a] = h)
                  );
                }),
                  (e.unsetBezierFunction = function (a) {
                    delete e.prototype.formula[a];
                  });
              })(),
              (function () {
                function a(a, b, c, d, f, g) {
                  return e.tweenProps(d, b, a, c, 1, g, f);
                }
                var b = new e();
                (b._filterArgs = []),
                  (e.interpolate = function (c, d, f, g, h) {
                    var i = e.shallowCopy({}, c),
                      j = h || 0,
                      k = e.composeEasingObject(c, g || "linear");
                    b.set({});
                    var l = b._filterArgs;
                    (l.length = 0),
                      (l[0] = i),
                      (l[1] = c),
                      (l[2] = d),
                      (l[3] = k),
                      e.applyFilter(b, "tweenCreated"),
                      e.applyFilter(b, "beforeTween");
                    var m = a(c, i, d, f, k, j);
                    return e.applyFilter(b, "afterTween"), m;
                  });
              })(),
              (function (a) {
                function b(a, b) {
                  var c,
                    d = [],
                    e = a.length;
                  for (c = 0; e > c; c++) d.push("_" + b + "_" + c);
                  return d;
                }
                function c(a) {
                  var b = a.match(v);
                  return (
                    b
                      ? (1 === b.length || a[0].match(u)) && b.unshift("")
                      : (b = ["", ""]),
                    b.join(A)
                  );
                }
                function d(b) {
                  a.each(b, function (a) {
                    var c = b[a];
                    "string" == typeof c && c.match(z) && (b[a] = e(c));
                  });
                }
                function e(a) {
                  return i(z, a, f);
                }
                function f(a) {
                  var b = g(a);
                  return "rgb(" + b[0] + "," + b[1] + "," + b[2] + ")";
                }
                function g(a) {
                  return (
                    (a = a.replace(/#/, "")),
                    3 === a.length &&
                      ((a = a.split("")),
                      (a = a[0] + a[0] + a[1] + a[1] + a[2] + a[2])),
                    (B[0] = h(a.substr(0, 2))),
                    (B[1] = h(a.substr(2, 2))),
                    (B[2] = h(a.substr(4, 2))),
                    B
                  );
                }
                function h(a) {
                  return parseInt(a, 16);
                }
                function i(a, b, c) {
                  var d = b.match(a),
                    e = b.replace(a, A);
                  if (d)
                    for (var f, g = d.length, h = 0; g > h; h++)
                      (f = d.shift()), (e = e.replace(A, c(f)));
                  return e;
                }
                function j(a) {
                  return i(x, a, k);
                }
                function k(a) {
                  for (
                    var b = a.match(w), c = b.length, d = a.match(y)[0], e = 0;
                    c > e;
                    e++
                  )
                    d += parseInt(b[e], 10) + ",";
                  return (d = d.slice(0, -1) + ")");
                }
                function l(d) {
                  var e = {};
                  return (
                    a.each(d, function (a) {
                      var f = d[a];
                      if ("string" == typeof f) {
                        var g = r(f);
                        e[a] = { formatString: c(f), chunkNames: b(g, a) };
                      }
                    }),
                    e
                  );
                }
                function m(b, c) {
                  a.each(c, function (a) {
                    for (
                      var d = b[a], e = r(d), f = e.length, g = 0;
                      f > g;
                      g++
                    )
                      b[c[a].chunkNames[g]] = +e[g];
                    delete b[a];
                  });
                }
                function n(b, c) {
                  a.each(c, function (a) {
                    var d = b[a],
                      e = o(b, c[a].chunkNames),
                      f = p(e, c[a].chunkNames);
                    (d = q(c[a].formatString, f)), (b[a] = j(d));
                  });
                }
                function o(a, b) {
                  for (var c, d = {}, e = b.length, f = 0; e > f; f++)
                    (c = b[f]), (d[c] = a[c]), delete a[c];
                  return d;
                }
                function p(a, b) {
                  C.length = 0;
                  for (var c = b.length, d = 0; c > d; d++) C.push(a[b[d]]);
                  return C;
                }
                function q(a, b) {
                  for (var c = a, d = b.length, e = 0; d > e; e++)
                    c = c.replace(A, +b[e].toFixed(4));
                  return c;
                }
                function r(a) {
                  return a.match(w);
                }
                function s(b, c) {
                  a.each(c, function (a) {
                    var d,
                      e = c[a],
                      f = e.chunkNames,
                      g = f.length,
                      h = b[a];
                    if ("string" == typeof h) {
                      var i = h.split(" "),
                        j = i[i.length - 1];
                      for (d = 0; g > d; d++) b[f[d]] = i[d] || j;
                    } else for (d = 0; g > d; d++) b[f[d]] = h;
                    delete b[a];
                  });
                }
                function t(b, c) {
                  a.each(c, function (a) {
                    var d = c[a],
                      e = d.chunkNames,
                      f = e.length,
                      g = b[e[0]],
                      h = typeof g;
                    if ("string" === h) {
                      for (var i = "", j = 0; f > j; j++)
                        (i += " " + b[e[j]]), delete b[e[j]];
                      b[a] = i.substr(1);
                    } else b[a] = g;
                  });
                }
                var u = /(\d|\-|\.)/,
                  v = /([^\-0-9\.]+)/g,
                  w = /[0-9.\-]+/g,
                  x = new RegExp(
                    "rgb\\(" +
                      w.source +
                      /,\s*/.source +
                      w.source +
                      /,\s*/.source +
                      w.source +
                      "\\)",
                    "g"
                  ),
                  y = /^.*\(/,
                  z = /#([0-9]|[a-f]){3,6}/gi,
                  A = "VAL",
                  B = [],
                  C = [];
                a.prototype.filter.token = {
                  tweenCreated: function (a, b, c, e) {
                    d(a), d(b), d(c), (this._tokenData = l(a));
                  },
                  beforeTween: function (a, b, c, d) {
                    s(d, this._tokenData),
                      m(a, this._tokenData),
                      m(b, this._tokenData),
                      m(c, this._tokenData);
                  },
                  afterTween: function (a, b, c, d) {
                    n(a, this._tokenData),
                      n(b, this._tokenData),
                      n(c, this._tokenData),
                      t(d, this._tokenData);
                  },
                };
              })(e);
          }.call(null));
        },
        {},
      ],
      2: [
        function (a, b, c) {
          var d = a("./shape"),
            e = a("./utils"),
            f = function (a, b) {
              (this._pathTemplate =
                "M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}"),
                (this.containerAspectRatio = 1),
                d.apply(this, arguments);
            };
          (f.prototype = new d()),
            (f.prototype.constructor = f),
            (f.prototype._pathString = function (a) {
              var b = a.strokeWidth;
              a.trailWidth &&
                a.trailWidth > a.strokeWidth &&
                (b = a.trailWidth);
              var c = 50 - b / 2;
              return e.render(this._pathTemplate, {
                radius: c,
                "2radius": 2 * c,
              });
            }),
            (f.prototype._trailString = function (a) {
              return this._pathString(a);
            }),
            (b.exports = f);
        },
        { "./shape": 7, "./utils": 8 },
      ],
      3: [
        function (a, b, c) {
          var d = a("./shape"),
            e = a("./utils"),
            f = function (a, b) {
              (this._pathTemplate = "M 0,{center} L 100,{center}"),
                d.apply(this, arguments);
            };
          (f.prototype = new d()),
            (f.prototype.constructor = f),
            (f.prototype._initializeSvg = function (a, b) {
              a.setAttribute("viewBox", "0 0 100 " + b.strokeWidth),
                a.setAttribute("preserveAspectRatio", "none");
            }),
            (f.prototype._pathString = function (a) {
              return e.render(this._pathTemplate, {
                center: a.strokeWidth / 2,
              });
            }),
            (f.prototype._trailString = function (a) {
              return this._pathString(a);
            }),
            (b.exports = f);
        },
        { "./shape": 7, "./utils": 8 },
      ],
      4: [
        function (a, b, c) {
          b.exports = {
            Line: a("./line"),
            Circle: a("./circle"),
            SemiCircle: a("./semicircle"),
            Path: a("./path"),
            Shape: a("./shape"),
            utils: a("./utils"),
          };
        },
        {
          "./circle": 2,
          "./line": 3,
          "./path": 5,
          "./semicircle": 6,
          "./shape": 7,
          "./utils": 8,
        },
      ],
      5: [
        function (a, b, c) {
          var d = a("shifty"),
            e = a("./utils"),
            f = {
              easeIn: "easeInCubic",
              easeOut: "easeOutCubic",
              easeInOut: "easeInOutCubic",
            },
            g = function h(a, b) {
              if (!(this instanceof h))
                throw new Error("Constructor was called without new keyword");
              b = e.extend(
                {
                  duration: 800,
                  easing: "linear",
                  from: {},
                  to: {},
                  step: function () {},
                },
                b
              );
              var c;
              (c = e.isString(a) ? document.querySelector(a) : a),
                (this.path = c),
                (this._opts = b),
                (this._tweenable = null);
              var d = this.path.getTotalLength();
              (this.path.style.strokeDasharray = d + " " + d), this.set(0);
            };
          (g.prototype.value = function () {
            var a = this._getComputedDashOffset(),
              b = this.path.getTotalLength(),
              c = 1 - a / b;
            return parseFloat(c.toFixed(6), 10);
          }),
            (g.prototype.set = function (a) {
              this.stop(),
                (this.path.style.strokeDashoffset = this._progressToOffset(a));
              var b = this._opts.step;
              if (e.isFunction(b)) {
                var c = this._easing(this._opts.easing),
                  d = this._calculateTo(a, c),
                  f = this._opts.shape || this;
                b(d, f, this._opts.attachment);
              }
            }),
            (g.prototype.stop = function () {
              this._stopTween(),
                (this.path.style.strokeDashoffset =
                  this._getComputedDashOffset());
            }),
            (g.prototype.animate = function (a, b, c) {
              (b = b || {}), e.isFunction(b) && ((c = b), (b = {}));
              var f = e.extend({}, b),
                g = e.extend({}, this._opts);
              b = e.extend(g, b);
              var h = this._easing(b.easing),
                i = this._resolveFromAndTo(a, h, f);
              this.stop(), this.path.getBoundingClientRect();
              var j = this._getComputedDashOffset(),
                k = this._progressToOffset(a),
                l = this;
              (this._tweenable = new d()),
                this._tweenable.tween({
                  from: e.extend({ offset: j }, i.from),
                  to: e.extend({ offset: k }, i.to),
                  duration: b.duration,
                  easing: h,
                  step: function (a) {
                    l.path.style.strokeDashoffset = a.offset;
                    var c = b.shape || l;
                    b.step(a, c, b.attachment);
                  },
                  finish: function (a) {
                    e.isFunction(c) && c();
                  },
                });
            }),
            (g.prototype._getComputedDashOffset = function () {
              var a = window.getComputedStyle(this.path, null);
              return parseFloat(a.getPropertyValue("stroke-dashoffset"), 10);
            }),
            (g.prototype._progressToOffset = function (a) {
              var b = this.path.getTotalLength();
              return b - a * b;
            }),
            (g.prototype._resolveFromAndTo = function (a, b, c) {
              return c.from && c.to
                ? { from: c.from, to: c.to }
                : { from: this._calculateFrom(b), to: this._calculateTo(a, b) };
            }),
            (g.prototype._calculateFrom = function (a) {
              return d.interpolate(
                this._opts.from,
                this._opts.to,
                this.value(),
                a
              );
            }),
            (g.prototype._calculateTo = function (a, b) {
              return d.interpolate(this._opts.from, this._opts.to, a, b);
            }),
            (g.prototype._stopTween = function () {
              null !== this._tweenable &&
                (this._tweenable.stop(), (this._tweenable = null));
            }),
            (g.prototype._easing = function (a) {
              return f.hasOwnProperty(a) ? f[a] : a;
            }),
            (b.exports = g);
        },
        { "./utils": 8, shifty: 1 },
      ],
      6: [
        function (a, b, c) {
          var d = a("./shape"),
            e = a("./circle"),
            f = a("./utils"),
            g = function (a, b) {
              (this._pathTemplate =
                "M 50,50 m -{radius},0 a {radius},{radius} 0 1 1 {2radius},0"),
                (this.containerAspectRatio = 2),
                d.apply(this, arguments);
            };
          (g.prototype = new d()),
            (g.prototype.constructor = g),
            (g.prototype._initializeSvg = function (a, b) {
              a.setAttribute("viewBox", "0 0 100 50");
            }),
            (g.prototype._initializeTextContainer = function (a, b, c) {
              a.text.style &&
                ((c.style.top = "auto"),
                (c.style.bottom = "0"),
                a.text.alignToBottom
                  ? f.setStyle(c, "transform", "translate(-50%, 0)")
                  : f.setStyle(c, "transform", "translate(-50%, 50%)"));
            }),
            (g.prototype._pathString = e.prototype._pathString),
            (g.prototype._trailString = e.prototype._trailString),
            (b.exports = g);
        },
        { "./circle": 2, "./shape": 7, "./utils": 8 },
      ],
      7: [
        function (a, b, c) {
          var d = a("./path"),
            e = a("./utils"),
            f = "Object is destroyed",
            g = function h(a, b) {
              if (!(this instanceof h))
                throw new Error("Constructor was called without new keyword");
              if (0 !== arguments.length) {
                (this._opts = e.extend(
                  {
                    color: "#555",
                    strokeWidth: 1,
                    trailColor: null,
                    trailWidth: null,
                    fill: null,
                    text: {
                      style: {
                        color: null,
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        padding: 0,
                        margin: 0,
                        transform: {
                          prefix: !0,
                          value: "translate(-50%, -50%)",
                        },
                      },
                      autoStyleContainer: !0,
                      alignToBottom: !0,
                      value: null,
                      className: "progressbar-text",
                    },
                    svgStyle: { display: "block", width: "100%" },
                    warnings: !1,
                  },
                  b,
                  !0
                )),
                  e.isObject(b) &&
                    void 0 !== b.svgStyle &&
                    (this._opts.svgStyle = b.svgStyle),
                  e.isObject(b) &&
                    e.isObject(b.text) &&
                    void 0 !== b.text.style &&
                    (this._opts.text.style = b.text.style);
                var c,
                  f = this._createSvgView(this._opts);
                if (((c = e.isString(a) ? document.querySelector(a) : a), !c))
                  throw new Error("Container does not exist: " + a);
                (this._container = c),
                  this._container.appendChild(f.svg),
                  this._opts.warnings &&
                    this._warnContainerAspectRatio(this._container),
                  this._opts.svgStyle &&
                    e.setStyles(f.svg, this._opts.svgStyle),
                  (this.svg = f.svg),
                  (this.path = f.path),
                  (this.trail = f.trail),
                  (this.text = null);
                var g = e.extend(
                  { attachment: void 0, shape: this },
                  this._opts
                );
                (this._progressPath = new d(f.path, g)),
                  e.isObject(this._opts.text) &&
                    null !== this._opts.text.value &&
                    this.setText(this._opts.text.value);
              }
            };
          (g.prototype.animate = function (a, b, c) {
            if (null === this._progressPath) throw new Error(f);
            this._progressPath.animate(a, b, c);
          }),
            (g.prototype.stop = function () {
              if (null === this._progressPath) throw new Error(f);
              void 0 !== this._progressPath && this._progressPath.stop();
            }),
            (g.prototype.destroy = function () {
              if (null === this._progressPath) throw new Error(f);
              this.stop(),
                this.svg.parentNode.removeChild(this.svg),
                (this.svg = null),
                (this.path = null),
                (this.trail = null),
                (this._progressPath = null),
                null !== this.text &&
                  (this.text.parentNode.removeChild(this.text),
                  (this.text = null));
            }),
            (g.prototype.set = function (a) {
              if (null === this._progressPath) throw new Error(f);
              this._progressPath.set(a);
            }),
            (g.prototype.value = function () {
              if (null === this._progressPath) throw new Error(f);
              return void 0 === this._progressPath
                ? 0
                : this._progressPath.value();
            }),
            (g.prototype.setText = function (a) {
              if (null === this._progressPath) throw new Error(f);
              null === this.text &&
                ((this.text = this._createTextContainer(
                  this._opts,
                  this._container
                )),
                this._container.appendChild(this.text)),
                e.isObject(a)
                  ? (e.removeChildren(this.text), this.text.appendChild(a))
                  : (this.text.innerHTML = a);
            }),
            (g.prototype._createSvgView = function (a) {
              var b = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              );
              this._initializeSvg(b, a);
              var c = null;
              (a.trailColor || a.trailWidth) &&
                ((c = this._createTrail(a)), b.appendChild(c));
              var d = this._createPath(a);
              return b.appendChild(d), { svg: b, path: d, trail: c };
            }),
            (g.prototype._initializeSvg = function (a, b) {
              a.setAttribute("viewBox", "0 0 100 100");
            }),
            (g.prototype._createPath = function (a) {
              var b = this._pathString(a);
              return this._createPathElement(b, a);
            }),
            (g.prototype._createTrail = function (a) {
              var b = this._trailString(a),
                c = e.extend({}, a);
              return (
                c.trailColor || (c.trailColor = "#eee"),
                c.trailWidth || (c.trailWidth = c.strokeWidth),
                (c.color = c.trailColor),
                (c.strokeWidth = c.trailWidth),
                (c.fill = null),
                this._createPathElement(b, c)
              );
            }),
            (g.prototype._createPathElement = function (a, b) {
              var c = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              return (
                c.setAttribute("d", a),
                c.setAttribute("stroke", b.color),
                c.setAttribute("stroke-width", b.strokeWidth),
                b.fill
                  ? c.setAttribute("fill", b.fill)
                  : c.setAttribute("fill-opacity", "0"),
                c
              );
            }),
            (g.prototype._createTextContainer = function (a, b) {
              var c = document.createElement("div");
              c.className = a.text.className;
              var d = a.text.style;
              return (
                d &&
                  (a.text.autoStyleContainer && (b.style.position = "relative"),
                  e.setStyles(c, d),
                  d.color || (c.style.color = a.color)),
                this._initializeTextContainer(a, b, c),
                c
              );
            }),
            (g.prototype._initializeTextContainer = function (a, b, c) {}),
            (g.prototype._pathString = function (a) {
              throw new Error("Override this function for each progress bar");
            }),
            (g.prototype._trailString = function (a) {
              throw new Error("Override this function for each progress bar");
            }),
            (g.prototype._warnContainerAspectRatio = function (a) {
              if (this.containerAspectRatio) {
                var b = window.getComputedStyle(a, null),
                  c = parseFloat(b.getPropertyValue("width"), 10),
                  d = parseFloat(b.getPropertyValue("height"), 10);
                e.floatEquals(this.containerAspectRatio, c / d) ||
                  (console.warn(
                    "Incorrect aspect ratio of container",
                    "#" + a.id,
                    "detected:",
                    b.getPropertyValue("width") + "(width)",
                    "/",
                    b.getPropertyValue("height") + "(height)",
                    "=",
                    c / d
                  ),
                  console.warn(
                    "Aspect ratio of should be",
                    this.containerAspectRatio
                  ));
              }
            }),
            (b.exports = g);
        },
        { "./path": 5, "./utils": 8 },
      ],
      8: [
        function (a, b, c) {
          function d(a, b, c) {
            (a = a || {}), (b = b || {}), (c = c || !1);
            for (var e in b)
              if (b.hasOwnProperty(e)) {
                var f = a[e],
                  g = b[e];
                c && l(f) && l(g) ? (a[e] = d(f, g, c)) : (a[e] = g);
              }
            return a;
          }
          function e(a, b) {
            var c = a;
            for (var d in b)
              if (b.hasOwnProperty(d)) {
                var e = b[d],
                  f = "\\{" + d + "\\}",
                  g = new RegExp(f, "g");
                c = c.replace(g, e);
              }
            return c;
          }
          function f(a, b, c) {
            for (var d = a.style, e = 0; e < p.length; ++e) {
              var f = p[e];
              d[f + h(b)] = c;
            }
            d[b] = c;
          }
          function g(a, b) {
            m(b, function (b, c) {
              null !== b &&
                void 0 !== b &&
                (l(b) && b.prefix === !0 ? f(a, c, b.value) : (a.style[c] = b));
            });
          }
          function h(a) {
            return a.charAt(0).toUpperCase() + a.slice(1);
          }
          function i(a) {
            return "string" == typeof a || a instanceof String;
          }
          function j(a) {
            return "function" == typeof a;
          }
          function k(a) {
            return "[object Array]" === Object.prototype.toString.call(a);
          }
          function l(a) {
            if (k(a)) return !1;
            var b = typeof a;
            return "object" === b && !!a;
          }
          function m(a, b) {
            for (var c in a)
              if (a.hasOwnProperty(c)) {
                var d = a[c];
                b(d, c);
              }
          }
          function n(a, b) {
            return Math.abs(a - b) < q;
          }
          function o(a) {
            for (; a.firstChild; ) a.removeChild(a.firstChild);
          }
          var p = "Webkit Moz O ms".split(" "),
            q = 0.001;
          b.exports = {
            extend: d,
            render: e,
            setStyle: f,
            setStyles: g,
            capitalize: h,
            isString: i,
            isFunction: j,
            isObject: l,
            forEachObject: m,
            floatEquals: n,
            removeChildren: o,
          };
        },
        {},
      ],
    },
    {},
    [4]
  )(4);
});
/*-----------------------------------------------------------------------------------*/
/*	13. WAYPOINTS
/*-----------------------------------------------------------------------------------*/
// Generated by CoffeeScript 1.6.2
/*
jQuery Waypoints - v2.0.3
Copyright (c) 2011-2013 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function () {
  var t =
      [].indexOf ||
      function (t) {
        for (var e = 0, n = this.length; e < n; e++) {
          if (e in this && this[e] === t) return e;
        }
        return -1;
      },
    e = [].slice;
  (function (t, e) {
    if (typeof define === "function" && define.amd) {
      return define("waypoints", ["jquery"], function (n) {
        return e(n, t);
      });
    } else {
      return e(t.jQuery, t);
    }
  })(this, function (n, r) {
    var i, o, l, s, f, u, a, c, h, d, p, y, v, w, g, m;
    i = n(r);
    c = t.call(r, "ontouchstart") >= 0;
    s = { horizontal: {}, vertical: {} };
    f = 1;
    a = {};
    u = "waypoints-context-id";
    p = "resize.waypoints";
    y = "scroll.waypoints";
    v = 1;
    w = "waypoints-waypoint-ids";
    g = "waypoint";
    m = "waypoints";
    o = (function () {
      function t(t) {
        var e = this;
        this.$element = t;
        this.element = t[0];
        this.didResize = false;
        this.didScroll = false;
        this.id = "context" + f++;
        this.oldScroll = { x: t.scrollLeft(), y: t.scrollTop() };
        this.waypoints = { horizontal: {}, vertical: {} };
        t.data(u, this.id);
        a[this.id] = this;
        t.bind(y, function () {
          var t;
          if (!(e.didScroll || c)) {
            e.didScroll = true;
            t = function () {
              e.doScroll();
              return (e.didScroll = false);
            };
            return r.setTimeout(t, n[m].settings.scrollThrottle);
          }
        });
        t.bind(p, function () {
          var t;
          if (!e.didResize) {
            e.didResize = true;
            t = function () {
              n[m]("refresh");
              return (e.didResize = false);
            };
            return r.setTimeout(t, n[m].settings.resizeThrottle);
          }
        });
      }
      t.prototype.doScroll = function () {
        var t,
          e = this;
        t = {
          horizontal: {
            newScroll: this.$element.scrollLeft(),
            oldScroll: this.oldScroll.x,
            forward: "right",
            backward: "left",
          },
          vertical: {
            newScroll: this.$element.scrollTop(),
            oldScroll: this.oldScroll.y,
            forward: "down",
            backward: "up",
          },
        };
        if (c && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
          n[m]("refresh");
        }
        n.each(t, function (t, r) {
          var i, o, l;
          l = [];
          o = r.newScroll > r.oldScroll;
          i = o ? r.forward : r.backward;
          n.each(e.waypoints[t], function (t, e) {
            var n, i;
            if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
              return l.push(e);
            } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
              return l.push(e);
            }
          });
          l.sort(function (t, e) {
            return t.offset - e.offset;
          });
          if (!o) {
            l.reverse();
          }
          return n.each(l, function (t, e) {
            if (e.options.continuous || t === l.length - 1) {
              return e.trigger([i]);
            }
          });
        });
        return (this.oldScroll = {
          x: t.horizontal.newScroll,
          y: t.vertical.newScroll,
        });
      };
      t.prototype.refresh = function () {
        var t,
          e,
          r,
          i = this;
        r = n.isWindow(this.element);
        e = this.$element.offset();
        this.doScroll();
        t = {
          horizontal: {
            contextOffset: r ? 0 : e.left,
            contextScroll: r ? 0 : this.oldScroll.x,
            contextDimension: this.$element.width(),
            oldScroll: this.oldScroll.x,
            forward: "right",
            backward: "left",
            offsetProp: "left",
          },
          vertical: {
            contextOffset: r ? 0 : e.top,
            contextScroll: r ? 0 : this.oldScroll.y,
            contextDimension: r
              ? n[m]("viewportHeight")
              : this.$element.height(),
            oldScroll: this.oldScroll.y,
            forward: "down",
            backward: "up",
            offsetProp: "top",
          },
        };
        return n.each(t, function (t, e) {
          return n.each(i.waypoints[t], function (t, r) {
            var i, o, l, s, f;
            i = r.options.offset;
            l = r.offset;
            o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
            if (n.isFunction(i)) {
              i = i.apply(r.element);
            } else if (typeof i === "string") {
              i = parseFloat(i);
              if (r.options.offset.indexOf("%") > -1) {
                i = Math.ceil((e.contextDimension * i) / 100);
              }
            }
            r.offset = o - e.contextOffset + e.contextScroll - i;
            if ((r.options.onlyOnScroll && l != null) || !r.enabled) {
              return;
            }
            if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
              return r.trigger([e.backward]);
            } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
              return r.trigger([e.forward]);
            } else if (l === null && e.oldScroll >= r.offset) {
              return r.trigger([e.forward]);
            }
          });
        });
      };
      t.prototype.checkEmpty = function () {
        if (
          n.isEmptyObject(this.waypoints.horizontal) &&
          n.isEmptyObject(this.waypoints.vertical)
        ) {
          this.$element.unbind([p, y].join(" "));
          return delete a[this.id];
        }
      };
      return t;
    })();
    l = (function () {
      function t(t, e, r) {
        var i, o;
        r = n.extend({}, n.fn[g].defaults, r);
        if (r.offset === "bottom-in-view") {
          r.offset = function () {
            var t;
            t = n[m]("viewportHeight");
            if (!n.isWindow(e.element)) {
              t = e.$element.height();
            }
            return t - n(this).outerHeight();
          };
        }
        this.$element = t;
        this.element = t[0];
        this.axis = r.horizontal ? "horizontal" : "vertical";
        this.callback = r.handler;
        this.context = e;
        this.enabled = r.enabled;
        this.id = "waypoints" + v++;
        this.offset = null;
        this.options = r;
        e.waypoints[this.axis][this.id] = this;
        s[this.axis][this.id] = this;
        i = (o = t.data(w)) != null ? o : [];
        i.push(this.id);
        t.data(w, i);
      }
      t.prototype.trigger = function (t) {
        if (!this.enabled) {
          return;
        }
        if (this.callback != null) {
          this.callback.apply(this.element, t);
        }
        if (this.options.triggerOnce) {
          return this.destroy();
        }
      };
      t.prototype.disable = function () {
        return (this.enabled = false);
      };
      t.prototype.enable = function () {
        this.context.refresh();
        return (this.enabled = true);
      };
      t.prototype.destroy = function () {
        delete s[this.axis][this.id];
        delete this.context.waypoints[this.axis][this.id];
        return this.context.checkEmpty();
      };
      t.getWaypointsByElement = function (t) {
        var e, r;
        r = n(t).data(w);
        if (!r) {
          return [];
        }
        e = n.extend({}, s.horizontal, s.vertical);
        return n.map(r, function (t) {
          return e[t];
        });
      };
      return t;
    })();
    d = {
      init: function (t, e) {
        var r;
        if (e == null) {
          e = {};
        }
        if ((r = e.handler) == null) {
          e.handler = t;
        }
        this.each(function () {
          var t, r, i, s;
          t = n(this);
          i = (s = e.context) != null ? s : n.fn[g].defaults.context;
          if (!n.isWindow(i)) {
            i = t.closest(i);
          }
          i = n(i);
          r = a[i.data(u)];
          if (!r) {
            r = new o(i);
          }
          return new l(t, r, e);
        });
        n[m]("refresh");
        return this;
      },
      disable: function () {
        return d._invoke(this, "disable");
      },
      enable: function () {
        return d._invoke(this, "enable");
      },
      destroy: function () {
        return d._invoke(this, "destroy");
      },
      prev: function (t, e) {
        return d._traverse.call(this, t, e, function (t, e, n) {
          if (e > 0) {
            return t.push(n[e - 1]);
          }
        });
      },
      next: function (t, e) {
        return d._traverse.call(this, t, e, function (t, e, n) {
          if (e < n.length - 1) {
            return t.push(n[e + 1]);
          }
        });
      },
      _traverse: function (t, e, i) {
        var o, l;
        if (t == null) {
          t = "vertical";
        }
        if (e == null) {
          e = r;
        }
        l = h.aggregate(e);
        o = [];
        this.each(function () {
          var e;
          e = n.inArray(this, l[t]);
          return i(o, e, l[t]);
        });
        return this.pushStack(o);
      },
      _invoke: function (t, e) {
        t.each(function () {
          var t;
          t = l.getWaypointsByElement(this);
          return n.each(t, function (t, n) {
            n[e]();
            return true;
          });
        });
        return this;
      },
    };
    n.fn[g] = function () {
      var t, r;
      (r = arguments[0]),
        (t = 2 <= arguments.length ? e.call(arguments, 1) : []);
      if (d[r]) {
        return d[r].apply(this, t);
      } else if (n.isFunction(r)) {
        return d.init.apply(this, arguments);
      } else if (n.isPlainObject(r)) {
        return d.init.apply(this, [null, r]);
      } else if (!r) {
        return n.error(
          "jQuery Waypoints needs a callback function or handler option."
        );
      } else {
        return n.error(
          "The " + r + " method does not exist in jQuery Waypoints."
        );
      }
    };
    n.fn[g].defaults = {
      context: r,
      continuous: true,
      enabled: true,
      horizontal: false,
      offset: 0,
      triggerOnce: false,
    };
    h = {
      refresh: function () {
        return n.each(a, function (t, e) {
          return e.refresh();
        });
      },
      viewportHeight: function () {
        var t;
        return (t = r.innerHeight) != null ? t : i.height();
      },
      aggregate: function (t) {
        var e, r, i;
        e = s;
        if (t) {
          e = (i = a[n(t).data(u)]) != null ? i.waypoints : void 0;
        }
        if (!e) {
          return [];
        }
        r = { horizontal: [], vertical: [] };
        n.each(r, function (t, i) {
          n.each(e[t], function (t, e) {
            return i.push(e);
          });
          i.sort(function (t, e) {
            return t.offset - e.offset;
          });
          r[t] = n.map(i, function (t) {
            return t.element;
          });
          return (r[t] = n.unique(r[t]));
        });
        return r;
      },
      above: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "vertical", function (t, e) {
          return e.offset <= t.oldScroll.y;
        });
      },
      below: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "vertical", function (t, e) {
          return e.offset > t.oldScroll.y;
        });
      },
      left: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "horizontal", function (t, e) {
          return e.offset <= t.oldScroll.x;
        });
      },
      right: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "horizontal", function (t, e) {
          return e.offset > t.oldScroll.x;
        });
      },
      enable: function () {
        return h._invoke("enable");
      },
      disable: function () {
        return h._invoke("disable");
      },
      destroy: function () {
        return h._invoke("destroy");
      },
      extendFn: function (t, e) {
        return (d[t] = e);
      },
      _invoke: function (t) {
        var e;
        e = n.extend({}, s.vertical, s.horizontal);
        return n.each(e, function (e, n) {
          n[t]();
          return true;
        });
      },
      _filter: function (t, e, r) {
        var i, o;
        i = a[n(t).data(u)];
        if (!i) {
          return [];
        }
        o = [];
        n.each(i.waypoints[e], function (t, e) {
          if (r(i, e)) {
            return o.push(e);
          }
        });
        o.sort(function (t, e) {
          return t.offset - e.offset;
        });
        return n.map(o, function (t) {
          return t.element;
        });
      },
    };
    n[m] = function () {
      var t, n;
      (n = arguments[0]),
        (t = 2 <= arguments.length ? e.call(arguments, 1) : []);
      if (h[n]) {
        return h[n].apply(null, t);
      } else {
        return h.aggregate.call(null, n);
      }
    };
    n[m].settings = { resizeThrottle: 100, scrollThrottle: 30 };
    return i.load(function () {
      return n[m]("refresh");
    });
  });
}.call(this));
/*-----------------------------------------------------------------------------------*/
/*	14. COUNTER UP
/*-----------------------------------------------------------------------------------*/
/*!
 * jquery.counterup.js 1.0
 *
 * Copyright 2013, Benjamin Intal http://gambit.ph @bfintal
 * Released under the GPL v2 License
 *
 * Date: Nov 26, 2013
 */ (function (e) {
  "use strict";
  e.fn.counterUp = function (t) {
    var n = e.extend({ time: 400, delay: 10 }, t);
    return this.each(function () {
      var t = e(this),
        r = n,
        i = function () {
          var e = [],
            n = r.time / r.delay,
            i = t.text(),
            s = /[0-9]+,[0-9]+/.test(i);
          i = i.replace(/,/g, "");
          var o = /^[0-9]+$/.test(i),
            u = /^[0-9]+\.[0-9]+$/.test(i),
            a = u ? (i.split(".")[1] || []).length : 0;
          for (var f = n; f >= 1; f--) {
            var l = parseInt((i / n) * f);
            u && (l = parseFloat((i / n) * f).toFixed(a));
            if (s)
              while (/(\d+)(\d{3})/.test(l.toString()))
                l = l.toString().replace(/(\d+)(\d{3})/, "$1,$2");
            e.unshift(l);
          }
          t.data("counterup-nums", e);
          t.text("0");
          var c = function () {
            t.text(t.data("counterup-nums").shift());
            if (t.data("counterup-nums").length)
              setTimeout(t.data("counterup-func"), r.delay);
            else {
              delete t.data("counterup-nums");
              t.data("counterup-nums", null);
              t.data("counterup-func", null);
            }
          };
          t.data("counterup-func", c);
          setTimeout(t.data("counterup-func"), r.delay);
        };
      t.waypoint(i, { offset: "100%", triggerOnce: !0 });
    });
  };
})(jQuery);
/*-----------------------------------------------------------------------------------*/
/*	15. COUNTDOWN
/*-----------------------------------------------------------------------------------*/
/*!
 * Countdown v0.1.0
 * https://github.com/fengyuanchen/countdown
 *
 * Copyright 2014 Fengyuan Chen
 * Released under the MIT license
 */
!(function (a) {
  "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery);
})(function (a) {
  "use strict";
  var b = function (c, d) {
    (this.$element = a(c)),
      (this.defaults = a.extend(
        {},
        b.defaults,
        this.$element.data(),
        a.isPlainObject(d) ? d : {}
      )),
      this.init();
  };
  (b.prototype = {
    constructor: b,
    init: function () {
      var a = this.$element.html(),
        b = new Date(this.defaults.date || a);
      b.getTime() &&
        ((this.content = a),
        (this.date = b),
        this.find(),
        this.defaults.autoStart && this.start());
    },
    find: function () {
      var a = this.$element;
      (this.$days = a.find("[data-days]")),
        (this.$hours = a.find("[data-hours]")),
        (this.$minutes = a.find("[data-minutes]")),
        (this.$seconds = a.find("[data-seconds]")),
        this.$days.length +
          this.$hours.length +
          this.$minutes.length +
          this.$seconds.length >
          0 && (this.found = !0);
    },
    reset: function () {
      this.found
        ? (this.output("days"),
          this.output("hours"),
          this.output("minutes"),
          this.output("seconds"))
        : this.output();
    },
    ready: function () {
      var a,
        b = this.date,
        c = 100,
        d = 1e3,
        e = 6e4,
        f = 36e5,
        g = 864e5,
        h = {};
      return b
        ? ((a = b.getTime() - new Date().getTime()),
          0 >= a
            ? (this.end(), !1)
            : ((h.days = a),
              (h.hours = h.days % g),
              (h.minutes = h.hours % f),
              (h.seconds = h.minutes % e),
              (h.milliseconds = h.seconds % d),
              (this.days = Math.floor(h.days / g)),
              (this.hours = Math.floor(h.hours / f)),
              (this.minutes = Math.floor(h.minutes / e)),
              (this.seconds = Math.floor(h.seconds / d)),
              (this.deciseconds = Math.floor(h.milliseconds / c)),
              !0))
        : !1;
    },
    start: function () {
      !this.active &&
        this.ready() &&
        ((this.active = !0),
        this.reset(),
        (this.autoUpdate = this.defaults.fast
          ? setInterval(a.proxy(this.fastUpdate, this), 100)
          : setInterval(a.proxy(this.update, this), 1e3)));
    },
    stop: function () {
      this.active && ((this.active = !1), clearInterval(this.autoUpdate));
    },
    end: function () {
      this.date &&
        (this.stop(),
        (this.days = 0),
        (this.hours = 0),
        (this.minutes = 0),
        (this.seconds = 0),
        (this.deciseconds = 0),
        this.reset(),
        this.defaults.end());
    },
    destroy: function () {
      this.date &&
        (this.stop(),
        (this.$days = null),
        (this.$hours = null),
        (this.$minutes = null),
        (this.$seconds = null),
        this.$element.empty().html(this.content),
        this.$element.removeData("countdown"));
    },
    fastUpdate: function () {
      --this.deciseconds >= 0
        ? this.output("deciseconds")
        : ((this.deciseconds = 9), this.update());
    },
    update: function () {
      --this.seconds >= 0
        ? this.output("seconds")
        : ((this.seconds = 59),
          --this.minutes >= 0
            ? this.output("minutes")
            : ((this.minutes = 59),
              --this.hours >= 0
                ? this.output("hours")
                : ((this.hours = 23),
                  --this.days >= 0 ? this.output("days") : this.end())));
    },
    output: function (a) {
      if (!this.found) return void this.$element.empty().html(this.template());
      switch (a) {
        case "deciseconds":
          this.$seconds.text(this.getSecondsText());
          break;
        case "seconds":
          this.$seconds.text(this.seconds);
          break;
        case "minutes":
          this.$minutes.text(this.minutes);
          break;
        case "hours":
          this.$hours.text(this.hours);
          break;
        case "days":
          this.$days.text(this.days);
      }
    },
    template: function () {
      return this.defaults.text
        .replace("%s", this.days)
        .replace("%s", this.hours)
        .replace("%s", this.minutes)
        .replace("%s", this.getSecondsText());
    },
    getSecondsText: function () {
      return this.active && this.defaults.fast
        ? this.seconds + "." + this.deciseconds
        : this.seconds;
    },
  }),
    (b.defaults = {
      autoStart: !0,
      date: null,
      fast: !1,
      end: a.noop,
      text: "%s days, %s hours, %s minutes, %s seconds",
    }),
    (b.setDefaults = function (c) {
      a.extend(b.defaults, c);
    }),
    (a.fn.countdown = function (c) {
      return this.each(function () {
        var d = a(this),
          e = d.data("countdown");
        e || d.data("countdown", (e = new b(this, c))),
          "string" == typeof c && a.isFunction(e[c]) && e[c]();
      });
    }),
    (a.fn.countdown.constructor = b),
    (a.fn.countdown.setDefaults = b.setDefaults),
    a(function () {
      a("[countdown]").countdown();
    });
});
/*-----------------------------------------------------------------------------------*/
/*	16. VIDEO WRAPPER
/*-----------------------------------------------------------------------------------*/
!(function (a, b, c, d) {
  "use strict";
  function e(b, c) {
    function d() {
      (e.options.originalVideoW = e.options.$video[0].videoWidth),
        (e.options.originalVideoH = e.options.$video[0].videoHeight),
        e.initialised || e.init();
    }
    var e = this;
    (this.element = b),
      (this.options = a.extend({}, g, c)),
      (this._defaults = g),
      (this._name = f),
      (this.options.$video = a(b)),
      this.detectBrowser(),
      this.shimRequestAnimationFrame(),
      (this.options.has3d = this.detect3d()),
      this.options.$videoWrap.css({
        position: "relative",
        overflow: "hidden",
        "z-index": "10",
      }),
      this.options.$video.css({ position: "absolute", "z-index": "1" }),
      this.options.$video.on("canplay canplaythrough", d),
      this.options.$video[0].readyState > 3 && d();
  }
  var f = "backgroundVideo",
    g = {
      $videoWrap: a(".video-wrapper-inner"),
      $outerWrap: a(b),
      $window: a(b),
      minimumVideoWidth: 400,
      preventContextMenu: !1,
      parallax: !0,
      parallaxOptions: { effect: 1.5 },
      pauseVideoOnViewLoss: !1,
    };
  (e.prototype = {
    init: function () {
      var a = this;
      (this.initialised = !0),
        (this.lastPosition = -1),
        (this.ticking = !1),
        this.options.$window.resize(function () {
          a.positionObject();
        }),
        this.options.parallax &&
          this.options.$window.on("scroll", function () {
            a.update();
          }),
        this.options.pauseVideoOnViewLoss && this.playPauseVideo(),
        this.options.preventContextMenu &&
          this.options.$video.on("contextmenu", function () {
            return !1;
          }),
        this.options.$window.trigger("resize");
    },
    requestTick: function () {
      var a = this;
      this.ticking ||
        (b.requestAnimationFrame(a.positionObject.bind(a)),
        (this.ticking = !0));
    },
    update: function () {
      (this.lastPosition = b.pageYOffset), this.requestTick();
    },
    detect3d: function () {
      var a,
        e,
        f = c.createElement("p"),
        g = {
          WebkitTransform: "-webkit-transform",
          OTransform: "-o-transform",
          MSTransform: "-ms-transform",
          MozTransform: "-moz-transform",
          transform: "transform",
        };
      c.body.insertBefore(f, c.body.lastChild);
      for (a in g)
        f.style[a] !== d &&
          ((f.style[a] =
            "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)"),
          (e = b.getComputedStyle(f).getPropertyValue(g[a])));
      return f.parentNode.removeChild(f), e !== d && "none" !== e;
    },
    detectBrowser: function () {
      var a = navigator.userAgent.toLowerCase();
      a.indexOf("chrome") > -1 || a.indexOf("safari") > -1
        ? ((this.options.browser = "webkit"),
          (this.options.browserPrexix = "-webkit-"))
        : a.indexOf("firefox") > -1
        ? ((this.options.browser = "firefox"),
          (this.options.browserPrexix = "-moz-"))
        : -1 !== a.indexOf("MSIE") || a.indexOf("Trident/") > 0
        ? ((this.options.browser = "ie"), (this.options.browserPrexix = "-ms-"))
        : a.indexOf("Opera") > -1 &&
          ((this.options.browser = "opera"),
          (this.options.browserPrexix = "-o-"));
    },
    scaleObject: function () {
      var a, b, c;
      return (
        this.options.$videoWrap.width(this.options.$outerWrap.width()),
        this.options.$videoWrap.height(this.options.$outerWrap.height()),
        (a = this.options.$window.width() / this.options.originalVideoW),
        (b = this.options.$window.height() / this.options.originalVideoH),
        (c = a > b ? a : b),
        c * this.options.originalVideoW < this.options.minimumVideoWidth &&
          (c = this.options.minimumVideoWidth / this.options.originalVideoW),
        this.options.$video.width(c * this.options.originalVideoW),
        this.options.$video.height(c * this.options.originalVideoH),
        {
          xPos:
            -parseInt(
              this.options.$video.width() - this.options.$window.width()
            ) / 2,
          yPos:
            parseInt(
              this.options.$video.height() - this.options.$window.height()
            ) / 2,
        }
      );
    },
    positionObject: function () {
      var a = this,
        c = b.pageYOffset,
        d = this.scaleObject(this.options.$video, a.options.$videoWrap),
        e = d.xPos,
        f = d.yPos;
      (f = this.options.parallax
        ? c >= 0
          ? this.calculateYPos(f, c)
          : this.calculateYPos(f, 0)
        : -f),
        a.options.has3d
          ? (this.options.$video.css(
              a.options.browserPrexix + "transform3d",
              "translate3d(-" + e + "px, " + f + "px, 0)"
            ),
            this.options.$video.css(
              "transform",
              "translate3d(" + e + "px, " + f + "px, 0)"
            ))
          : (this.options.$video.css(
              a.options.browserPrexix + "transform",
              "translate(-" + e + "px, " + f + "px)"
            ),
            this.options.$video.css(
              "transform",
              "translate(" + e + "px, " + f + "px)"
            )),
        (this.ticking = !1);
    },
    calculateYPos: function (a, b) {
      var c, d;
      return (
        (c = parseInt(this.options.$videoWrap.offset().top)),
        (d = c - b),
        (a = -(d / this.options.parallaxOptions.effect + a))
      );
    },
    disableParallax: function () {
      this.options.$window.unbind(".backgroundVideoParallax");
    },
    playPauseVideo: function () {
      var a = this;
      this.options.$window.on("scroll.backgroundVideoPlayPause", function () {
        a.options.$window.scrollTop() < a.options.$videoWrap.height()
          ? a.options.$video.get(0).play()
          : a.options.$video.get(0).pause();
      });
    },
    shimRequestAnimationFrame: function () {
      for (
        var a = 0, c = ["ms", "moz", "webkit", "o"], d = 0;
        d < c.length && !b.requestAnimationFrame;
        ++d
      )
        (b.requestAnimationFrame = b[c[d] + "RequestAnimationFrame"]),
          (b.cancelAnimationFrame =
            b[c[d] + "CancelAnimationFrame"] ||
            b[c[d] + "CancelRequestAnimationFrame"]);
      b.requestAnimationFrame ||
        (b.requestAnimationFrame = function (c) {
          var d = new Date().getTime(),
            e = Math.max(0, 16 - (d - a)),
            f = b.setTimeout(function () {
              c(d + e);
            }, e);
          return (a = d + e), f;
        }),
        b.cancelAnimationFrame ||
          (b.cancelAnimationFrame = function (a) {
            clearTimeout(a);
          });
    },
  }),
    (a.fn[f] = function (b) {
      return this.each(function () {
        a.data(this, "plugin_" + f) ||
          a.data(this, "plugin_" + f, new e(this, b));
      });
    });
})(jQuery, window, document);
/*-----------------------------------------------------------------------------------*/
/*	17. TYPER
/*-----------------------------------------------------------------------------------*/
function TyperSetup() {
  (typers = {}), (elements = document.getElementsByClassName("typer"));
  for (var b, a = 0; (b = elements[a++]); ) typers[b.id] = new Typer(b);
  elements = document.getElementsByClassName("typer-stop");
  for (var b, a = 0; (b = elements[a++]); ) {
    var c = typers[b.dataset.owner];
    b.onclick = function () {
      c.stop();
    };
  }
  elements = document.getElementsByClassName("typer-start");
  for (var b, a = 0; (b = elements[a++]); ) {
    var c = typers[b.dataset.owner];
    b.onclick = function () {
      c.start();
    };
  }
  elements2 = document.getElementsByClassName("cursor");
  for (var b, a = 0; (b = elements2[a++]); ) {
    var d = new Cursor(b);
    (d.owner.cursor = d), console.log(d.owner.cursor);
  }
}
var Typer = function (a) {
  console.log("constructor called"), (this.element = a);
  var b = a.dataset.delim || ",",
    c = a.dataset.words || "override these,sample typing";
  (this.words = c.split(b).filter(function (a) {
    return a;
  })),
    (this.delay = a.dataset.delay || 200),
    (this.deleteDelay = a.dataset.deleteDelay || 800),
    (this.progress = { word: 0, char: 0, building: !0, atWordEnd: !1 }),
    (this.typing = !0);
  var d = a.dataset.colors || "";
  (this.colors = d.split(",")),
    (this.element.style.color = this.colors[0]),
    (this.colorIndex = 0),
    this.doTyping();
};
(Typer.prototype.start = function () {
  this.typing || ((this.typing = !0), this.doTyping());
}),
  (Typer.prototype.stop = function () {
    this.typing = !1;
  }),
  (Typer.prototype.doTyping = function () {
    var a = this.element,
      b = this.progress,
      c = b.word,
      d = b.char,
      e = this.words[c][d];
    if (((b.atWordEnd = !1), this.cursor)) {
      (this.cursor.element.style.opacity = "1"),
        (this.cursor.on = !0),
        clearInterval(this.cursor.interval);
      var f = this.cursor;
      this.cursor.interval = setInterval(function () {
        f.updateBlinkState();
      }, 400);
    }
    b.building
      ? ((a.innerHTML += e),
        (b.char += 1),
        b.char == this.words[c].length &&
          ((b.building = !1), (b.atWordEnd = !0)))
      : ((a.innerHTML = a.innerHTML.slice(0, -1)),
        this.element.innerHTML ||
          ((b.building = !0),
          (b.word = (b.word + 1) % this.words.length),
          (b.char = 0),
          (this.colorIndex = (this.colorIndex + 1) % this.colors.length),
          (this.element.style.color = this.colors[this.colorIndex])));
    var g = this;
    setTimeout(
      function () {
        g.typing && g.doTyping();
      },
      b.atWordEnd ? this.deleteDelay : this.delay
    );
  });
var Cursor = function (a) {
  (this.element = a),
    (this.cursorDisplay = a.dataset.cursorDisplay || "|"),
    (this.owner = typers[a.dataset.owner] || ""),
    (a.innerHTML = this.cursorDisplay),
    (this.on = !0),
    (a.style.transition = "all 0.1s");
  var b = this;
  this.interval = setInterval(function () {
    b.updateBlinkState();
  }, 400);
};
(Cursor.prototype.updateBlinkState = function () {
  this.on
    ? ((this.element.style.opacity = "0"), (this.on = !1))
    : ((this.element.style.opacity = "1"), (this.on = !0));
}),
  TyperSetup();
/*-----------------------------------------------------------------------------------*/
/*	18. AOS
/*-----------------------------------------------------------------------------------*/
!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.AOS = t())
    : (e.AOS = t());
})(this, function () {
  return (function (e) {
    function t(o) {
      if (n[o]) return n[o].exports;
      var i = (n[o] = { exports: {}, id: o, loaded: !1 });
      return e[o].call(i.exports, i, i.exports, t), (i.loaded = !0), i.exports;
    }
    var n = {};
    return (t.m = e), (t.c = n), (t.p = "dist/"), t(0);
  })([
    function (e, t, n) {
      "use strict";
      function o(e) {
        return e && e.__esModule ? e : { default: e };
      }
      var i =
          Object.assign ||
          function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var o in n)
                Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
            }
            return e;
          },
        r = n(1),
        a = (o(r), n(6)),
        u = o(a),
        c = n(7),
        s = o(c),
        f = n(8),
        d = o(f),
        l = n(9),
        p = o(l),
        m = n(10),
        b = o(m),
        v = n(11),
        y = o(v),
        g = n(14),
        h = o(g),
        w = [],
        k = !1,
        x = {
          offset: 120,
          delay: 0,
          easing: "ease",
          duration: 400,
          disable: !1,
          once: !1,
          startEvent: "DOMContentLoaded",
          throttleDelay: 99,
          debounceDelay: 50,
          disableMutationObserver: !1,
        },
        j = function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          if ((e && (k = !0), k))
            return (w = (0, y.default)(w, x)), (0, b.default)(w, x.once), w;
        },
        O = function () {
          (w = (0, h.default)()), j();
        },
        M = function () {
          w.forEach(function (e, t) {
            e.node.removeAttribute("data-aos"),
              e.node.removeAttribute("data-aos-easing"),
              e.node.removeAttribute("data-aos-duration"),
              e.node.removeAttribute("data-aos-delay");
          });
        },
        S = function (e) {
          return (
            e === !0 ||
            ("mobile" === e && p.default.mobile()) ||
            ("phone" === e && p.default.phone()) ||
            ("tablet" === e && p.default.tablet()) ||
            ("function" == typeof e && e() === !0)
          );
        },
        _ = function (e) {
          (x = i(x, e)), (w = (0, h.default)());
          var t = document.all && !window.atob;
          return S(x.disable) || t
            ? M()
            : (x.disableMutationObserver ||
                d.default.isSupported() ||
                (console.info(
                  '\n      aos: MutationObserver is not supported on this browser,\n      code mutations observing has been disabled.\n      You may have to call "refreshHard()" by yourself.\n    '
                ),
                (x.disableMutationObserver = !0)),
              document
                .querySelector("body")
                .setAttribute("data-aos-easing", x.easing),
              document
                .querySelector("body")
                .setAttribute("data-aos-duration", x.duration),
              document
                .querySelector("body")
                .setAttribute("data-aos-delay", x.delay),
              "DOMContentLoaded" === x.startEvent &&
              ["complete", "interactive"].indexOf(document.readyState) > -1
                ? j(!0)
                : "load" === x.startEvent
                ? window.addEventListener(x.startEvent, function () {
                    j(!0);
                  })
                : document.addEventListener(x.startEvent, function () {
                    j(!0);
                  }),
              window.addEventListener(
                "resize",
                (0, s.default)(j, x.debounceDelay, !0)
              ),
              window.addEventListener(
                "orientationchange",
                (0, s.default)(j, x.debounceDelay, !0)
              ),
              window.addEventListener(
                "scroll",
                (0, u.default)(function () {
                  (0, b.default)(w, x.once);
                }, x.throttleDelay)
              ),
              x.disableMutationObserver || d.default.ready("[data-aos]", O),
              w);
        };
      e.exports = { init: _, refresh: j, refreshHard: O };
    },
    function (e, t) {},
    ,
    ,
    ,
    ,
    function (e, t) {
      (function (t) {
        "use strict";
        function n(e, t, n) {
          function o(t) {
            var n = b,
              o = v;
            return (b = v = void 0), (k = t), (g = e.apply(o, n));
          }
          function r(e) {
            return (k = e), (h = setTimeout(f, t)), M ? o(e) : g;
          }
          function a(e) {
            var n = e - w,
              o = e - k,
              i = t - n;
            return S ? j(i, y - o) : i;
          }
          function c(e) {
            var n = e - w,
              o = e - k;
            return void 0 === w || n >= t || n < 0 || (S && o >= y);
          }
          function f() {
            var e = O();
            return c(e) ? d(e) : void (h = setTimeout(f, a(e)));
          }
          function d(e) {
            return (h = void 0), _ && b ? o(e) : ((b = v = void 0), g);
          }
          function l() {
            void 0 !== h && clearTimeout(h), (k = 0), (b = w = v = h = void 0);
          }
          function p() {
            return void 0 === h ? g : d(O());
          }
          function m() {
            var e = O(),
              n = c(e);
            if (((b = arguments), (v = this), (w = e), n)) {
              if (void 0 === h) return r(w);
              if (S) return (h = setTimeout(f, t)), o(w);
            }
            return void 0 === h && (h = setTimeout(f, t)), g;
          }
          var b,
            v,
            y,
            g,
            h,
            w,
            k = 0,
            M = !1,
            S = !1,
            _ = !0;
          if ("function" != typeof e) throw new TypeError(s);
          return (
            (t = u(t) || 0),
            i(n) &&
              ((M = !!n.leading),
              (S = "maxWait" in n),
              (y = S ? x(u(n.maxWait) || 0, t) : y),
              (_ = "trailing" in n ? !!n.trailing : _)),
            (m.cancel = l),
            (m.flush = p),
            m
          );
        }
        function o(e, t, o) {
          var r = !0,
            a = !0;
          if ("function" != typeof e) throw new TypeError(s);
          return (
            i(o) &&
              ((r = "leading" in o ? !!o.leading : r),
              (a = "trailing" in o ? !!o.trailing : a)),
            n(e, t, { leading: r, maxWait: t, trailing: a })
          );
        }
        function i(e) {
          var t = "undefined" == typeof e ? "undefined" : c(e);
          return !!e && ("object" == t || "function" == t);
        }
        function r(e) {
          return (
            !!e && "object" == ("undefined" == typeof e ? "undefined" : c(e))
          );
        }
        function a(e) {
          return (
            "symbol" == ("undefined" == typeof e ? "undefined" : c(e)) ||
            (r(e) && k.call(e) == d)
          );
        }
        function u(e) {
          if ("number" == typeof e) return e;
          if (a(e)) return f;
          if (i(e)) {
            var t = "function" == typeof e.valueOf ? e.valueOf() : e;
            e = i(t) ? t + "" : t;
          }
          if ("string" != typeof e) return 0 === e ? e : +e;
          e = e.replace(l, "");
          var n = m.test(e);
          return n || b.test(e) ? v(e.slice(2), n ? 2 : 8) : p.test(e) ? f : +e;
        }
        var c =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                },
          s = "Expected a function",
          f = NaN,
          d = "[object Symbol]",
          l = /^\s+|\s+$/g,
          p = /^[-+]0x[0-9a-f]+$/i,
          m = /^0b[01]+$/i,
          b = /^0o[0-7]+$/i,
          v = parseInt,
          y =
            "object" == ("undefined" == typeof t ? "undefined" : c(t)) &&
            t &&
            t.Object === Object &&
            t,
          g =
            "object" == ("undefined" == typeof self ? "undefined" : c(self)) &&
            self &&
            self.Object === Object &&
            self,
          h = y || g || Function("return this")(),
          w = Object.prototype,
          k = w.toString,
          x = Math.max,
          j = Math.min,
          O = function () {
            return h.Date.now();
          };
        e.exports = o;
      }.call(
        t,
        (function () {
          return this;
        })()
      ));
    },
    function (e, t) {
      (function (t) {
        "use strict";
        function n(e, t, n) {
          function i(t) {
            var n = b,
              o = v;
            return (b = v = void 0), (O = t), (g = e.apply(o, n));
          }
          function r(e) {
            return (O = e), (h = setTimeout(f, t)), M ? i(e) : g;
          }
          function u(e) {
            var n = e - w,
              o = e - O,
              i = t - n;
            return S ? x(i, y - o) : i;
          }
          function s(e) {
            var n = e - w,
              o = e - O;
            return void 0 === w || n >= t || n < 0 || (S && o >= y);
          }
          function f() {
            var e = j();
            return s(e) ? d(e) : void (h = setTimeout(f, u(e)));
          }
          function d(e) {
            return (h = void 0), _ && b ? i(e) : ((b = v = void 0), g);
          }
          function l() {
            void 0 !== h && clearTimeout(h), (O = 0), (b = w = v = h = void 0);
          }
          function p() {
            return void 0 === h ? g : d(j());
          }
          function m() {
            var e = j(),
              n = s(e);
            if (((b = arguments), (v = this), (w = e), n)) {
              if (void 0 === h) return r(w);
              if (S) return (h = setTimeout(f, t)), i(w);
            }
            return void 0 === h && (h = setTimeout(f, t)), g;
          }
          var b,
            v,
            y,
            g,
            h,
            w,
            O = 0,
            M = !1,
            S = !1,
            _ = !0;
          if ("function" != typeof e) throw new TypeError(c);
          return (
            (t = a(t) || 0),
            o(n) &&
              ((M = !!n.leading),
              (S = "maxWait" in n),
              (y = S ? k(a(n.maxWait) || 0, t) : y),
              (_ = "trailing" in n ? !!n.trailing : _)),
            (m.cancel = l),
            (m.flush = p),
            m
          );
        }
        function o(e) {
          var t = "undefined" == typeof e ? "undefined" : u(e);
          return !!e && ("object" == t || "function" == t);
        }
        function i(e) {
          return (
            !!e && "object" == ("undefined" == typeof e ? "undefined" : u(e))
          );
        }
        function r(e) {
          return (
            "symbol" == ("undefined" == typeof e ? "undefined" : u(e)) ||
            (i(e) && w.call(e) == f)
          );
        }
        function a(e) {
          if ("number" == typeof e) return e;
          if (r(e)) return s;
          if (o(e)) {
            var t = "function" == typeof e.valueOf ? e.valueOf() : e;
            e = o(t) ? t + "" : t;
          }
          if ("string" != typeof e) return 0 === e ? e : +e;
          e = e.replace(d, "");
          var n = p.test(e);
          return n || m.test(e) ? b(e.slice(2), n ? 2 : 8) : l.test(e) ? s : +e;
        }
        var u =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                },
          c = "Expected a function",
          s = NaN,
          f = "[object Symbol]",
          d = /^\s+|\s+$/g,
          l = /^[-+]0x[0-9a-f]+$/i,
          p = /^0b[01]+$/i,
          m = /^0o[0-7]+$/i,
          b = parseInt,
          v =
            "object" == ("undefined" == typeof t ? "undefined" : u(t)) &&
            t &&
            t.Object === Object &&
            t,
          y =
            "object" == ("undefined" == typeof self ? "undefined" : u(self)) &&
            self &&
            self.Object === Object &&
            self,
          g = v || y || Function("return this")(),
          h = Object.prototype,
          w = h.toString,
          k = Math.max,
          x = Math.min,
          j = function () {
            return g.Date.now();
          };
        e.exports = n;
      }.call(
        t,
        (function () {
          return this;
        })()
      ));
    },
    function (e, t) {
      "use strict";
      function n(e) {
        var t = void 0,
          o = void 0,
          i = void 0;
        for (t = 0; t < e.length; t += 1) {
          if (((o = e[t]), o.dataset && o.dataset.aos)) return !0;
          if ((i = o.children && n(o.children))) return !0;
        }
        return !1;
      }
      function o() {
        return (
          window.MutationObserver ||
          window.WebKitMutationObserver ||
          window.MozMutationObserver
        );
      }
      function i() {
        return !!o();
      }
      function r(e, t) {
        var n = window.document,
          i = o(),
          r = new i(a);
        (u = t),
          r.observe(n.documentElement, {
            childList: !0,
            subtree: !0,
            removedNodes: !0,
          });
      }
      function a(e) {
        e &&
          e.forEach(function (e) {
            var t = Array.prototype.slice.call(e.addedNodes),
              o = Array.prototype.slice.call(e.removedNodes),
              i = t.concat(o);
            if (n(i)) return u();
          });
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var u = function () {};
      t.default = { isSupported: i, ready: r };
    },
    function (e, t) {
      "use strict";
      function n(e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      }
      function o() {
        return navigator.userAgent || navigator.vendor || window.opera || "";
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var i = (function () {
          function e(e, t) {
            for (var n = 0; n < t.length; n++) {
              var o = t[n];
              (o.enumerable = o.enumerable || !1),
                (o.configurable = !0),
                "value" in o && (o.writable = !0),
                Object.defineProperty(e, o.key, o);
            }
          }
          return function (t, n, o) {
            return n && e(t.prototype, n), o && e(t, o), t;
          };
        })(),
        r =
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
        a =
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        u =
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,
        c =
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        s = (function () {
          function e() {
            n(this, e);
          }
          return (
            i(e, [
              {
                key: "phone",
                value: function () {
                  var e = o();
                  return !(!r.test(e) && !a.test(e.substr(0, 4)));
                },
              },
              {
                key: "mobile",
                value: function () {
                  var e = o();
                  return !(!u.test(e) && !c.test(e.substr(0, 4)));
                },
              },
              {
                key: "tablet",
                value: function () {
                  return this.mobile() && !this.phone();
                },
              },
            ]),
            e
          );
        })();
      t.default = new s();
    },
    function (e, t) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var n = function (e, t, n) {
          var o = e.node.getAttribute("data-aos-once");
          t > e.position
            ? e.node.classList.add("aos-animate")
            : "undefined" != typeof o &&
              ("false" === o || (!n && "true" !== o)) &&
              e.node.classList.remove("aos-animate");
        },
        o = function (e, t) {
          var o = window.pageYOffset,
            i = window.innerHeight;
          e.forEach(function (e, r) {
            n(e, i + o, t);
          });
        };
      t.default = o;
    },
    function (e, t, n) {
      "use strict";
      function o(e) {
        return e && e.__esModule ? e : { default: e };
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var i = n(12),
        r = o(i),
        a = function (e, t) {
          return (
            e.forEach(function (e, n) {
              e.node.classList.add("aos-init"),
                (e.position = (0, r.default)(e.node, t.offset));
            }),
            e
          );
        };
      t.default = a;
    },
    function (e, t, n) {
      "use strict";
      function o(e) {
        return e && e.__esModule ? e : { default: e };
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var i = n(13),
        r = o(i),
        a = function (e, t) {
          var n = 0,
            o = 0,
            i = window.innerHeight,
            a = {
              offset: e.getAttribute("data-aos-offset"),
              anchor: e.getAttribute("data-aos-anchor"),
              anchorPlacement: e.getAttribute("data-aos-anchor-placement"),
            };
          switch (
            (a.offset && !isNaN(a.offset) && (o = parseInt(a.offset)),
            a.anchor &&
              document.querySelectorAll(a.anchor) &&
              (e = document.querySelectorAll(a.anchor)[0]),
            (n = (0, r.default)(e).top),
            a.anchorPlacement)
          ) {
            case "top-bottom":
              break;
            case "center-bottom":
              n += e.offsetHeight / 2;
              break;
            case "bottom-bottom":
              n += e.offsetHeight;
              break;
            case "top-center":
              n += i / 2;
              break;
            case "bottom-center":
              n += i / 2 + e.offsetHeight;
              break;
            case "center-center":
              n += i / 2 + e.offsetHeight / 2;
              break;
            case "top-top":
              n += i;
              break;
            case "bottom-top":
              n += e.offsetHeight + i;
              break;
            case "center-top":
              n += e.offsetHeight / 2 + i;
          }
          return a.anchorPlacement || a.offset || isNaN(t) || (o = t), n + o;
        };
      t.default = a;
    },
    function (e, t) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var n = function (e) {
        for (
          var t = 0, n = 0;
          e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop);

        )
          (t += e.offsetLeft - ("BODY" != e.tagName ? e.scrollLeft : 0)),
            (n += e.offsetTop - ("BODY" != e.tagName ? e.scrollTop : 0)),
            (e = e.offsetParent);
        return { top: n, left: t };
      };
      t.default = n;
    },
    function (e, t) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var n = function (e) {
        return (
          (e = e || document.querySelectorAll("[data-aos]")),
          Array.prototype.map.call(e, function (e) {
            return { node: e };
          })
        );
      };
      t.default = n;
    },
  ]);
});
/*-----------------------------------------------------------------------------------*/
/*	19. EASING
/*-----------------------------------------------------------------------------------*/
!(function (n) {
  "function" == typeof define && define.amd
    ? define(["jquery"], function (e) {
        return n(e);
      })
    : "object" == typeof module && "object" == typeof module.exports
    ? (exports = n(require("jquery")))
    : n(jQuery);
})(function (n) {
  function e(n) {
    var e = 7.5625,
      t = 2.75;
    return n < 1 / t
      ? e * n * n
      : n < 2 / t
      ? e * (n -= 1.5 / t) * n + 0.75
      : n < 2.5 / t
      ? e * (n -= 2.25 / t) * n + 0.9375
      : e * (n -= 2.625 / t) * n + 0.984375;
  }
  n.easing.jswing = n.easing.swing;
  var t = Math.pow,
    u = Math.sqrt,
    r = Math.sin,
    i = Math.cos,
    a = Math.PI,
    c = 1.70158,
    o = 1.525 * c,
    s = (2 * a) / 3,
    f = (2 * a) / 4.5;
  n.extend(n.easing, {
    def: "easeOutQuad",
    swing: function (e) {
      return n.easing[n.easing.def](e);
    },
    easeInQuad: function (n) {
      return n * n;
    },
    easeOutQuad: function (n) {
      return 1 - (1 - n) * (1 - n);
    },
    easeInOutQuad: function (n) {
      return n < 0.5 ? 2 * n * n : 1 - t(-2 * n + 2, 2) / 2;
    },
    easeInCubic: function (n) {
      return n * n * n;
    },
    easeOutCubic: function (n) {
      return 1 - t(1 - n, 3);
    },
    easeInOutCubic: function (n) {
      return n < 0.5 ? 4 * n * n * n : 1 - t(-2 * n + 2, 3) / 2;
    },
    easeInQuart: function (n) {
      return n * n * n * n;
    },
    easeOutQuart: function (n) {
      return 1 - t(1 - n, 4);
    },
    easeInOutQuart: function (n) {
      return n < 0.5 ? 8 * n * n * n * n : 1 - t(-2 * n + 2, 4) / 2;
    },
    easeInQuint: function (n) {
      return n * n * n * n * n;
    },
    easeOutQuint: function (n) {
      return 1 - t(1 - n, 5);
    },
    easeInOutQuint: function (n) {
      return n < 0.5 ? 16 * n * n * n * n * n : 1 - t(-2 * n + 2, 5) / 2;
    },
    easeInSine: function (n) {
      return 1 - i((n * a) / 2);
    },
    easeOutSine: function (n) {
      return r((n * a) / 2);
    },
    easeInOutSine: function (n) {
      return -(i(a * n) - 1) / 2;
    },
    easeInExpo: function (n) {
      return 0 === n ? 0 : t(2, 10 * n - 10);
    },
    easeOutExpo: function (n) {
      return 1 === n ? 1 : 1 - t(2, -10 * n);
    },
    easeInOutExpo: function (n) {
      return 0 === n
        ? 0
        : 1 === n
        ? 1
        : n < 0.5
        ? t(2, 20 * n - 10) / 2
        : (2 - t(2, -20 * n + 10)) / 2;
    },
    easeInCirc: function (n) {
      return 1 - u(1 - t(n, 2));
    },
    easeOutCirc: function (n) {
      return u(1 - t(n - 1, 2));
    },
    easeInOutCirc: function (n) {
      return n < 0.5
        ? (1 - u(1 - t(2 * n, 2))) / 2
        : (u(1 - t(-2 * n + 2, 2)) + 1) / 2;
    },
    easeInElastic: function (n) {
      return 0 === n
        ? 0
        : 1 === n
        ? 1
        : -t(2, 10 * n - 10) * r((10 * n - 10.75) * s);
    },
    easeOutElastic: function (n) {
      return 0 === n
        ? 0
        : 1 === n
        ? 1
        : t(2, -10 * n) * r((10 * n - 0.75) * s) + 1;
    },
    easeInOutElastic: function (n) {
      return 0 === n
        ? 0
        : 1 === n
        ? 1
        : n < 0.5
        ? -(t(2, 20 * n - 10) * r((20 * n - 11.125) * f)) / 2
        : (t(2, -20 * n + 10) * r((20 * n - 11.125) * f)) / 2 + 1;
    },
    easeInBack: function (n) {
      return (c + 1) * n * n * n - c * n * n;
    },
    easeOutBack: function (n) {
      return 1 + (c + 1) * t(n - 1, 3) + c * t(n - 1, 2);
    },
    easeInOutBack: function (n) {
      return n < 0.5
        ? (t(2 * n, 2) * (7.189819 * n - o)) / 2
        : (t(2 * n - 2, 2) * ((o + 1) * (2 * n - 2) + o) + 2) / 2;
    },
    easeInBounce: function (n) {
      return 1 - e(1 - n);
    },
    easeOutBounce: e,
    easeInOutBounce: function (n) {
      return n < 0.5 ? (1 - e(1 - 2 * n)) / 2 : (1 + e(2 * n - 1)) / 2;
    },
  });
});
