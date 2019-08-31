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

import { Matrix4, Object3D } from 'three';
import { PlayerPhysics } from '../../game/player-physics';
import { degToRad } from '../../math/float';
import { Matrix3D } from '../../math/matrix3d';
import { Table } from '../table/table';
import { BumperData } from './bumper-data';
import { BumperMeshGenerator } from './bumper-mesh-generator';
import { BumperState } from './bumper-state';
import { Player } from '../../game/player';

export class BumperMeshUpdater {

	private readonly data: BumperData;
	private readonly state: BumperState;
	private readonly meshGenerator: BumperMeshGenerator;

	constructor(data: BumperData, state: BumperState, meshGenerator: BumperMeshGenerator) {
		this.data = data;
		this.state = state;
		this.meshGenerator = meshGenerator;
	}

	public applyState(obj: Object3D, table: Table, player: Player, oldState: BumperState): void {

		if (this.data.isRingVisible && this.state.ringOffset !== oldState.ringOffset) {
			this.applyRingState(obj);
		}
		if (this.data.isSkirtVisible && (this.state.skirtRotX !== oldState.skirtRotX || this.state.skirtRotY !== oldState.skirtRotY)) {
			this.applySkirtState(obj, table);
		}
	}

	private applyRingState(obj: Object3D) {
		const ringObj = obj.children.find(o => o.name === `bumper-ring-${this.data.getName()}`) as Object3D;
		if (ringObj) {
			const matrix = new Matrix3D().setTranslation(0, 0, -this.state.ringOffset);
			ringObj.matrix = new Matrix4();
			ringObj.applyMatrix(matrix.toThreeMatrix4());
		}
	}

	/* istanbul ignore next: this looks weird. test when sure it's the correct "animation" */
	private applySkirtState(obj: Object3D, table: Table) {
		const height = table.getSurfaceHeight(this.data.szSurface, this.data.vCenter.x, this.data.vCenter.y) * table.getScaleZ();
		const matToOrigin = new Matrix3D().setTranslation(-this.data.vCenter.x, -this.data.vCenter.y, -height);
		const matFromOrigin = new Matrix3D().setTranslation(this.data.vCenter.x, this.data.vCenter.y, height);
		const matRotX = new Matrix3D().rotateXMatrix(degToRad(this.state.skirtRotX));
		const matRotY = new Matrix3D().rotateYMatrix(degToRad(this.state.skirtRotY));

		const matrix = matToOrigin.multiply(matRotY).multiply(matRotX).multiply(matFromOrigin);

		const skirtObj = obj.children.find(o => o.name === `bumper-socket-${this.data.getName()}`) as any;
		if (skirtObj) {
			skirtObj.matrix = new Matrix4();
			skirtObj.applyMatrix(matrix.toThreeMatrix4());
		}
	}
}
