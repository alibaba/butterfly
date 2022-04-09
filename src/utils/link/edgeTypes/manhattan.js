import _ from 'lodash';
import { _calcOrientation, _route, LEFT, RIGHT, TOP, BOTTOM, DEFAULT_RADIUS, Point } from './_utils.js';


const getDefaultPath = (pointArr) => {
    return pointArr.reduce((path, point) => {
        path.push([
            'L',
            point.x,
            point.y
        ].join(' '));
        return path;
    }, [
        [
            'M',
            pointArr[0].x,
            pointArr[0].y
        ].join(' ')
    ]).join(' ');
};


// 获得靠近end的点
const getThatPoint = (start, end, radius) => {
    let p = new Point();

    ['x', 'y'].forEach(key => {
        if (start[key] > end[key]) {
            p[key] = end[key] + radius;
        } else if (start[key] < end[key]) {
            p[key] = end[key] - radius;
        } else {
            p[key] = start[key];
        }
    });

    return p;
};

const getDrawPoint = (start, control, end, radius) => {
    let p1 = getThatPoint(start, control, radius);
    let p2 = getThatPoint(end, control, radius);
    let flag = 0;
    let center = new Point(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2
    );

    // 逆时针
    if (control.y < center.y) {
        flag = 1;
    } else {
        flag = 0;
    }
    if (start["x"] > end["x"]) {
        flag = flag === 1 ? 0 : 1
    }

    return [start, p1, p2, flag];
};
//获取圆角路径
/*function getRadiusPath(pointArr) {
    let path = ""
    let radius = DEFAULT_RADIUS;
    const [start, c1, c2] = pointArr;
    const end = pointArr[pointArr.length - 1]
    console.log(pointArr)
    if (Math.abs(start.y - end.y) < 2 * DEFAULT_RADIUS) {
        radius = Math.abs(start.y - end.y) / 2;
    }

    if (
        _.first(pointArr).x === _.last(pointArr).x ||
        _.first(pointArr).y === _.last(pointArr).y
    ) {
        path = [
            'M', _.first(pointArr).x, _.first(pointArr).y,
            'L', _.last(pointArr).x, _.last(pointArr).y
        ].join(' ');
        return {
            path,
            breakPoints: pointArr
        };
    }

    if (_.first(pointArr).x > _.last(pointArr).x) {
        pointArr = pointArr.reverse();
    }
    const arc1 = getDrawPoint(start, c1, c2, radius);
    const arc2 = getDrawPoint(c1, c2, end, radius);

    path = [
        'M', arc1[0].x, arc1[0].y,
        'L', arc1[1].x, arc1[1].y,
        'A', radius, radius, 90, 0, arc1[3], arc1[2].x, arc1[2].y,
        'L', arc2[1].x, arc2[1].y,
        'M', arc2[1].x, arc2[1].y,
        'A', radius, radius, 90, 0, arc2[3], arc2[2].x, arc2[2].y,
        'L', end.x, end.y,
    ].join(' ');
    return {
        path,
        breakPoints: pointArr
    };
}*/

function getRadiusPath(pointArr) {
    let path = ""
    let radius = DEFAULT_RADIUS;
    const [start, c1, c2] = pointArr;
    const end = pointArr[pointArr.length - 1]
    if (Math.abs(start.y - end.y) < 2 * DEFAULT_RADIUS) {
        radius = Math.abs(start.y - end.y) / 2;
    }

    if (
        _.first(pointArr).x === _.last(pointArr).x ||
        _.first(pointArr).y === _.last(pointArr).y
    ) {
        path = [
            'M', _.first(pointArr).x, _.first(pointArr).y,
            'L', _.last(pointArr).x, _.last(pointArr).y
        ].join(' ');
        return {
            path,
            breakPoints: pointArr
        };
    }

    if (_.first(pointArr).x > _.last(pointArr).x) {
        //pointArr = pointArr.reverse();
    }
    let arc = []
    for (let i = 0; i < pointArr.length - 2; i++) {
        arc = [...arc, getDrawPoint(pointArr[i], pointArr[i + 1], pointArr[i + 2], radius)]
    }

    arc.forEach((e, index) => {
        if (index % 2 == 0) {
            if (index === 2) {
                path = path + " " + [
                    'L', e[1].x, e[1].y,
                    'M', e[1].x, e[1].y,
                    'A', radius, radius, 90, 0, e[3], e[2].x, e[2].y
                ].join(" ")
            } else {
                path = path + " " + [
                    'M', e[0].x, e[0].y,
                    'L', e[1].x, e[1].y,
                    'A', radius, radius, 90, 0, e[3], e[2].x, e[2].y
                ].join(" ")
            }

        } else {
            path = path + " " + [
                'L', e[1].x, e[1].y,
                'M', e[1].x, e[1].y,
                'A', radius, radius, 90, 0, e[3], e[2].x, e[2].y
            ].join(" ")
        }

    })
    path = path + ['L', end.x, end.y].join(" ")
        /* const arc1 = getDrawPoint(start, c1, c2, radius);
         const arc2 = getDrawPoint(c1, c2, end, radius);

         path = [
             'M', arc1[0].x, arc1[0].y,
             'L', arc1[1].x, arc1[1].y,
             'A', radius, radius, 90, 0, arc1[3], arc1[2].x, arc1[2].y,
             'L', arc2[1].x, arc2[1].y,
             'M', arc2[1].x, arc2[1].y,
             'A', radius, radius, 90, 0, arc2[3], arc2[2].x, arc2[2].y,
             'L', end.x, end.y,
         ].join(' ');*/
    return {
        path,
        breakPoints: pointArr
    };
}

function drawManhattan(sourcePoint, targetPoint, opts) {
    if (!sourcePoint.orientation) {
        sourcePoint.orientation = _calcOrientation(targetPoint.pos[0], targetPoint.pos[1], sourcePoint.pos[0], sourcePoint.pos[1]);
    }

    if (!targetPoint.orientation) {
        targetPoint.orientation = _calcOrientation(sourcePoint.pos[0], sourcePoint.pos[1], targetPoint.pos[0], targetPoint.pos[1]);
    }

    let pointArr = [];
    const fromPt = {
        x: sourcePoint.pos[0],
        y: sourcePoint.pos[1],
    };
    const toPt = {
        x: targetPoint.pos[0],
        y: targetPoint.pos[1],
    };
    const orientation = {
        '-10': LEFT,
        10: RIGHT,
        '0-1': TOP,
        '01': BOTTOM,
    };
    let path = ""
        // link:connect 中 orientation = undefined
    _route(pointArr, fromPt, orientation[sourcePoint.orientation.join('')], toPt, orientation[targetPoint.orientation.join('')]);
    if (pointArr.length < 2) return '';
    if (pointArr.length === 2) {
        path = `M ${pointArr[0].x} ${pointArr[0].y} L ${pointArr[1].x} ${pointArr[1].y}`;
        return {
            path,
            breakPoints: pointArr
        };
    }



    pointArr.pop();

    // 非圆角情况下直接返回
    console.log(opts)
    if (opts.hasRadius) {
        if (pointArr.length < 4) {
            return {
                path: getDefaultPath(pointArr),
                breakPoints: pointArr
            };
        }

        return getRadiusPath(pointArr)
    } else {
        return {
            path: getDefaultPath(pointArr),
            breakPoints: pointArr
        };
    }

}

export default drawManhattan;