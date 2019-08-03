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

import { Table } from '../..';
import { triggerButtonMesh } from '../../../res/meshes/trigger-button-mesh';
import { triggerSimpleMesh } from '../../../res/meshes/trigger-simple-mesh';
import { triggerStarMesh } from '../../../res/meshes/trigger-star-mesh';
import { triggerDWireMesh } from '../../../res/meshes/trigger-wire-d-mesh';
import { degToRad, f4 } from '../../math/float';
import { Matrix3D } from '../../math/matrix3d';
import { Vertex3D } from '../../math/vertex3d';
import { logger } from '../../util/logger';
import { Mesh } from '../mesh';
import { Trigger } from './trigger';
import { TriggerData } from './trigger-data';

export class TriggerMeshGenerator {

	private readonly data: TriggerData;

	constructor(data: TriggerData) {
		this.data = data;
	}

	public getMesh(table: Table): Mesh {
		const baseHeight = table.getSurfaceHeight(this.data.szSurface, this.data.vCenter.x, this.data.vCenter.y) * table.getScaleZ();

		let zOffset = (this.data.shape === Trigger.ShapeTriggerButton) ? 5.0 : 0.0;
		if (this.data.shape === Trigger.ShapeTriggerWireC) {
			zOffset = -19.0;
		}

		const fullMatrix = new Matrix3D();
		if (this.data.shape === Trigger.ShapeTriggerWireB) {
			const tempMatrix = new Matrix3D();
			fullMatrix.rotateXMatrix(degToRad(-23.0));
			tempMatrix.rotateZMatrix(degToRad(this.data.rotation));
			fullMatrix.multiply(tempMatrix);

		} else if (this.data.shape === Trigger.ShapeTriggerWireC) {
			const tempMatrix = new Matrix3D();
			fullMatrix.rotateXMatrix(degToRad(140.0));
			tempMatrix.rotateZMatrix(degToRad(this.data.rotation));
			fullMatrix.multiply(tempMatrix);

		} else {
			fullMatrix.rotateZMatrix(degToRad(this.data.rotation));
		}

		const mesh = this.getBaseMesh();
		for (const vertex of mesh.vertices) {

			let vert = new Vertex3D(vertex.x, vertex.y, vertex.z);
			vert = fullMatrix.multiplyVector(vert);

			if (this.data.shape === Trigger.ShapeTriggerButton || this.data.shape === Trigger.ShapeTriggerStar) {
				vertex.x = f4(vert.x * this.data.radius) + this.data.vCenter.x;
				vertex.y = f4(vert.y * this.data.radius) + this.data.vCenter.y;
				vertex.z = f4(f4(f4(vert.z * this.data.radius) * table.getScaleZ()) + baseHeight) + zOffset;
			} else {
				vertex.x = f4(vert.x * this.data.scaleX) + this.data.vCenter.x;
				vertex.y = f4(vert.y * this.data.scaleY) + this.data.vCenter.y;
				vertex.z = f4(f4(vert.z * table.getScaleZ()) + baseHeight) + zOffset;
			}

			vert = new Vertex3D(vertex.nx, vertex.ny, vertex.nz);
			vert = fullMatrix.multiplyVectorNoTranslate(vert);
			vertex.nx = vert.x;
			vertex.ny = vert.y;
			vertex.nz = vert.z;
		}
		return mesh;
	}

	private getBaseMesh(): Mesh {
		const name = `trigger-${this.data.getName()}`;
		switch (this.data.shape) {
			case Trigger.ShapeTriggerWireA:
			case Trigger.ShapeTriggerWireB:
			case Trigger.ShapeTriggerWireC:
				return triggerSimpleMesh.clone(name);
			case Trigger.ShapeTriggerWireD:
				return triggerDWireMesh.clone(name);
			case Trigger.ShapeTriggerButton:
				return triggerButtonMesh.clone(name);
			case Trigger.ShapeTriggerStar:
				return triggerStarMesh.clone(name);
			/* istanbul ignore next */
			default:
				logger().warn('[TriggerItem.getBaseMesh] Unknown shape "%s".', this.data.shape);
				return triggerSimpleMesh.clone(name);
		}
	}
}