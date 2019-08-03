/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

import { Storage } from '../..';
import { BiffParser } from '../../io/biff-parser';
import { Vertex2D } from '../../math/vertex2d';
import { ItemData } from '../item-data';

export class BumperData extends ItemData {

	public vCenter!: Vertex2D;
	public radius: number = 1.0;
	public szCapMaterial?: string;
	public szRingMaterial?: string;
	public szBaseMaterial?: string;
	public szSkirtMaterial?: string;
	public TimerInterval?: number;
	public fTimerEnabled: boolean = false;
	public threshold: number = 1.0;
	public force?: number;
	public scatter?: number;
	public heightScale: number = 1.0;
	public ringSpeed: number = 0.5;
	public orientation: number = 0.0;
	public ringDropOffset: number = 0.0;
	public szSurface?: string;
	public wzName!: string;
	public fCapVisible: boolean = true;
	public fBaseVisible: boolean = true;
	public fRingVisible: boolean = true;
	public fSkirtVisible: boolean = true;
	public fHitEvent: boolean = true;
	public fCollidable: boolean = true;
	public fReflectionEnabled: boolean = true;

	public static async fromStorage(storage: Storage, itemName: string): Promise<BumperData> {
		const bumperData = new BumperData(itemName);
		await storage.streamFiltered(itemName, 4, BiffParser.stream(bumperData.fromTag.bind(bumperData)));
		return bumperData;
	}

	private constructor(itemName: string) {
		super(itemName);
	}

	public getName(): string {
		return this.wzName;
	}

	private async fromTag(buffer: Buffer, tag: string, offset: number, len: number): Promise<number> {
		switch (tag) {
			case 'VCEN': this.vCenter = Vertex2D.get(buffer); break;
			case 'RADI': this.radius = this.getFloat(buffer); break;
			case 'MATR': this.szCapMaterial = this.getString(buffer, len); break;
			case 'RIMA': this.szRingMaterial = this.getString(buffer, len); break;
			case 'BAMA': this.szBaseMaterial = this.getString(buffer, len); break;
			case 'SKMA': this.szSkirtMaterial = this.getString(buffer, len); break;
			case 'THRS': this.threshold = this.getFloat(buffer); break;
			case 'FORC': this.force = this.getFloat(buffer); break;
			case 'BSCT': this.scatter = this.getFloat(buffer); break;
			case 'HISC': this.heightScale = this.getFloat(buffer); break;
			case 'RISP': this.ringSpeed = this.getFloat(buffer); break;
			case 'ORIN': this.orientation = this.getFloat(buffer); break;
			case 'RDLI': this.ringDropOffset = this.getFloat(buffer); break;
			case 'SURF': this.szSurface = this.getString(buffer, len); break;
			case 'NAME': this.wzName = this.getWideString(buffer, len); break;
			/* istanbul ignore next: legacy */
			case 'BVIS':
				const isVisible = this.getBool(buffer);
				this.fCapVisible = isVisible;
				this.fBaseVisible = isVisible;
				this.fRingVisible = isVisible;
				this.fSkirtVisible = isVisible;
				break;
			case 'CAVI': this.fCapVisible = this.getBool(buffer); break;
			case 'HAHE': this.fHitEvent = this.getBool(buffer); break;
			case 'COLI': this.fCollidable = this.getBool(buffer); break;
			case 'BSVS':
				this.fBaseVisible = this.getBool(buffer);
				this.fRingVisible = this.fBaseVisible;
				this.fSkirtVisible = this.fBaseVisible;
				break;
			case 'RIVS': this.fRingVisible = this.getBool(buffer); break;
			case 'SKVS': this.fSkirtVisible = this.getBool(buffer); break;
			case 'REEN': this.fReflectionEnabled = this.getBool(buffer); break;
			default:
				this.getUnknownBlock(buffer, tag);
				break;
		}
		return 0;
	}
}