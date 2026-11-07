const CHARACTER_DEFAULTS_ = { theme: 'purple', hat: 'none', scarf: 'purple', hair: 'brown', skin: 'peach', top: 'lavender', bottom: 'navy', glasses: 'none', shoes: 'white' };
const CHARACTER_ITEMS_ = {
  purple: { slot: 'theme', value: 'purple', cost: 0, label: '보라 마법' },
  mint: { slot: 'theme', value: 'mint', cost: 5, label: '민트 별빛' },
  pink: { slot: 'theme', value: 'pink', cost: 10, label: '딸기 축제' },
  gold: { slot: 'theme', value: 'gold', cost: 0, label: '금빛 달인', badge: '한자 달인 배지' },
  'hat:crown': { slot: 'hat', value: 'crown', cost: 8, label: '별빛 왕관', color: '#ffd262' },
  'hat:cap': { slot: 'hat', value: 'cap', cost: 7, label: '파랑 야구 모자', color: '#5399f0' },
  'hat:cat': { slot: 'hat', value: 'cat', cost: 12, label: '고양이 귀 모자', color: '#ae7dde' },
  'scarf:mint': { slot: 'scarf', value: 'mint', cost: 5, label: '민트 목도리', color: '#53d8ab' },
  'scarf:pink': { slot: 'scarf', value: 'pink', cost: 10, label: '딸기 목도리', color: '#ff86ae' },
  'hair:plum': { slot: 'hair', value: 'plum', cost: 5, label: '자두색 머리', color: '#682b6e' },
  'hair:short': { slot: 'hair', value: 'short', cost: 0, label: '짧은 머리', color: '#352b47' },
  'hair:curly': { slot: 'hair', value: 'curly', cost: 6, label: '곱슬 머리', color: '#6d3d28' },
  'skin:tan': { slot: 'skin', value: 'tan', cost: 0, label: '구릿빛 피부', color: '#bd7853' },
  'skin:deep': { slot: 'skin', value: 'deep', cost: 0, label: '짙은 피부', color: '#855035' },
  'top:striped': { slot: 'top', value: 'striped', cost: 6, label: '딸기 줄무늬 티', color: '#ff87a7' },
  'top:jacket': { slot: 'top', value: 'jacket', cost: 10, label: '별 자수 재킷', color: '#4a8fdf' },
  'bottom:green': { slot: 'bottom', value: 'green', cost: 5, label: '초록 바지', color: '#459c7a' },
  'bottom:shorts': { slot: 'bottom', value: 'shorts', cost: 6, label: '보라 반바지', color: '#936acc' },
  'glasses:round': { slot: 'glasses', value: 'round', cost: 6, label: '동그란 안경', color: '#4c427f' },
  'glasses:star': { slot: 'glasses', value: 'star', cost: 12, label: '별 안경', color: '#e9a63b' },
  'shoes:red': { slot: 'shoes', value: 'red', cost: 5, label: '체리 운동화', color: '#f16e80' },
  'shoes:mint': { slot: 'shoes', value: 'mint', cost: 7, label: '민트 운동화', color: '#56cba7' }
};
const CHARACTER_BADGES_ = ['놀이 완주 배지', '한자 달인 배지', '한자 탐험 완주 배지'];

function characterState_(input) {
  const source = input && typeof input === 'object' ? input : {};
  const unique = (list, filter, max) => Array.isArray(list) ? [...new Set(list.filter(filter))].slice(0, max) : [];
  const owned = unique(source.owned, item => typeof item === 'string' && Object.prototype.hasOwnProperty.call(CHARACTER_ITEMS_, item), Object.keys(CHARACTER_ITEMS_).length);
  if (!owned.includes('purple')) owned.push('purple');
  const outfit = {};
  for (const [slot, fallback] of Object.entries(CHARACTER_DEFAULTS_)) {
    const equipped = slot === 'theme' ? source[slot] : slot + ':' + source[slot];
    outfit[slot] = owned.includes(equipped) && CHARACTER_ITEMS_[equipped].slot === slot ? CHARACTER_ITEMS_[equipped].value : fallback;
  }
  return {
    coins: Number.isSafeInteger(source.coins) ? Math.max(0, Math.min(source.coins, 1000000)) : 0,
    badges: unique(source.badges, badge => CHARACTER_BADGES_.includes(badge), 3),
    learned: unique(source.learned, characterCardId_, 1500),
    owned,
    ...outfit
  };
}

function characterCardId_(id) {
  return typeof id === 'string' && /^(?:[1-6]-[0-9]{2}|(?:base|extra)-[1-6]-[0-9a-f]{4,6})$/.test(id);
}

function applyCharacterChange_(state, change) {
  switch (change.type) {
    case 'learn':
      if (!characterCardId_(change.id) || state.learned.length >= 1500) return false;
      if (!state.learned.includes(change.id)) {
        state.learned.push(change.id);
        state.coins += 1;
      }
      return true;
    case 'badge':
      if (!CHARACTER_BADGES_.includes(change.badge) || typeof change.earned !== 'boolean') return false;
      if (!state.badges.includes(change.badge)) state.badges.push(change.badge);
      if (change.earned) state.coins += 5;
      return true;
    case 'equip': {
      if (typeof change.item !== 'string' || !Object.prototype.hasOwnProperty.call(CHARACTER_ITEMS_, change.item)) return false;
      const item = CHARACTER_ITEMS_[change.item];
      if (change.remove === true) {
        if (item.slot === 'theme') return false;
        if (state[item.slot] === item.value) state[item.slot] = CHARACTER_DEFAULTS_[item.slot];
        return true;
      }
      if (!state.owned.includes(change.item)) {
        if (state.coins < item.cost || (item.badge && !state.badges.includes(item.badge))) return false;
        state.coins -= item.cost;
        state.owned.push(change.item);
      }
      state[item.slot] = item.value;
      return true;
    }
    default:
      return false;
  }
}


module.exports = { CHARACTER_DEFAULTS_, CHARACTER_ITEMS_, CHARACTER_BADGES_, characterState_, applyCharacterChange_ };
