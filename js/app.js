import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const SUPABASE_URL = 'https://yxunapqxcbqvdlbtnflu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_soPWriyC204ng0c5StzzOg_jHj8uL6O';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(function(){
  "use strict";

  var STAFF_PASSWORD = "pisqa2026";
  var STORAGE_KEY = "pisqa_pedidos";

  var CAT_ICONS = {
    "SNACKS":"ic-sandwich", "Postres":"ic-dessert", "Jugos":"ic-juice",
    "Cofee Drinks":"ic-coffee", "DULCE - SNACK":"ic-cookie", "BEBIDAS":"ic-bottle"
  };

  var MENU = [];
  var ALL_PRODUCTS = [];
  
  window.showPublicMenu = function(catName){
    document.getElementById("gallery-section-main").classList.add("hidden");
    document.getElementById("public-menu-view").classList.remove("hidden");
    document.getElementById("public-menu-title").textContent = catName;
    var list = document.getElementById("public-menu-list");
    list.innerHTML = "";
    var prods = ALL_PRODUCTS.filter(p => p.category.toLowerCase() === catName.toLowerCase());
    if(prods.length === 0){
       list.innerHTML = "<p>No hay productos en esta categoría por el momento.</p>";
    } else {
       prods.forEach(p => {
          var img = p.image_url ? p.image_url : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"; // Default food img
          var div = document.createElement("div");
          div.style.cssText = "background:var(--paper); border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.05);";
          div.innerHTML = `
            <img src="${img}" style="width:100%; height:200px; object-fit:cover;">
            <div style="padding:24px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <h3 style="font-size:20px; color:var(--text-main);">${p.name}</h3>
                <div style="font-size:18px; color:var(--brand); font-family:Fraunces,serif;">S/ ${parseFloat(p.price).toFixed(2)}</div>
              </div>
              <p style="font-size:14px; color:var(--text-muted); margin:0; line-height:1.5;">${p.description || ''}</p>
            </div>
          `;
          list.appendChild(div);
       });
    }
  };

  window.closePublicMenu = function(){
    document.getElementById("public-menu-view").classList.add("hidden");
    document.getElementById("gallery-section-main").classList.remove("hidden");
  };

  async function loadMenu(){
    const { data, error } = await supabase.from('products').select('*').order('category').order('id');
    if (error) {
       alert("Error conectando a Supabase: " + JSON.stringify(error));
       return;
    }
    if (data) {
       if (data.length === 0) {
           console.warn("La tabla de productos está vacía.");
       }
       ALL_PRODUCTS = data;
       var groups = {};
       data.forEach(function(p){
         if(!groups[p.category]) groups[p.category] = { cat: p.category, items: [] };
         groups[p.category].items.push({ id: p.id, nombre: p.name, desc: p.description, precio: parseFloat(p.price), img: p.image_url });
       });
       MENU = Object.values(groups);
       if(MENU.length > 0){
          activeAdminCat = MENU[0].cat;
          renderAdminMenu();
       }
       renderProductList();
    }
  }

  document.getElementById("year-now").textContent = new Date().getFullYear();

  function fmt(n){ return "S/ " + n.toFixed(2); }
  function iconSvg(id, extra){
    return '<svg '+(extra||'')+' viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="width:24px; height:24px; stroke:var(--brand);"><use href="#'+id+'"/></svg>';
  }

  // ---------- PUBLIC MENU REMOVED ----------

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

  var adminTabBtns = document.querySelectorAll(".admin-tab-btn");
  var tabPedido = document.getElementById("tab-pedido");
  var tabCaja = document.getElementById("tab-caja");
  var tabInv = document.getElementById("tab-inventario");
  var tabMenu = document.getElementById("tab-menu");
  
  adminTabBtns.forEach(function(btn){
    btn.onclick = function(){
      adminTabBtns.forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      var which = btn.getAttribute("data-admin-tab");
      tabPedido.classList.add("hidden");
      tabCaja.classList.add("hidden");
      tabInv.classList.add("hidden");
      tabMenu.classList.add("hidden");
      if(which === "pedido"){
        tabPedido.classList.remove("hidden");
      } else if (which === "caja"){
        tabCaja.classList.remove("hidden");
        refreshOrdersFromStorage();
      } else if (which === "inventario"){
        tabInv.classList.remove("hidden");
        loadInventory();
      } else if (which === "menu"){
        tabMenu.classList.remove("hidden");
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
      // En admin si mostramos precio porque el cajero necesita cobrar
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
      cartLinesEl.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:32px;height:32px;margin:0 auto 10px;opacity:0.5;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>Agrega productos para la mesa.</div>';
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
      
      // -- DEDUCCIÓN DE INVENTARIO --
      var deductions = [];
      items.forEach(function(cartItem){
         var matches = recipesCache.filter(function(r){ return r.product_id === cartItem.id; });
         matches.forEach(function(m){
            deductions.push({ id: m.inventory_id, qty: m.qty_needed * cartItem.cantidad });
         });
      });
      if(deductions.length > 0){
         supabase.rpc('deduct_stock', { deductions_input: deductions }).then(function(res){
            loadInventory();
         });
      }

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
      var cardBtn = document.createElement("button");
      cardBtn.className = "pay-btn efectivo"; cardBtn.style.background = "#2196F3"; cardBtn.textContent = "Tarjeta";
      cardBtn.onclick = function(){ markPaid(o.id, "Tarjeta"); };
      var cancelBtn = document.createElement("button");
      cancelBtn.className = "cancel-btn"; cancelBtn.textContent = "Cancelar";
      cancelBtn.onclick = function(){ cancelOrder(o.id); };
      actions.appendChild(yapeBtn);
      actions.appendChild(efvBtn);
      actions.appendChild(cardBtn);
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

  // ---------- GESTIÓN DE MENÚ ----------
  function renderProductList(){
    var list = document.getElementById("product-list");
    if(!list) return;
    list.innerHTML = "";
    if(ALL_PRODUCTS.length === 0){
      list.innerHTML = '<div style="color:#aaa;">No hay productos en el menú.</div>';
      return;
    }
    ALL_PRODUCTS.forEach(function(p){
      var div = document.createElement("div");
      div.style.cssText = "padding:16px; background:var(--pos-card); border-radius:12px; border:1px solid var(--pos-border);";
      div.innerHTML = 
        '<div style="display:flex; justify-content:space-between; margin-bottom:4px;">' +
        '<strong style="color:#fff; font-size:16px;">' + p.id + ' - ' + p.name + '</strong>' +
        '<span style="color:var(--gold); font-family:Fraunces,serif;">' + fmt(parseFloat(p.price)) + '</span>' +
        '</div>' +
        '<div style="font-size:13px; color:#aaa; margin-bottom:12px;">' + p.category + ' | ' + p.description + '</div>' +
        '<button class="delete-prod" style="background:transparent; border:1px solid #FF6B6B; color:#FF6B6B; padding:6px 12px; border-radius:6px; font-size:12px;">Eliminar</button>';
      div.querySelector(".delete-prod").onclick = async function(){
         if(confirm("¿Eliminar " + p.name + "?")){
            await supabase.from("products").delete().eq("id", p.id);
            loadMenu();
         }
      };
      list.appendChild(div);
    });
  }

  var formProd = document.getElementById("form-prod");
  if(formProd){
    formProd.onsubmit = async function(e){
      e.preventDefault();
      var p = {
        id: document.getElementById("prod-id").value,
        category: document.getElementById("prod-cat").value,
        name: document.getElementById("prod-name").value,
        description: document.getElementById("prod-desc").value,
        image_url: document.getElementById("prod-img").value || null,
        price: parseFloat(document.getElementById("prod-price").value)
      };
      const { error } = await supabase.from('products').upsert([p]);
      if(!error) {
         formProd.reset();
         loadMenu();
      } else {
         alert("Error al guardar producto.");
      }
    };
  }

  // ---------- GESTIÓN DE INVENTARIO ----------
  var inventoryCache = [];
  var recipesCache = [];
  
  async function loadInventory(){
    var inv = await supabase.from('inventory').select('*').order('name');
    var rec = await supabase.from('recipes').select('*');
    if(inv.data) inventoryCache = inv.data;
    if(rec.data) recipesCache = rec.data;
    renderInventory();
  }

  function renderInventory(){
    var list = document.getElementById("inventory-list");
    if(!list) return;
    list.innerHTML = "";
    if(inventoryCache.length === 0){
      list.innerHTML = '<div style="color:#aaa;">No hay insumos. Ejecuta el código SQL en Supabase para crear las tablas.</div>';
      return;
    }
    inventoryCache.forEach(function(item){
      var div = document.createElement("div");
      div.style.cssText = "display:flex; justify-content:space-between; padding:16px; background:var(--pos-card); border-radius:12px; border:1px solid var(--pos-border);";
      div.innerHTML = 
        '<div style="font-size:16px; color:#fff; font-weight:600;">'+item.name+'</div>' +
        '<div style="display:flex; align-items:center; gap:12px;">' +
        '<div style="font-size:18px; color:var(--gold); font-family:Fraunces,serif;">' + 
          item.stock_qty + ' <span style="font-size:12px; color:#aaa; font-family:Work Sans,sans-serif;">' + item.unit + '</span>' +
        '</div>' +
        '<button class="delete-inv" style="background:transparent; border:none; color:#FF6B6B; font-size:12px; text-decoration:underline;">Eliminar</button>' +
        '</div>';
      div.querySelector(".delete-inv").onclick = async function(){
         if(confirm("¿Eliminar " + item.name + " del almacén?")){
            await supabase.from("inventory").delete().eq("id", item.id);
            loadInventory();
         }
      };
      list.appendChild(div);
    });
  }

  var formInv = document.getElementById("form-inv");
  if(formInv){
    formInv.onsubmit = async function(e){
      e.preventDefault();
      var ins = {
        name: document.getElementById("inv-name").value,
        stock_qty: parseFloat(document.getElementById("inv-qty").value),
        unit: document.getElementById("inv-unit").value
      };
      const { error } = await supabase.from('inventory').insert([ins]);
      if(!error) {
         formInv.reset();
         loadInventory();
      } else {
         alert("Error al guardar insumo.");
      }
    };
  }

  // Pre-load on startup so we can deduct immediately
  loadMenu();
  loadInventory();

  // Polling de respaldo cada 8 segundos
  setInterval(function(){
    if(adminView.style.display === "block" && !tabCaja.classList.contains("hidden")){
      refreshOrdersFromStorage();
    }
    if(adminView.style.display === "block" && !tabInv.classList.contains("hidden")){
      loadInventory();
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
    .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, function(payload) {
      if(adminView.style.display === "block" && !tabInv.classList.contains("hidden")){
        loadInventory();
      }
    })
    .subscribe();

  updateMesaUI();
})();
