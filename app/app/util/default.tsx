import React from "react";
import {Clipboard} from "react-native";

let uuidCounter = new Date().getTime();

export function uuid(): string {
    return (uuidCounter++).toString(16);
}

export function sum(arr: number[]): number {
    return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

export function sumByKey<T>(data: T[], key: keyof T): number {
    let sum = 0;
    data.forEach(_ => (sum += parseFloat(_[key].toString()) || 0));
    return sum;
}

export function mapArrayToObject<T, V>(arr: T[], mapperCallback: (item: T, index: number) => [string, V]): {[key: string]: V} {
    const result: {[key: string]: V} = {};
    arr.forEach((item, index) => {
        const mappedKV = mapperCallback(item, index);
        result[mappedKV[0]] = mappedKV[1];
    });
    return result;
}

export function mapEnumToArray<EnumType>(enumMap: EnumType): Array<EnumType[keyof EnumType]> {
    const result: Array<EnumType[keyof EnumType]> = [];
    Object.values(enumMap).forEach((key: EnumType[keyof EnumType]) => result.push(key));
    return result;
}

export function mapObject<T extends object, V>(object: T, mapperCallback: (key: keyof T & string, value: T[keyof T], index: number) => V): Record<keyof T, V> {
    const newObject = {};
    Object.keys(object).forEach((key, index) => {
        const mappedValue = mapperCallback(key as keyof T & string, object[key], index);
        newObject[key] = mappedValue;
    });

    return newObject as Record<keyof T, V>;
}

export function mapObjectToArray<T extends object, V>(object: T, mapperCallback: (key: keyof T & string, value: T[keyof T], index: number) => V): V[] {
    const result: V[] = [];
    Object.keys(object).forEach((key, index) => result.push(mapperCallback(key as keyof T & string, object[key], index)));
    return result;
}

export function genArray<T>(length: number, generator: (index: number) => T): T[] {
    const result: T[] = [];
    for (let i = 0; i < length; i++) {
        result.push(generator(i));
    }
    return result;
}

export function truncateText(text: string, maxLength: number, suffix: string = "…") {
    return text.length > maxLength ? text.substr(0, maxLength) + suffix : text;
}

export function isEmptyObject(object: object) {
    return Object.keys(object).length === 0;
}

export function getRandomElement<T>(array: T[]): T | null {
    const length = array.length;
    return length > 0 ? array[Math.floor(Math.random() * length)] : null;
}

export function copyToClipboard(str: string) {
    Clipboard.setString(str);
    // OverlayManager.toast("复制成功");
}

export function deepClone<T extends object>(object: T): T {
    return JSON.parse(JSON.stringify(object));
}

export function joinReactNodes(nodes: React.ReactNode[], separator: React.ReactNode, innerJoin: boolean = true): React.ReactNode {
    const joinedNodes: React.ReactNode[] = nodes.map((_, index) => (
        <React.Fragment key={index}>
            {_}
            {index < nodes.length - 1 && separator}
        </React.Fragment>
    ));
    if (!innerJoin) {
        joinedNodes.unshift(<React.Fragment key="first">{separator}</React.Fragment>);
        joinedNodes.push(<React.Fragment key="last">{separator}</React.Fragment>);
    }
    return joinedNodes;
}
