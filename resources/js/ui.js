
/* popup */
class DesignPopup {
  constructor(option) {
    // variable
    this.option = option;
    this.selector = document.querySelector(this.option.selector);
    this.touchstart = "ontouchstart" in window;
    if (!this.selector) {
      return;
    }

    this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
    this.domHtml = document.querySelector("html");
    this.domBody = document.querySelector("body");
    this.pagewrap = document.querySelector(".page_wrap");
    this.layer_wrap_parent = null;
    this.btn_closeTrigger = null;
    this.scrollValue = 0;

    // init
    const popupGroupCreate = document.createElement("div");
    popupGroupCreate.classList.add("layer_wrap_parent");
    if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
      this.pagewrap.append(popupGroupCreate);
    }
    this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");

    // event
    this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
    this.bg_design_popup = this.selector.querySelector(".bg_dim");
    let closeItemArray = [...this.btn_close];
    if (!!this.selector.querySelectorAll(".close_trigger")) {
      this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
      closeItemArray.push(...this.btn_closeTrigger);
    }
    if (closeItemArray.length) {
      closeItemArray.forEach((element) => {
        element.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            this.popupHide(this.selector);
          },
          false
        );
      });
    }
  }
  dimCheck() {
    const popupActive = document.querySelectorAll(".popup_wrap.active");
    if (!!popupActive[0]) {
      popupActive[0].classList.add("active_first");
    }
    if (popupActive.length > 1) {
      this.layer_wrap_parent.classList.add("has_active_multi");
    } else {
      this.layer_wrap_parent.classList.remove("has_active_multi");
    }
  }
  popupShow(option) {
    let target = this.option.selector;
    let instance_option = option || {};
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    if (this.selector == null) {
      return;
    }
    if (this.touchstart) {
      this.domHtml.classList.add("touchDis");
    }
    this.selector.classList.add("active");
    setTimeout(() => {
      this.selector.classList.add("motion_end");
      if ("openCallback" in instance_option) {
        instance_option.openCallback();
      }
    }, 30);
    if ("beforeCallback" in this.option) {
      this.option.beforeCallback();
    }
    if ("callback" in this.option) {
      this.option.callback();
    }
    this.layer_wrap_parent.append(this.selector);
    // popupEventFunc();
    this.dimCheck();
  }
  popupHide(option) {
    let target = this.option.selector;
    let instance_option = option || {};
    if (!!target) {
      this.selector.classList.remove("motion");
      if ("beforeClose" in this.option) {
        this.option.beforeClose();
      }
      if ("beforeClose" in instance_option) {
        instance_option.beforeClose();
      }
      //remove
      this.selector.classList.remove("motion_end");
      setTimeout(() => {
        this.selector.classList.remove("active");
        let closeTimer = 0;
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = 0;
        } else {
          if ("closeCallback" in this.option) {
            this.option.closeCallback();
          }
          closeTimer = setTimeout(() => {
            if ("closeCallback" in instance_option) {
              instance_option.closeCallback();
            }
          }, 30);
        }
      }, 400);
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      this.dimCheck();

      if (this.design_popup_wrap_active.length == 1) {
        this.domHtml.classList.remove("touchDis");
      }
    }
  }
}



