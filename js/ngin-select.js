(function($){

  if ($.fn.NginSelect) return

  var NS = {

    matchInput: function(e, delta) {
      if (!delta) e.data.index = 0
      var s = e.currentTarget.value,
          matches = NS.matchesFor(e, s),
          i = e.data.index + (delta||0)

      if (i < 0) i = 0
      else if (i >= matches.length) i = matches.length - 1
      e.data.index = i

      var m = matches[i]
      NS.setPreview.call($(e.currentTarget), m ? m.v : null, m ? m.s : s)
    },

    /*  returns an Object {
     *    v: display value,
     *    s: search string,
     *    i: index of searchstring in display value
     *  }
     */
    matchesFor: function(e, s){
      var m,
          matches = [],
          re = new RegExp('.*('+s+').*','i'),
          list = NS.getList(e)
      // return full list
      if (s === e.data.$inputs.filter('.NS-preview').val()) {
        matches = $.map(list, function(item, i){
          if (item.name === s) e.data.index = i
          return { v: item.name, s: item.name, i: 0 }
        })
      }
      // return partial list
      else {
        for (var i in list) {
          m = list[i].name.match(re)
          if (m) {
            matches.push({ v: m[0], s: m[1], i: NS.adjustedIndex(m[0], m[0].indexOf(m[1])) })
          }
        }
        matches.sort(function(a,b){
          return a.i - b.i
        })
        if (s === '' || s === undefined || s === null) matches.unshift('')
      }
      return matches
    },

    getList: function(e) {
      return $.map(e.data.$select.find('option'), function(el, i){
        return { name: el.text, value: el.value }
      })
    },

    // adjusted index is based on charaters from the start of a word, then words at the beginning of the src string
    adjustedIndex: function(src, i) {
      var si = src.substr(0,i).lastIndexOf(' ')
      if (si === -1) si = 0
      return (i === 0) ? i : (i-si+1)+(1-(1/i))
    },

    setVal: function(e, t) {
      var v = null
      e.data.$select.find('option').each(function(){
        if (this.text == t) v = this.value
      })
      e.data.$select.val(v).change()
    },

    setPreview: function(v, s){
      var input = this,
          input2 = input.siblings('input'),
          copy = input.siblings('.NS-copy'),
          html = (s === '') ? '' : v ? v.replace(s,'<span>'+s+'</span>') : '<span>'+s+'</span>'//' (not found)'
      input2.val(v ? v:s)
      copy.html(html)
      var el = copy.find('span'),
          left = (el.length==1) ? el.position().left : 0
      input.css('text-indent', left+parseInt(input2.css('textIndent'))).val(s)
    },

    setPreviewFromSelect: function(e) {
      e.data.$el.children('input').val(e.data.$select.find('option:selected').text())
    },

    syncInputs: function(e) {
      var pre = e.data.$el.children('.NS-preview'),
          s = pre.val()
      NS.setVal(e, s)
      NS.setPreview.call(pre.siblings('input'), s, s)
    },

    checkKeys: function(e) {
      if (!~[0,9,16,17,18,91,93,37,39].indexOf(e.which)) { // ad 192 & 0 for ~ tabbing
        console.log(e.which)
        var up = (e.type === 'keyup')
        switch (e.which) {
          case 38: /* up */ if (!up) { NS.matchInput(e, -1) } return false
          case 40: /* down */ if (!up) { NS.matchInput(e, +1) } return false
          default: if (up) NS.matchInput(e)
        }
      }
    },

    delayFocus: function(e) { e.data.delayed = true },

    setFocus: function(e) {
      e.data.delayed = false
      NS.setAsInput(e)
    },

    setAsInput: function(e){
      if (e.data.delayed) return
      $(e.currentTarget)
        .removeClass('NS-preview').removeAttr('tabindex')
        .siblings('input').addClass('NS-preview').attr('tabindex',-1)
      e.preventDefault()
    }

  }

  // add escape method to sanitize input for regex
  RegExp.escape = RegExp.escape || function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  $.fn.NginSelect = function(method) {
    var ns = this.closest('.NginSelect').data('NginSelect')
    // call methods
    if (ns && method && NS[method]) {
      NS[method]({data: ns})
    }
    else if (!ns) {
      // initialize object settings
      var ns = {
        index: 0,
        delayed: false,
        $select: this.prop('tabindex',-1),
        $el: this.wrap('<span class="NginSelect"/>')
         .after('<button class="NS-handle" tabindex="-1">&darr;</button><input type="text" value="'+(this.value||'')+'" /><input type="text" class="NS-preview" tabindex="-1"/><span class="NS-copy"/>')
         .parent(),
        $inputs: this.parent().find('input'),
        $handle: this.parent().find('.NS-handle')
      }
      ns.$el.data('NginSelect', ns)
      // update dimentions and fonts
      var hidden = ns.$el.parents().filter(function(){ return $(this).css('display') == 'none' }).show(),
          h = ns.$el.height(),
          w = ns.$el.width(),
          i = ns.$inputs,
          hd = ns.$handle,
          s = ns.$select
      ns.$el.children().not(s).not(hd).css({
        'fontSize': s.css('fontSize'),
        'fontFamily': s.css('fontFamily'),
        'fontWeight': s.css('fontWeight')
      })
      i.height(h).width(w)
      hd.height(h).width(h)
      // reset again now that we know the correct offset
      var h2 = 2*h-i.outerHeight(),
          w2 = 2*w-i.outerWidth()-h
      i.height(h2).width(w2)
      hd.width(2*h-hd.outerWidth()).height(2*h-hd.outerHeight())
      hidden.hide()
      // copy rel attribute & initial value
      var rel = ns.$select.attr('rel')
      if (rel) ns.$inputs.attr('rel', rel)
      // set events
      ns.$el
        .on('keyup keydown', 'input', ns, NS.checkKeys)
        .on('focus', 'input', ns, NS.setAsInput)
        .on('mousedown', 'input', ns, NS.delayFocus)
        .on('mouseup', 'input', ns, NS.setFocus)
        .on('blur', 'input', ns, NS.syncInputs)
        .on('change', 'select', ns, NS.setPreviewFromSelect)
      ns.$handle.on('click',function(e){ e.preventDefault() })
      // convert placeholder option to input placeholder
      var opt = ns.$select.find('option').first()
      if (opt.val() == '') {
        ns.$inputs.prop('placeholder', opt.text())
        opt.text('')
      }
      // match size
    }
    return this
  }

})(jQuery)