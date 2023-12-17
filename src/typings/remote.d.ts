/** @description 远程文件数据类型 */
declare namespace Remote {
  interface Id {
    /** 英雄id */
    id: number;
  }
  /** @description 英雄相关 */
  namespace Hero {
    /** @description 英雄名列表 */
    interface Name extends Id {
      /** 英雄名 */
      value: string;
    }
    /** @description 英雄名拼音列表 */
    interface Pinyin extends Id {
      /** 英雄名拼音 */
      value: string;
    }
    /** @description 英雄性别列表 */
    interface Gender extends Id {
      /** 英雄性别 */
      value: string;
    }
    /** @description 英雄头像列表 */
    interface Avatar extends Id {
      /** 英雄头像 */
      value: string;
    }
    /** @description 英雄图片列表 */
    interface Image extends Id {
      /** 海报（标准大小） */
      poster: string;
      /** 海报（模糊小图） */
      posterBlur: string;
      /** 海报（4k大图） */
      posterBig: string;
      /** 竖版封面（标准大小） */
      cover: string;
      /** 竖版封面（模糊小图） */
      coverBlur: string;
    }
    /** @description 英雄职业列表 */
    interface Profession extends Id {
      /** 英雄职业 */
      value: string;
    }
    /** @description 英雄图集列表 */
    interface Atlas extends Id {
      /** 英雄图集 */
      skins: string;
    }
  }
}