/* modal */
function designModal(option) {
  const modalGroupCreate = document.createElement("div");
  let domHtml = document.querySelector("html");
  let design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
  let modal_wrap_parent = null;
  let modal_item = null;
  let pagewrap = document.querySelector(".page_wrap");
  let showNum = 0;
  let okTextNode = option.okText ?? "확인";
  let cancelTextNode = option.cancelText ?? "취소";
  let closeBtnDisplay = option.closeDisplay ?? true;
  let submitBtnDisplay = option.submitDisplay ?? true;
  modalGroupCreate.classList.add("modal_wrap_parent");

  if (!modal_wrap_parent && !document.querySelector(".modal_wrap_parent")) {
    pagewrap.append(modalGroupCreate);
  } else {
    modalGroupCreate.remove();
  }
  modal_wrap_parent = document.querySelector(".modal_wrap_parent");

  let btnHTML = ``;

  if (option.modaltype === "confirm") {
    btnHTML = `
    <a href="javascript:;" class="btn_quad btn_modal_submit cancelcall"><span class="text_node">${cancelTextNode}</span></a>
    <a href="javascript:;" class="btn_quad btn_modal_submit primary okcall"><span class="text_node">${okTextNode}</span></a>
    `;
  } else {
    btnHTML = `
      <a href="javascript:;" class="btn_quad btn_modal_submit primary okcall"><span class="text_node">${okTextNode}</span></a>
    `;
  }

  let modal_template = `
    <div class="modal_wrap">
        <div class="bg_dim"></div>
        <div class="modal_box_tb">
            <div class="modal_box_td">
                <div class="modal_box_item">
                    <div class="modal_box_message_row">
                        <p class="modal_box_message">${option.message}</p>
                    </div>
                    <div class="btn_modal_submit_wrap btn_quad_wrap">
                        ${btnHTML}
                    </div>
                    <a href="javascript:;" class="btn_modal_close"></a>
                </div>
            </div>
        </div>
    </div>
  `;
  modal_wrap_parent.innerHTML = modal_template;
  modal_item = modal_wrap_parent.querySelector(".modal_wrap");
  modal_item.classList.add("active");
  if (showNum) {
    clearTimeout(showNum);
  }
  showNum = setTimeout(() => {
    modal_item.classList.add("motion_end");
    modal_item.addEventListener("transitionend", (e) => {
      if (e.currentTarget.classList.contains("motion_end")) {
        if (option.showCallback) {
          option.showCallback();
        }
      }
    });
  }, 10);

  let btn_modal_submit_wrap = modal_item.querySelector(".btn_modal_submit_wrap");
  let btn_modal_submit = modal_item.querySelectorAll(".btn_modal_submit");
  let btn_modal_close = modal_item.querySelectorAll(".btn_modal_close");
  if (!submitBtnDisplay) {
    modal_item.querySelector(".modal_box_item").classList.add("submit_not");
  }
  if (!!btn_modal_submit) {
    btn_modal_submit.forEach((item) => {
      let eventIs = false;

      if (!submitBtnDisplay) {
        item.remove();
        btn_modal_submit_wrap.remove();
      } else {
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          let thisTarget = e.currentTarget;
          closeAction();
          if (thisTarget.classList.contains("okcall")) {
            if (option.okcallback) {
              option.okcallback();
            }
          } else if (thisTarget.classList.contains("cancelcall")) {
            if (option.cancelcallback) {
              option.cancelcallback();
            }
          }
          eventIs = true;
        });
      }
    });
  }
  if (!closeBtnDisplay) {
    modal_item.querySelector(".modal_box_item").classList.add("close_not");
  }
  if (!!btn_modal_close) {
    btn_modal_close.forEach((item) => {
      let eventIs = false;
      if (!closeBtnDisplay) {
        item.remove();
      } else {
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          closeAction();
          eventIs = true;
        });
      }
    });
  }

  function closeAction() {
    let actionNum = 0;
    modal_item.classList.remove("motion_end");
    if (design_popup_wrap_active.length === 0) {
      domHtml.classList.remove("touchDis");
    }
    if (actionNum) {
      clearTimeout(actionNum);
    }
    actionNum = setTimeout(() => {
      modal_item.classList.remove("active");
      modal_item.remove();
    }, 500);
  }
}



