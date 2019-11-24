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

import * as chai from 'chai';
import { expect } from 'chai';
import { Player, Table } from '..';
import { TableBuilder } from '../../test/table-builder';
import { getObject } from './objects';
import { ERR } from './stdlib/err';
import { VbsArray } from './vbs-array';

/* tslint:disable:no-unused-expression no-string-literal */
chai.use(require('sinon-chai'));
describe('The VBScript array', () => {

	before(() => {
		ERR.OnErrorResumeNext();
	});

	after(() => {
		ERR.OnErrorGoto0();
	});

	it('should initialize correctly', () => {
		const arr = new VbsArray<number | string>([1, 'two', 3]);
		expect(arr[0]).to.equal(1);
		expect(arr[1]).to.equal('two');
		expect(arr[2]).to.equal(3);
	});

});
