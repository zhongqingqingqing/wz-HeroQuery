//立即执行函数，避免污染全局
(async function () {
  /**
   * 从网络获取当前的英雄数据
   * @returns Promise
   */
  async function getHeroes() {
    return fetch("https://study.duyiedu.com/api/herolist")
      .then((resp) => resp.json())
      .then((resp) => resp.data.reverse());
  }

  /**
   * 1、初始化
   */

  //拿到需要操作的DOM元素
  const doms = {
    ul: document.querySelector(".list"),
    radios: document.querySelectorAll(".radio"),
    keyword: document.querySelector(".input input"),
  };

  //拿到所有的英雄数据
  let allHeroes = await getHeroes();
  //渲染全部英雄数据到ul中
  setHeroes(allHeroes);

  /**
   * 根据传入的新数组，渲染新的英雄数据到ul中
   * @param {Array} heroesArr
   */
  function setHeroes(heroesArr) {
    doms.ul.innerHTML = heroesArr
      .map(
        (h) => `<li class="list-item">
      <a href="https://pvp.qq.com/web201605/herodetail/${h.ename}.shtml">
        <img
          src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${h.ename}/${h.ename}.jpg"
          alt=""
        />
        <span>${h.cname}</span>
      </a>
    </li>`
      )
      .join("");
  }

  /**
   * 2、交互
   */

  //循环所有的radio元素，给每个radio元素注册点击事件
  for (const radio of doms.radios) {
    radio.addEventListener("click", function () {
      //1.更改点击的radio样式
      setChoose(this);
      //2.更改ul中的数据
      filterHeroes(this);
    });
  }

  //给搜索框的input输入框注册input事件
  doms.keyword.addEventListener("input", function () {
    const heroesArr = allHeroes.filter((h) => h.cname.includes(this.value));

    //渲染挑选后的英雄数据
    setHeroes(heroesArr);

    //radio的选中状态一定是在‘全部’上的
    const radio = document.querySelector('.radio[data-type="all"]');
    setChoose(radio);
  });

  //给被点击的radio添加对应样式
  function setChoose(radio) {
    //1.去除之间radio被选中的样式
    const checkedRadio = document.querySelector(".checked");
    checkedRadio && checkedRadio.classList.remove("checked");

    //2.给被点击的radio添加对应样式
    radio.classList.add("checked");
  }

  /**
   * 根据传入的radio,挑选出对应的英雄数据的数组，并渲染成html,加到ul中
   * @param {*} radio
   */
  function filterHeroes(radio) {
    let heroesArr; //英雄数组

    //拿到radio的自定义属性
    const type = radio.dataset.type;
    const value = radio.dataset.value;

    if (type === "all") {
      // 全部英雄数据
      heroesArr = allHeroes;
    } else if (type === "pay_type") {
      heroesArr = allHeroes.filter((h) => h.pay_type === +value);
    } else if (type === "hero_type") {
      heroesArr = allHeroes.filter(
        (h) => h.hero_type === +value || h.hero_type2 === +value
      );
    }
    //根据最终的英雄数组，渲染html数据到ul中
    setHeroes(heroesArr);
  }
})();