/* combo box */
function comboFunc() {
  const combo_item = document.querySelectorAll(".combo_item");
  const combo_option_group = document.querySelectorAll(".combo_option_group");

  addDynamicEventListener(document.body, "click", ".combo_target", function (e) {
    let thisTarget = e.target;
    let thisParent = thisTarget.closest(".combo_item");
    let thisOptionGroup = thisParent.querySelector(".combo_option_group");
    let appendOption = null;
    let combo_option_scroll = null;
    if (thisOptionGroup !== null) {
      comboInit(thisParent);
    }
    comboPosAction();
    // not
    combo_item.forEach((element) => {
      if (element !== thisParent) {
        element.classList.remove("active");
      }
    });

    thisTarget.style.width = thisTarget.getBoundingClientRect().width + "px";

    appendOption = document.querySelector(`[data-option='${thisParent.getAttribute("id")}']`);
    combo_option_scroll = appendOption.querySelector(".combo_option_scroll");
    appendOptionListOption = combo_option_scroll.getAttribute("data-rowCount") !== null ? combo_option_scroll.getAttribute("data-rowCount") : 5;
    combo_option_group.forEach((element) => {
      if (element !== appendOption) {
        element.classList.remove("active");
      }
    });
    thisParent.classList.toggle("active");
    appendOption.classList.toggle("active");
    if (appendOption.classList.contains("active")) {
      if (combo_option_scroll.classList.contains("addHeight")) {
        return;
      }
      if (appendOption.querySelectorAll("li")[appendOptionListOption] !== undefined) {
        combo_option_scroll.style.maxHeight = `${appendOption.querySelectorAll("li")[appendOptionListOption].offsetTop /* +7 */}px`;
      }
      combo_option_scroll.classList.add("addHeight");
    }
  });
  addDynamicEventListener(document.body, "click", ".combo_option", function (e) {
    let thisTarget = e.target;
    let thisParent = thisTarget.closest(".combo_option_group");
    let thisTargetText = thisTarget.textContent;
    let comboCallItem = document.querySelector(`[id='${thisParent.getAttribute("data-option")}']`);
    let comboCallTarget = comboCallItem.querySelector(".combo_target");

    if (thisTarget.classList.contains("disabled")) {
      return;
    }
    comboCallTarget.textContent = thisTargetText;
    thisParent.classList.remove("active");
    comboCallItem.classList.remove("active");
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest(".combo_item") !== null) {
      return;
    }
    comtoReset();
  });

  let currentWid = window.innerWidth;
  window.addEventListener("resize", () => {
    if (currentWid !== window.innerWidth) {
      comboPosAction();
    }
    currentWid = window.innerWidth;
  });

  function comtoReset() {
    const combo_item = document.querySelectorAll(".combo_item");
    const combo_option_group = document.querySelectorAll(".combo_option_group");

    combo_item.forEach((element) => {
      element.classList.remove("active");
    });
    combo_option_group.forEach((element) => {
      element.classList.remove("active");
    });
  }

  function comboInit() {
    const combo_item = document.querySelectorAll(".combo_item");
    const appBody = document.querySelector(".page_wrap");

    combo_item.forEach((element, index) => {
      let thisElement = element;
      let option_group = thisElement.querySelector(".combo_option_group");
      if (element.getAttribute("id") === null) {
        thisElement.setAttribute("id", "combo_item_" + index);
        option_group.setAttribute("data-option", "combo_item_" + index);
      } else {
        option_group.setAttribute("data-option", thisElement.getAttribute("id"));
      }
      if (element.closest(".fullpop_contlow") !== null) {
        element.closest(".fullpop_contlow").appendChild(option_group);
      } else {
        appBody.appendChild(option_group);
      }
    });
  }

  function comboPosAction() {
    const appendOption = document.querySelectorAll(".combo_option_group");
    appendOption.forEach((element, index) => {
      let comboCall = document.querySelector(`[id='${element.getAttribute("data-option")}']`);
      if (!comboCall) {
        return;
      }
      let combo_top = window.scrollY + comboCall.getBoundingClientRect().top;
      let fullpop_contlow_top = 0;
      let combo_left = comboCall.getBoundingClientRect().left;
      let fullpop_contlow_left = 0;

      if (comboCall.closest(".fullpop_contlow") !== null) {
        fullpop_contlow_top = comboCall.closest(".fullpop_contlow").getBoundingClientRect().top;
        fullpop_contlow_left = comboCall.closest(".fullpop_contlow").getBoundingClientRect().left;
        element.setAttribute(
          "style",
          `
              top : ${combo_top - fullpop_contlow_top + comboCall.getBoundingClientRect().height - 1}px; 
              left : ${combo_left - fullpop_contlow_left}px;
              width : ${comboCall.getBoundingClientRect().width}px;
          `
        );
      } else {
        element.setAttribute(
          "style",
          `
              top : ${combo_top + comboCall.getBoundingClientRect().height - 1}px; 
              left : ${combo_left}px;
              width : ${comboCall.getBoundingClientRect().width}px;
          `
        );
      }
    });
  }
}

function comboChangeCallback(option) {
  addDynamicEventListener(document.body, "click", `[data-option='${option.target}'] .combo_option`, function (e) {
    let thisEventObj = e.target;
    let thisEventObjValue = thisEventObj.getAttribute("data-value");
    if ("callback" in option) {
      option.callback(thisEventObjValue);
    }
  });
}