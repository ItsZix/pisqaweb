import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const SUPABASE_URL = 'https://yxunapqxcbqvdlbtnflu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_soPWriyC204ng0c5StzzOg_jHj8uL6O';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(function(){
  "use strict";

  var STAFF_PASSWORD = "pisqa2026"; // cámbiala aquí si lo necesitas
  var STORAGE_KEY = "pisqa_pedidos";

  var CAT_ICONS = {
    "Snacks":"ic-sandwich", "Postres":"ic-dessert", "Jugos":"ic-juice",
    "Café":"ic-coffee", "Dulces y snacks":"ic-cookie", "Bebidas":"ic-bottle"
  };

  var MENU = [
    {cat:"Snacks", items:[
      {id:"001", nombre:"Sandwich de Chicharron", desc:"Crispy pork belly sandwich.", precio:14.00},
      {id:"002", nombre:"Sándwich de Lomo", desc:"Loin steak sandwich.", precio:13.00},
      {id:"003", nombre:"Sándwich de Pavo", desc:"Turkey sandwich.", precio:15.00},
      {id:"004", nombre:"Croissant Mixto", desc:"Chicken, peach, and mayonnaise croissant. Crosaint de pollo, durazno y mayonesa.", precio:12.50},
      {id:"005", nombre:"Croissant Clásico", desc:"Classic ham and cheese croissant. Croissant clasico de jamon y queso.", precio:9.00},
      {id:"006", nombre:"Empanadas", desc:"", precio:6.00}
    ]},
    {cat:"Postres", items:[
      {id:"007", nombre:"Cuchareable", desc:"Postre del día. Dessert of the day.", precio:10.00},
      {id:"008", nombre:"Crema volteada", desc:"Caramel custard.", precio:6.00},
      {id:"009", nombre:"Torta de vainilla", desc:"Vanilla cake.", precio:5.00},
      {id:"010", nombre:"Torta de Chocolate", desc:"Chocolat cake.", precio:6.00}
    ]},
    {cat:"Jugos", items:[
      {id:"011", nombre:"Especial Pisqa", desc:"(Jugo especial - Special Juice) Mixtura de papaya con leche y algarrobina. A blend of papaya with milk, carob syrup, and", precio:12.00},
      {id:"012", nombre:"Fusión Pisqa", desc:"(Jugo surtido - Mixed juice) Mixtura de papaya y piña. Papaya, pineapple and aplle mixture.", precio:9.00},
      {id:"013", nombre:"Piñasqa", desc:"(Jugo de Piña - Pineapple juice) Mixtura de piña fresca y dulce. A blend of fresh, sweet pineapple.", precio:9.00},
      {id:"014", nombre:"Pisqa pink vibes", desc:"Mixtura de fresa con leche. Strawberry milk mixture.", precio:10.00},
      {id:"015", nombre:"Frutos rojos", desc:"Mixtura de arandanos, fresa y leche. Blueberries, strawberry and milk mixture.", precio:14.00},
      {id:"016", nombre:"Amanecer", desc:"Mixtura de jugo de naranja. Orange juice mixture", precio:9.00},
      {id:"017", nombre:"Chicha morada (Vaso)", desc:"Bebida de maiz morado con canela y limón. Purple corn drink with cinnamon and lime.", precio:4.00}
    ]},
    {cat:"Café", items:[
      {id:"018", nombre:"Americano", desc:"Un shot de espresso con una taza de agua. A shot of espresso with a cup of water.", precio:6.00},
      {id:"019", nombre:"Capucchino", desc:"Dos shot de espresso con poca leche y espuma. Two shots of espresso with a little milk and foam.", precio:9.00},
      {id:"020", nombre:"Late", desc:"Un shot de espresso con mucha leche vaporizada y poca espuma. A shot of espresso with lots of steamed milk and little foam.", precio:9.00},
      {id:"021", nombre:"Mocacchino", desc:"Espresso con leche vaporizada y un toque de jarabe de chocolate. Espresso with steamed milk and a touch of chocolate syrup..", precio:10.00}
    ]},
    {cat:"Dulces y snacks", items:[
      {id:"022", nombre:"Chifles", desc:"", precio:6.00},
      {id:"023", nombre:"Gllt. Munición. San Jorge", desc:"", precio:1.80},
      {id:"024", nombre:"Inkachips", desc:"", precio:3.50},
      {id:"025", nombre:"Snickers 5gr", desc:"", precio:3.00},
      {id:"026", nombre:"Club social queso", desc:"", precio:1.50},
      {id:"027", nombre:"Ritz queso", desc:"", precio:1.50},
      {id:"028", nombre:"Gllt. Costa Wafer", desc:"", precio:4.50},
      {id:"029", nombre:"Gllt. Chocodona", desc:"", precio:1.60},
      {id:"030", nombre:"Gllt. Gretel", desc:"", precio:1.30},
      {id:"031", nombre:"Gllt Minichips", desc:"", precio:3.50},
      {id:"032", nombre:"Gllt Coconut", desc:"", precio:1.80},
      {id:"033", nombre:"Choc. Kitkat", desc:"", precio:6.00},
      {id:"034", nombre:"Obsesión", desc:"", precio:1.20},
      {id:"035", nombre:"Choco. Sublime", desc:"", precio:3.50},
      {id:"036", nombre:"Choc. Sublim Crispy", desc:"", precio:1.70}
    ]},
    {cat:"Bebidas", items:[
      {id:"037", nombre:"Agua San Luis", desc:"", precio:3.00},
      {id:"038", nombre:"Gatorade Mandarina", desc:"", precio:3.50},
      {id:"039", nombre:"Agua San Carlos", desc:"", precio:1.50},
      {id:"040", nombre:"Agua con gas San Luis", desc:"", precio:3.00},
      {id:"041", nombre:"Sporade Rojo", desc:"", precio:3.50},
      {id:"042", nombre:"Inka Kola (Vidrio)", desc:"", precio:3.50},
      {id:"043", nombre:"Fanta 500ml", desc:"", precio:3.50},
      {id:"044", nombre:"Cocacola 600ml", desc:"", precio:4.00},
      {id:"044b", nombre:"Inka Kola 600 ml", desc:"", precio:4.00},
      {id:"045", nombre:"Sporade Blue", desc:"", precio:3.50}
    ]}
  ];

  document.getElementById("year-now").textContent = new Date().getFullYear();

  function fmt(n){ return "S/ " + n.toFixed(2); }
  function iconSvg(id, extra){
    return '<svg '+(extra||'')+' viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><use href="#'+id+'"/></svg>';
  }

  // ---------- PUBLIC MENU ----------
  var activeCat = MENU[0].cat;
  var tabsEl = document.getElementById("menu-tabs");
  var gridEl = document.getElementById("menu-grid");

  function renderPublicMenu(){
    tabsEl.innerHTML = "";
    MENU.forEach(function(g){
      var b = document.createElement("button");
      b.className = "tab-btn" + (g.cat === activeCat ? " active" : "");
      b.innerHTML = iconSvg(CAT_ICONS[g.cat]) + g.cat;
      b.onclick = function(){ activeCat = g.cat; renderPublicMenu(); };
      tabsEl.appendChild(b);
    });
    var group = MENU.find(function(g){ return g.cat === activeCat; });
    gridEl.innerHTML = "";
    group.items.forEach(function(it){
      var div = document.createElement("div");
      div.className = "menu-item";
      div.innerHTML =
        '<div class="mi-left"><div class="mi-name">'+it.nombre+'</div>' +
        (it.desc ? '<div class="mi-desc">'+it.desc+'</div>' : '') + '</div>' +
        '<div class="mi-price">'+fmt(it.precio)+'</div>';
      gridEl.appendChild(div);
    });
  }
  renderPublicMenu();

  // ---------- LOGIN / VIEW SWITCH ----------
  var publicView = document.getElementById("public-view");
  var loginView = document.getElementById("login-view");
  var adminView = document.getElementById("admin-view");
  var pwInput = document.getElementById("password-input");
  var loginError = document.getElementById("login-error");

  function showLogin(){
    loginView.classList.remove("hidden");
    pwInput.value = "";
    loginError.textContent = "";
    setTimeout(function(){ pwInput.focus(); }, 50);
  }
  function hideLogin(){ loginView.classList.add("hidden"); }

  document.getElementById("open-login-nav").onclick = function(e){ e.preventDefault(); showLogin(); };
  document.getElementById("open-login-footer").onclick = function(e){ e.preventDefault(); showLogin(); };
  document.getElementById("back-to-site").onclick = function(e){ e.preventDefault(); hideLogin(); };

  function attemptLogin(){
    if(pwInput.value === STAFF_PASSWORD){
      hideLogin();
      publicView.classList.add("hidden");
      adminView.style.display = "block";
      refreshOrdersFromStorage();
    } else {
      loginError.textContent = "Contraseña incorrecta.";
    }
  }
  document.getElementById("login-submit").onclick = attemptLogin;
  pwInput.addEventListener("keydown", function(e){ if(e.key === "Enter") attemptLogin(); });

  document.getElementById("logout-btn").onclick = function(){
    adminView.style.display = "none";
    publicView.classList.remove("hidden");
    window.scrollTo(0,0);
  };

  // ---------- ADMIN TABS ----------
  var adminTabBtns = document.querySelectorAll(".admin-tab-btn");
  var tabPedido = document.getElementById("tab-pedido");
  var tabCaja = document.getElementById("tab-caja");
  adminTabBtns.forEach(function(btn){
    btn.onclick = function(){
      adminTabBtns.forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      var which = btn.getAttribute("data-admin-tab");
      if(which === "pedido"){
        tabPedido.classList.remove("hidden");
        tabCaja.classList.add("hidden");
      } else {
        tabPedido.classList.add("hidden");
        tabCaja.classList.remove("hidden");
        refreshOrdersFromStorage();
      }
    };
  });

  // ---------- NUEVO PEDIDO ----------
  var mesa = 1;
  var mesaNumEl = document.getElementById("mesa-num");
  var cartMesaLabel = document.getElementById("cart-mesa-label");
  document.getElementById("mesa-minus").onclick = function(){ if(mesa > 1) mesa--; updateMesaUI(); };
  document.getElementById("mesa-plus").onclick = function(){ mesa++; updateMesaUI(); };
  function updateMesaUI(){ mesaNumEl.textContent = mesa; cartMesaLabel.textContent = "Mesa " + mesa; }

  var activeAdminCat = MENU[0].cat;
  var catScroller = document.getElementById("cat-scroller");
  var itemGrid = document.getElementById("item-grid");

  function renderAdminMenu(){
    catScroller.innerHTML = "";
    MENU.forEach(function(g){
      var b = document.createElement("button");
      b.className = "cat-chip" + (g.cat === activeAdminCat ? " active" : "");
      b.textContent = g.cat;
      b.onclick = function(){ activeAdminCat = g.cat; renderAdminMenu(); };
      catScroller.appendChild(b);
    });
    var group = MENU.find(function(g){ return g.cat === activeAdminCat; });
    itemGrid.innerHTML = "";
    group.items.forEach(function(it){
      var div = document.createElement("div");
      div.className = "item-card";
      div.innerHTML =
        '<div><div class="ic-name">'+it.nombre+'</div><div class="ic-price">'+fmt(it.precio)+'</div></div>' +
        '<button class="item-add" aria-label="Agregar">+</button>';
      div.querySelector(".item-add").onclick = function(){ addToCart(it); };
      itemGrid.appendChild(div);
    });
  }
  renderAdminMenu();

  var cart = {};
  var cartLinesEl = document.getElementById("cart-lines");
  var cartTotalEl = document.getElementById("cart-total-val");
  var sendBtn = document.getElementById("send-order-btn");

  function addToCart(it){
    if(!cart[it.id]) cart[it.id] = {item:it, cantidad:0};
    cart[it.id].cantidad++;
    renderCart();
  }
  function changeQty(id, delta){
    if(!cart[id]) return;
    cart[id].cantidad += delta;
    if(cart[id].cantidad <= 0) delete cart[id];
    renderCart();
  }
  function renderCart(){
    var ids = Object.keys(cart);
    if(ids.length === 0){
      cartLinesEl.innerHTML = '<div class="cart-empty">Aún no agregas productos.</div>';
      sendBtn.disabled = true;
      cartTotalEl.textContent = fmt(0);
      return;
    }
    var total = 0;
    cartLinesEl.innerHTML = "";
    ids.forEach(function(id){
      var line = cart[id];
      var sub = line.item.precio * line.cantidad;
      total += sub;
      var div = document.createElement("div");
      div.className = "cart-line";
      div.innerHTML =
        '<div class="cl-name">'+line.item.nombre+'</div>' +
        '<div class="cl-qty"><button data-d="-1">–</button><span>'+line.cantidad+'</span><button data-d="1">+</button></div>' +
        '<div class="cl-sub">'+fmt(sub)+'</div>';
      var btns = div.querySelectorAll("button");
      btns[0].onclick = function(){ changeQty(id, -1); };
      btns[1].onclick = function(){ changeQty(id, 1); };
      cartLinesEl.appendChild(div);
    });
    cartTotalEl.textContent = fmt(total);
    sendBtn.disabled = false;
  }
  renderCart();

  document.getElementById("clear-cart-btn").onclick = function(){
    cart = {};
    renderCart();
    document.getElementById("order-confirm").textContent = "";
  };

  async function loadOrders(){
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if(error) return [];
    return data.map(function(o){
      return {
        id: o.id,
        mesa: o.mesa,
        items: o.items,
        total: parseFloat(o.total),
        estado: o.status,
        metodoPago: o.payment_method,
        creado: new Date(o.created_at).getTime(),
        pagadoEn: o.payment_method ? new Date().getTime() : null
      };
    });
  }

  sendBtn.onclick = async function(){
    var ids = Object.keys(cart);
    if(ids.length === 0) return;
    sendBtn.disabled = true;
    var items = ids.map(function(id){
      var l = cart[id];
      return {id:id, nombre:l.item.nombre, precio:l.item.precio, cantidad:l.cantidad};
    });
    var total = items.reduce(function(s,i){ return s + i.precio*i.cantidad; }, 0);
    
    var order = {
      mesa: mesa.toString(), items: items, total: total,
      status: "pendiente", payment_method: null
    };
    
    const { error } = await supabase.from('orders').insert([order]);
    if(!error) {
      document.getElementById("order-confirm").textContent = "Pedido enviado a caja · Mesa " + mesa;
      cart = {};
      renderCart();
      sendBtn.disabled = true;
      setTimeout(function(){ document.getElementById("order-confirm").textContent = ""; }, 4000);
    } else {
      document.getElementById("order-confirm").textContent = "No se pudo enviar el pedido. Intenta de nuevo.";
      sendBtn.disabled = false;
    }
  };

  // ---------- CAJA ----------
  var pendingListEl = document.getElementById("pending-list");
  var paidListEl = document.getElementById("paid-list");
  var sumPendientes = document.getElementById("sum-pendientes");
  var sumCobrado = document.getElementById("sum-cobrado");
  var sumPagados = document.getElementById("sum-pagados");

  function isToday(ts){
    var d = new Date(ts), now = new Date();
    return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth() && d.getDate()===now.getDate();
  }
  function timeLabel(ts){ return new Date(ts).toLocaleTimeString('es-PE', {hour:'2-digit', minute:'2-digit'}); }

  function renderOrders(orders){
    var pending = orders.filter(function(o){ return o.estado === "pendiente"; }).sort(function(a,b){ return a.creado - b.creado; });
    var paidToday = orders.filter(function(o){ return o.estado === "pagado" && isToday(o.pagadoEn); }).sort(function(a,b){ return b.pagadoEn - a.pagadoEn; });

    sumPendientes.textContent = pending.length;
    sumPagados.textContent = paidToday.length;
    sumCobrado.textContent = fmt(paidToday.reduce(function(s,o){ return s + o.total; }, 0));

    pendingListEl.innerHTML = "";
    if(pending.length === 0){
      pendingListEl.innerHTML = '<div class="empty-state">No hay pedidos pendientes de pago.</div>';
    } else {
      pending.forEach(function(o){ pendingListEl.appendChild(buildOrderCard(o, false)); });
    }

    paidListEl.innerHTML = "";
    if(paidToday.length === 0){
      paidListEl.innerHTML = '<div class="empty-state">Todavía no hay cobros registrados hoy.</div>';
    } else {
      paidToday.forEach(function(o){ paidListEl.appendChild(buildOrderCard(o, true)); });
    }
  }

  function buildOrderCard(o, paid){
    var div = document.createElement("div");
    div.className = "order-card" + (paid ? " paid" : "");
    var itemsHtml = o.items.map(function(i){ return i.cantidad+'× '+i.nombre; }).join(" · ");
    div.innerHTML =
      '<div class="oc-top"><div class="oc-mesa">Mesa '+o.mesa+'</div><div class="oc-time">'+timeLabel(o.creado)+'</div></div>' +
      '<div class="oc-items">'+itemsHtml+'</div>' +
      '<div class="oc-bottom"><div class="oc-total">'+fmt(o.total)+'</div><div class="oc-actions"></div></div>';
    var actions = div.querySelector(".oc-actions");
    if(paid){
      var tag = document.createElement("span");
      tag.className = "paid-tag";
      tag.textContent = "Pagado · " + o.metodoPago + " · " + timeLabel(o.pagadoEn);
      actions.appendChild(tag);
    } else {
      var yapeBtn = document.createElement("button");
      yapeBtn.className = "pay-btn yape"; yapeBtn.textContent = "Yape";
      yapeBtn.onclick = function(){ markPaid(o.id, "Yape"); };
      var efvBtn = document.createElement("button");
      efvBtn.className = "pay-btn efectivo"; efvBtn.textContent = "Efectivo";
      efvBtn.onclick = function(){ markPaid(o.id, "Efectivo"); };
      var cancelBtn = document.createElement("button");
      cancelBtn.className = "cancel-btn"; cancelBtn.textContent = "Cancelar";
      cancelBtn.onclick = function(){ cancelOrder(o.id); };
      actions.appendChild(yapeBtn);
      actions.appendChild(efvBtn);
      actions.appendChild(cancelBtn);
    }
    return div;
  }

  async function markPaid(id, metodo){
    const { error } = await supabase.from('orders').update({ 
      status: 'pagado', 
      payment_method: metodo
    }).eq('id', id);
    if(!error) refreshOrdersFromStorage();
  }
  async function cancelOrder(id){
    if(!confirm("¿Cancelar este pedido?")) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if(!error) refreshOrdersFromStorage();
  }

  function refreshOrdersFromStorage(){ loadOrders().then(renderOrders); }
  document.getElementById("manual-refresh").onclick = function(e){ e.preventDefault(); refreshOrdersFromStorage(); };

  // Polling de respaldo cada 8 segundos
  setInterval(function(){
    if(adminView.style.display === "block" && !tabCaja.classList.contains("hidden")){
      refreshOrdersFromStorage();
    }
  }, 8000);

  // Supabase Realtime (Instantáneo)
  supabase
    .channel('schema-db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, function(payload) {
      if(adminView.style.display === "block"){
        refreshOrdersFromStorage();
      }
    })
    .subscribe();

  updateMesaUI();
})();
