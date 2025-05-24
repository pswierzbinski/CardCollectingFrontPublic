export interface ICardWithStats {
    id: number;
    name: string;
    series: string;
    type: string;
    faction: string;
    subtype: string;
    cost: number;
    loyalty: number;
    attack: number;
    defense: number;
    ruleText: string;
    description: string;
    artist: string;
    source: string;
    licence: string;
}

export class CardWithStats {
    private _id: number;
    private _name: string;
    private _series: string;
    private _type: string;
    private _faction: string;
    private _subtype: string;
    private _cost: number;
    private _loyalty: number;
    private _attack: number;
    private _defense: number;
    private _ruleText: string;
    private _description: string;
    private _artist: string;
    private _source: string;
    private _licence: string;
    private _wishlistCount: number;
    private _collectionCount: number;

    constructor(id: number, name: string, series: string, type: string, faction: string, subtype: string, cost: number, loyalty: number, attack: number, defense: number, ruleText: string, description: string, artist: string, source: string, licence: string, wishlistCount: number, collectionCount: number) {
        this._id = id;
        this._name = name;
        this._series = series;
        this._type = type;
        this._faction = faction;
        this._subtype = subtype;
        this._cost = cost;
        this._loyalty = loyalty;
        this._attack = attack;
        this._defense = defense;
        this._ruleText = ruleText;
        this._description = description;
        this._artist = artist;
        this._source = source;
        this._licence = licence;
        this._wishlistCount = wishlistCount;
        this._collectionCount = collectionCount;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get series(): string {
        return this._series;
    }

    get type(): string {
        return this._type;
    }

    get faction(): string {
        return this._faction;
    }

    get subtype(): string {
        return this._subtype;
    }

    get cost(): number {
        return this._cost;
    }

    get loyalty(): number {
        return this._loyalty;
    }

    get attack(): number {
        return this._attack;
    }

    get defense(): number {
        return this._defense;
    }

    get ruleText(): string {
        return this._ruleText;
    }

    get description(): string {
        return this._description;
    }

    get artist(): string {
        return this._artist;
    }

    get source(): string {
        return this._source;
    }

    get licence(): string {
        return this._licence;
    }

    get wishlistCount(): number {
        return this._wishlistCount;
    }

    get collectionCount(): number {
        return this._collectionCount;
    }

    set name(name: string) {
        this._name = name;
    }

    set series(series: string) {
        this._series = series;
    }

    set type(type: string) {
        this._type = type;
    }

    set faction(faction: string) {
        this._faction = faction;
    }

    set subtype(subtype: string) {
        this._subtype = subtype;
    }

    set cost(cost: number) {
        this._cost = cost;
    }

    set loyalty(loyalty: number) {
        this._loyalty = loyalty;
    }

    set attack(attack: number) {
        this._attack = attack;
    }

    set defense(defense: number) {
        this._defense = defense;
    }

    set ruleText(ruleText: string) {
        this._ruleText = ruleText;
    }

    set description(description: string) {
        this._description = description;
    }

    set artist(artist: string) {
        this._artist = artist;
    }

    set source(source: string) {
        this._source = source;
    }

    set licence(licence: string) {
        this._licence = licence;
    }

    set wishlistCount(wishlistCount: number) {
        this._wishlistCount = wishlistCount;
    }

    set collectionCount(collectionCount: number) {
        this._collectionCount = collectionCount;
    }

}