function Veriphone(t) { 
    
    this.regex = /^([+]{1}[0-9]{1})?([\s0-9-\(\)]{5,18})$/
    this.input = $(t),
    this.input.attr("spellcheck","false"),
    this.key = "5424B79B28044EFDB08531E0258DF645",
    this.example = this.input.attr("data-example"),
    this.delay = Number(this.input.attr("data-delay")) || 200,
    this.retries = Number(this.input.attr("data-retries")) || 3,
    this.retry = 0,
    this.cache = {};
    
    this.verify = function() {
        this.cache.hasOwnProperty(this.value) ? this.handler(this.cache[this.value]) : 
        (clearTimeout(this.timeout), this.timeout = setTimeout(this._verify.bind(this),this.delay))
    };
    
    this._verify = function() {
        let t = { phone: this.value };
        this.key && (t.key = this.key),
        $.ajax({
            url: "https://api.veriphone.io/v1/verify",
            data: t,
            success: this.handler.bind(this),
            error: this.error.bind(this),
            dataType: "json",
            type:"POST",
            crossDomain:!0
        });
    }

    this.handler = function(t) {
        if("success" == t.status) {
            if(t.phone != this.value) return;
            this.cache[t.phone] = t,
            this.retry = 0;
            let i = jQuery.Event("verify");
            for (let e in t) {
                i[e]=t[e];
            }
            this.input.trigger(i); 
            let s={};
            for(let e in t) {
                s["data-" + e] = t[e];
            }
            this.input.attr(s),
            t.phone_valid ? (this.input.addClass("valid").removeClass("not-valid"), this.input.val(t.international_number))
                :this.input.addClass("not-valid").removeClass("valid")
        } else this.retry < this.retries && (this.retry++, this._verify())
    }
    
    this.error = function(t,i,e) {
        this.input.trigger({
            type:"error",
            jqXHR:t,
            textStatus:i,
            errorThrown:e
        })
    },
    
    this.input.attr("data-value",this.input.val());

    this.change = function() {
        let t=this.input.val();
        this.input.attr("data-value") != t && (this.input.attr("data-value",t),
        this.value = t,
        this.regex.test(t) ? this.verify() : this.handler({
            status:"success",
            phone:t,
            phone_valid:!1,
            phone_type:"",
            phone_region:"",
            country:"",
            country_code:"",
            country_prefix:"",
            international_number:"",
            local_number:"",
            carrier:""
        }))
    }

    this.input.on("change keyup input paste", this.change.bind(this));

    this.setExample = function(t) {
        "success"==t.status&&
        ""==this.input.val()&&
        this.input.attr("placeholder",t.international_number)
    }
    
    "false" != this.example && $.ajax({
        url:"https://api.veriphone.io/v1/example",
        success:this.setExample.bind(this),
        error:this.error.bind(this),
        dataType:"json",
        type:"POST",
        crossDomain:!0
    })
}

$(function() {
    
    $(".veriphone").each(function(t){
        window["veriphone-"+t] = new Veriphone(this)
    })

});
