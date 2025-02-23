import { ref } from "vue";
import { defineStore } from "pinia";
import _debounce from "lodash/debounce";
import _cloneDeep from "lodash/cloneDeep";

import { API_SKIN } from "@/api";
import { $tool } from "@/utils";
import { usePagingLoad } from "@/hooks";

/** @description 皮肤列表页 */
const SkinStore = defineStore("skin", () => {
  const $usePagingLoad = usePagingLoad<Hero.Skin>();

  const ExposeData = {
    /** 是否处于加载中 */
    loading: $usePagingLoad.loading,
    /** 滚动坐标 */
    scroll: $usePagingLoad.scroll,
    /** 暂无更多 */
    finish: $usePagingLoad.finish,
    /** 筛选后的数据列表 */
    filter_list: $usePagingLoad.filter_list,
    /** 展示的数据列表 */
    show_list: $usePagingLoad.show_list,

    /** 性别筛选类型 */
    gender_type: ref<Gender>(0),
    /** 职业类型 */
    profession: ref<Hero.Profession>("全部"),
    /** 价格排序类型 */
    price_type: ref("全部价格"),
    /** 皮肤筛选类型 */
    skin_type: ref("全部皮肤"),
    /** 排序类型 */
    sort_type: ref("倒序"),
  };
  const { scroll, filter_list, gender_type, profession, price_type, skin_type, sort_type } =
    ExposeData;

  /* 一键排序 */
  const sortAll = () => {
    scroll.value = 0;

    /** 职业筛选 */
    const filterProfession = () => {
      const { all_data } = $usePagingLoad;

      if (profession.value === "全部") {
        //为了解决排序拷贝问题
        filter_list.value = [...all_data.value];
      } else {
        filter_list.value = all_data.value.filter((item: Hero.Skin) => {
          return item.profession.includes(profession.value);
        });
      }
    };

    /** 性别筛选 */
    const filterGender = () => {
      const boy: Hero.Skin[] = [];
      const girl: Hero.Skin[] = [];
      filter_list.value.forEach((item) => {
        if (item.gender === "男") {
          boy.push(item);
        } else {
          girl.push(item);
        }
      });

      if (gender_type.value === 1) {
        filter_list.value = boy;
      } else if (gender_type.value === 2) {
        filter_list.value = girl;
      }
    };

    /** 皮肤类型筛选 */
    const filterSkinType = () => {
      //皮肤类型筛选
      const alone = [
        "勇者",
        "史诗",
        "传说",
        "唯一限定",
        "荣耀典藏",
        "KPL",
        "星传说",
        "五虎上将",
        "战令限定",
        "赛季专属",
        "周年限定",
        "五五",
        "正版授权",
        "世冠",
        "王者之证",
        "FMVP",
        "年限定",
      ];
      const multiple = [
        {
          label: "情侣",
          value: ["情人节限定", "520限定"],
        },
        {
          label: "其他限定",
          value: [
            "成就限定",
            "圣诞限定",
            "贵族限定",
            "会员限定",
            "赏金赛限定",
            "战队赛限定",
            "浪一夏限定",
            "圣诞限定",
            "航天限定",
            "仙剑限定",
          ],
        },
        {
          label: "其他专属",
          value: ["必胜客专属", "新春专属", "信誉专属", "源梦", "活动专属", "星会员专属"],
        },
        {
          label: "特殊标志",
          value: ["御龙在天", "国家宝藏", "敦煌研究院", "永宁纪"],
        },
        { label: "团战精神", value: ["沉稳", "敏锐", "掌控", "守护", "坚韧"] },
      ];
      if (skin_type.value && skin_type.value !== "全部皮肤") {
        if (alone.includes(skin_type.value)) {
          filter_list.value = filter_list.value.filter((item) => {
            return item.category.includes(skin_type.value);
          });
        } else {
          multiple.forEach((type) => {
            if (skin_type.value === type.label) {
              filter_list.value = filter_list.value.filter((skin) => {
                return type.value.some((item) => {
                  return skin.category.includes(item);
                });
              });
            }
          });
        }
        filter_list.value = $tool.typeSort(filter_list.value, "category");
      }
    };

    /** 价格排序 */
    const sortPrice = () => {
      const SortStrategy: Record<string, (list: Hero.Skin[]) => Hero.Skin[]> = {
        免费: (list) => {
          const noFree = [
            "积分夺宝",
            "星会员15级",
            "贵族专属",
            "荣耀战令获取",
            "会员限定",
            "限时兑换",
          ];
          const noNum = list.filter(
            (item) => !noFree.includes(item.price.toString()) && isNaN(Number(item.price)),
          );
          return $tool.typeSort(noNum, "price");
        },
        由低到高: (list) => {
          const isNum = list.filter((item) => !isNaN(Number(item.price)));
          return isNum.sort((a, b) => Number(a.price) - Number(b.price));
        },
        由高到低: (list) => {
          const isNum = list.filter((item) => !isNaN(Number(item.price)));
          //筛选出荣耀典藏
          const strange = list.filter((item) => item.type.toString().indexOf("26.png") !== -1);
          return [...strange, ...isNum].sort((a, b) => Number(b.price) - Number(a.price));
        },
      };

      if (price_type.value && price_type.value !== "全部价格") {
        if (SortStrategy.hasOwnProperty(price_type.value)) {
          filter_list.value = SortStrategy[price_type.value](filter_list.value);
          sort_type.value = "正序";
        }
      }
    };

    /** 正/倒排序 */
    const sortType = () => {
      if (sort_type.value === "倒序") {
        filter_list.value.reverse();
      }
    };

    filterProfession();
    filterGender();
    filterSkinType();
    sortPrice();
    sortType();
    ExposeMethods.resetPage();
  };

  /* 防抖筛选皮肤 */
  const debounceSearchSkin = _debounce((name: string) => {
    if (name) {
      filter_list.value = $tool.search(
        _cloneDeep($usePagingLoad.all_data.value),
        name,
        ["skin_name", "hero_name", "category"],
        true,
      );
    } else {
      sortAll();
    }

    ExposeMethods.resetPage();
  }, 500);

  const ExposeMethods = {
    /** @description 设置滚动坐标 */
    setScroll: $usePagingLoad.setScroll,
    /** @description 重新计算分页 */
    resetPage: $usePagingLoad.resetPage,
    /** @description 加载更多 */
    loadMore: $usePagingLoad.loadMore,

    /** @description 获取皮肤列表并设置皮肤类型图片及类型命 */
    async getSkin() {
      /** 用于模糊图片预加载 */
      const poster_blur: string[] = [];

      const skinList = await API_SKIN.getSkin();

      //设置皮肤类型图片
      const base_data: Record<number, Hero.SkinType> = {};
      const skinTypes = await API_SKIN.getSkinType();
      skinTypes.forEach((type) => {
        base_data[type.id] = type;
      });

      skinList.forEach((skin) => {
        const type = base_data[skin.type as number];
        skin.type = type.link;
        skin.category = type.name;

        //设置备用名称，解决高亮问题
        skin.skin_name = skin.name;
        skin.hero_name = skin.heroName;

        poster_blur.push(skin.posterBlur);
      });

      $usePagingLoad.all_data.value = skinList;

      $tool.preloadImages(poster_blur);

      sortAll();
    },

    /**
     * @description: 设置职业
     * @param name 职业名称
     */
    setProfessional(name: Hero.Profession) {
      if (profession.value === name) return;
      profession.value = name;
      sortAll();
    },

    /**
     * @description: 性别筛选
     * @param type 性别标识符
     */
    filterGender(type: Gender) {
      if (gender_type.value === type) return;
      gender_type.value = type;
      sortAll();
    },

    /**
     * @description: 皮肤类型筛选
     * @param type 皮肤类型名称
     */
    filterSkinType(type: string) {
      if (skin_type.value === type) return;
      skin_type.value = type;
      sortAll();
    },

    /**
     * @description: 价格排序
     * @param type 价格排序方式
     */
    sortPrice(type: string) {
      if (price_type.value === type) return;
      price_type.value = type;
      sortAll();
    },

    /**
     * @description: 正序|倒序
     * @param type 排序名称
     */
    sortType(type: string) {
      if (sort_type.value === type) return;
      sort_type.value = type;
      sortAll();
    },

    /** @description 搜索皮肤 */
    searchSkin(name: string) {
      debounceSearchSkin(name);
    },
  };

  return {
    ...ExposeData,
    ...ExposeMethods,
  };
});

export { SkinStore };
