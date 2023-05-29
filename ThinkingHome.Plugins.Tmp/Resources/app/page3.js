/******/ var __webpack_modules__ = ({

/***/ "./node_modules/fp-ts/es6/Applicative.js":
/*!***********************************************!*\
  !*** ./node_modules/fp-ts/es6/Applicative.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getApplicativeComposition: () => (/* binding */ getApplicativeComposition),
/* harmony export */   getApplicativeMonoid: () => (/* binding */ getApplicativeMonoid)
/* harmony export */ });
/* harmony import */ var _Apply__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Apply */ "./node_modules/fp-ts/es6/Apply.js");
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./function */ "./node_modules/fp-ts/es6/function.js");
/* harmony import */ var _Functor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Functor */ "./node_modules/fp-ts/es6/Functor.js");
/**
 * The `Applicative` type class extends the `Apply` type class with a `of` function, which can be used to create values
 * of type `f a` from values of type `a`.
 *
 * Where `Apply` provides the ability to lift functions of two or more arguments to functions whose arguments are
 * wrapped using `f`, and `Functor` provides the ability to lift functions of one argument, `pure` can be seen as the
 * function which lifts functions of _zero_ arguments. That is, `Applicative` functors support a lifting operation for
 * any number of function arguments.
 *
 * Instances must satisfy the following laws in addition to the `Apply` laws:
 *
 * 1. Identity: `A.ap(A.of(a => a), fa) <-> fa`
 * 2. Homomorphism: `A.ap(A.of(ab), A.of(a)) <-> A.of(ab(a))`
 * 3. Interchange: `A.ap(fab, A.of(a)) <-> A.ap(A.of(ab => ab(a)), fab)`
 *
 * Note. `Functor`'s `map` can be derived: `A.map(x, f) = A.ap(A.of(f), x)`
 *
 * @since 2.0.0
 */



function getApplicativeMonoid(F) {
    var f = (0,_Apply__WEBPACK_IMPORTED_MODULE_0__.getApplySemigroup)(F);
    return function (M) { return ({
        concat: f(M).concat,
        empty: F.of(M.empty)
    }); };
}
/** @deprecated */
function getApplicativeComposition(F, G) {
    var map = (0,_Functor__WEBPACK_IMPORTED_MODULE_1__.getFunctorComposition)(F, G).map;
    var _ap = (0,_Apply__WEBPACK_IMPORTED_MODULE_0__.ap)(F, G);
    return {
        map: map,
        of: function (a) { return F.of(G.of(a)); },
        ap: function (fgab, fga) { return (0,_function__WEBPACK_IMPORTED_MODULE_2__.pipe)(fgab, _ap(fga)); }
    };
}


/***/ }),

/***/ "./node_modules/fp-ts/es6/Apply.js":
/*!*****************************************!*\
  !*** ./node_modules/fp-ts/es6/Apply.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ap: () => (/* binding */ ap),
/* harmony export */   apFirst: () => (/* binding */ apFirst),
/* harmony export */   apS: () => (/* binding */ apS),
/* harmony export */   apSecond: () => (/* binding */ apSecond),
/* harmony export */   getApplySemigroup: () => (/* binding */ getApplySemigroup),
/* harmony export */   sequenceS: () => (/* binding */ sequenceS),
/* harmony export */   sequenceT: () => (/* binding */ sequenceT)
/* harmony export */ });
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./function */ "./node_modules/fp-ts/es6/function.js");
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./internal */ "./node_modules/fp-ts/es6/internal.js");
/**
 * The `Apply` class provides the `ap` which is used to apply a function to an argument under a type constructor.
 *
 * `Apply` can be used to lift functions of two or more arguments to work on values wrapped with the type constructor
 * `f`.
 *
 * Instances must satisfy the following law in addition to the `Functor` laws:
 *
 * 1. Associative composition: `F.ap(F.ap(F.map(fbc, bc => ab => a => bc(ab(a))), fab), fa) <-> F.ap(fbc, F.ap(fab, fa))`
 *
 * Formally, `Apply` represents a strong lax semi-monoidal endofunctor.
 *
 * @example
 * import * as O from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * const f = (a: string) => (b: number) => (c: boolean) => a + String(b) + String(c)
 * const fa: O.Option<string> = O.some('s')
 * const fb: O.Option<number> = O.some(1)
 * const fc: O.Option<boolean> = O.some(true)
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     // lift a function
 *     O.some(f),
 *     // apply the first argument
 *     O.ap(fa),
 *     // apply the second argument
 *     O.ap(fb),
 *     // apply the third argument
 *     O.ap(fc)
 *   ),
 *   O.some('s1true')
 * )
 *
 * @since 2.0.0
 */


function ap(F, G) {
    return function (fa) {
        return function (fab) {
            return F.ap(F.map(fab, function (gab) { return function (ga) { return G.ap(gab, ga); }; }), fa);
        };
    };
}
function apFirst(A) {
    return function (second) { return function (first) {
        return A.ap(A.map(first, function (a) { return function () { return a; }; }), second);
    }; };
}
function apSecond(A) {
    return function (second) {
        return function (first) {
            return A.ap(A.map(first, function () { return function (b) { return b; }; }), second);
        };
    };
}
function apS(F) {
    return function (name, fb) {
        return function (fa) {
            return F.ap(F.map(fa, function (a) { return function (b) {
                var _a;
                return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
            }; }), fb);
        };
    };
}
function getApplySemigroup(F) {
    return function (S) { return ({
        concat: function (first, second) {
            return F.ap(F.map(first, function (x) { return function (y) { return S.concat(x, y); }; }), second);
        }
    }); };
}
function curried(f, n, acc) {
    return function (x) {
        var combined = Array(acc.length + 1);
        for (var i = 0; i < acc.length; i++) {
            combined[i] = acc[i];
        }
        combined[acc.length] = x;
        return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined);
    };
}
var tupleConstructors = {
    1: function (a) { return [a]; },
    2: function (a) { return function (b) { return [a, b]; }; },
    3: function (a) { return function (b) { return function (c) { return [a, b, c]; }; }; },
    4: function (a) { return function (b) { return function (c) { return function (d) { return [a, b, c, d]; }; }; }; },
    5: function (a) { return function (b) { return function (c) { return function (d) { return function (e) { return [a, b, c, d, e]; }; }; }; }; }
};
function getTupleConstructor(len) {
    if (!_internal__WEBPACK_IMPORTED_MODULE_0__.has.call(tupleConstructors, len)) {
        tupleConstructors[len] = curried(_function__WEBPACK_IMPORTED_MODULE_1__.tuple, len - 1, []);
    }
    return tupleConstructors[len];
}
function sequenceT(F) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var f = getTupleConstructor(len);
        var fas = F.map(args[0], f);
        for (var i = 1; i < len; i++) {
            fas = F.ap(fas, args[i]);
        }
        return fas;
    };
}
function getRecordConstructor(keys) {
    var len = keys.length;
    switch (len) {
        case 1:
            return function (a) {
                var _a;
                return (_a = {}, _a[keys[0]] = a, _a);
            };
        case 2:
            return function (a) { return function (b) {
                var _a;
                return (_a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a);
            }; };
        case 3:
            return function (a) { return function (b) { return function (c) {
                var _a;
                return (_a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a[keys[2]] = c, _a);
            }; }; };
        case 4:
            return function (a) { return function (b) { return function (c) { return function (d) {
                var _a;
                return (_a = {},
                    _a[keys[0]] = a,
                    _a[keys[1]] = b,
                    _a[keys[2]] = c,
                    _a[keys[3]] = d,
                    _a);
            }; }; }; };
        case 5:
            return function (a) { return function (b) { return function (c) { return function (d) { return function (e) {
                var _a;
                return (_a = {},
                    _a[keys[0]] = a,
                    _a[keys[1]] = b,
                    _a[keys[2]] = c,
                    _a[keys[3]] = d,
                    _a[keys[4]] = e,
                    _a);
            }; }; }; }; };
        default:
            return curried(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var r = {};
                for (var i = 0; i < len; i++) {
                    r[keys[i]] = args[i];
                }
                return r;
            }, len - 1, []);
    }
}
function sequenceS(F) {
    return function (r) {
        var keys = Object.keys(r);
        var len = keys.length;
        var f = getRecordConstructor(keys);
        var fr = F.map(r[keys[0]], f);
        for (var i = 1; i < len; i++) {
            fr = F.ap(fr, r[keys[i]]);
        }
        return fr;
    };
}


/***/ }),

/***/ "./node_modules/fp-ts/es6/Chain.js":
/*!*****************************************!*\
  !*** ./node_modules/fp-ts/es6/Chain.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bind: () => (/* binding */ bind),
/* harmony export */   chainFirst: () => (/* binding */ chainFirst)
/* harmony export */ });
function chainFirst(M) {
    return function (f) { return function (first) { return M.chain(first, function (a) { return M.map(f(a), function () { return a; }); }); }; };
}
function bind(M) {
    return function (name, f) { return function (ma) { return M.chain(ma, function (a) { return M.map(f(a), function (b) {
        var _a;
        return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
    }); }); }; };
}


/***/ }),

/***/ "./node_modules/fp-ts/es6/ChainRec.js":
/*!********************************************!*\
  !*** ./node_modules/fp-ts/es6/ChainRec.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tailRec: () => (/* binding */ tailRec)
/* harmony export */ });
/**
 * @since 2.0.0
 */
var tailRec = function (startWith, f) {
    var ab = f(startWith);
    while (ab._tag === 'Left') {
        ab = f(ab.left);
    }
    return ab.right;
};


/***/ }),

/***/ "./node_modules/fp-ts/es6/Either.js":
/*!******************************************!*\
  !*** ./node_modules/fp-ts/es6/Either.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alt: () => (/* binding */ Alt),
/* harmony export */   ApT: () => (/* binding */ ApT),
/* harmony export */   Applicative: () => (/* binding */ Applicative),
/* harmony export */   Apply: () => (/* binding */ Apply),
/* harmony export */   Bifunctor: () => (/* binding */ Bifunctor),
/* harmony export */   Chain: () => (/* binding */ Chain),
/* harmony export */   ChainRec: () => (/* binding */ ChainRec),
/* harmony export */   Do: () => (/* binding */ Do),
/* harmony export */   Extend: () => (/* binding */ Extend),
/* harmony export */   Foldable: () => (/* binding */ Foldable),
/* harmony export */   FromEither: () => (/* binding */ FromEither),
/* harmony export */   Functor: () => (/* binding */ Functor),
/* harmony export */   Monad: () => (/* binding */ Monad),
/* harmony export */   MonadThrow: () => (/* binding */ MonadThrow),
/* harmony export */   Pointed: () => (/* binding */ Pointed),
/* harmony export */   Traversable: () => (/* binding */ Traversable),
/* harmony export */   URI: () => (/* binding */ URI),
/* harmony export */   alt: () => (/* binding */ alt),
/* harmony export */   altW: () => (/* binding */ altW),
/* harmony export */   ap: () => (/* binding */ ap),
/* harmony export */   apFirst: () => (/* binding */ apFirst),
/* harmony export */   apFirstW: () => (/* binding */ apFirstW),
/* harmony export */   apS: () => (/* binding */ apS),
/* harmony export */   apSW: () => (/* binding */ apSW),
/* harmony export */   apSecond: () => (/* binding */ apSecond),
/* harmony export */   apSecondW: () => (/* binding */ apSecondW),
/* harmony export */   apW: () => (/* binding */ apW),
/* harmony export */   bimap: () => (/* binding */ bimap),
/* harmony export */   bind: () => (/* binding */ bind),
/* harmony export */   bindTo: () => (/* binding */ bindTo),
/* harmony export */   bindW: () => (/* binding */ bindW),
/* harmony export */   chain: () => (/* binding */ chain),
/* harmony export */   chainFirst: () => (/* binding */ chainFirst),
/* harmony export */   chainFirstW: () => (/* binding */ chainFirstW),
/* harmony export */   chainNullableK: () => (/* binding */ chainNullableK),
/* harmony export */   chainOptionK: () => (/* binding */ chainOptionK),
/* harmony export */   chainOptionKW: () => (/* binding */ chainOptionKW),
/* harmony export */   chainW: () => (/* binding */ chainW),
/* harmony export */   duplicate: () => (/* binding */ duplicate),
/* harmony export */   either: () => (/* binding */ either),
/* harmony export */   elem: () => (/* binding */ elem),
/* harmony export */   exists: () => (/* binding */ exists),
/* harmony export */   extend: () => (/* binding */ extend),
/* harmony export */   filterOrElse: () => (/* binding */ filterOrElse),
/* harmony export */   filterOrElseW: () => (/* binding */ filterOrElseW),
/* harmony export */   flap: () => (/* binding */ flap),
/* harmony export */   flatMap: () => (/* binding */ flatMap),
/* harmony export */   flatten: () => (/* binding */ flatten),
/* harmony export */   flattenW: () => (/* binding */ flattenW),
/* harmony export */   fold: () => (/* binding */ fold),
/* harmony export */   foldMap: () => (/* binding */ foldMap),
/* harmony export */   foldW: () => (/* binding */ foldW),
/* harmony export */   fromNullable: () => (/* binding */ fromNullable),
/* harmony export */   fromNullableK: () => (/* binding */ fromNullableK),
/* harmony export */   fromOption: () => (/* binding */ fromOption),
/* harmony export */   fromOptionK: () => (/* binding */ fromOptionK),
/* harmony export */   fromPredicate: () => (/* binding */ fromPredicate),
/* harmony export */   getAltValidation: () => (/* binding */ getAltValidation),
/* harmony export */   getApplicativeValidation: () => (/* binding */ getApplicativeValidation),
/* harmony export */   getApplyMonoid: () => (/* binding */ getApplyMonoid),
/* harmony export */   getApplySemigroup: () => (/* binding */ getApplySemigroup),
/* harmony export */   getCompactable: () => (/* binding */ getCompactable),
/* harmony export */   getEq: () => (/* binding */ getEq),
/* harmony export */   getFilterable: () => (/* binding */ getFilterable),
/* harmony export */   getOrElse: () => (/* binding */ getOrElse),
/* harmony export */   getOrElseW: () => (/* binding */ getOrElseW),
/* harmony export */   getSemigroup: () => (/* binding */ getSemigroup),
/* harmony export */   getShow: () => (/* binding */ getShow),
/* harmony export */   getValidation: () => (/* binding */ getValidation),
/* harmony export */   getValidationMonoid: () => (/* binding */ getValidationMonoid),
/* harmony export */   getValidationSemigroup: () => (/* binding */ getValidationSemigroup),
/* harmony export */   getWitherable: () => (/* binding */ getWitherable),
/* harmony export */   isLeft: () => (/* binding */ isLeft),
/* harmony export */   isRight: () => (/* binding */ isRight),
/* harmony export */   left: () => (/* binding */ left),
/* harmony export */   "let": () => (/* binding */ let_),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   mapLeft: () => (/* binding */ mapLeft),
/* harmony export */   match: () => (/* binding */ match),
/* harmony export */   matchW: () => (/* binding */ matchW),
/* harmony export */   of: () => (/* binding */ of),
/* harmony export */   orElse: () => (/* binding */ orElse),
/* harmony export */   orElseW: () => (/* binding */ orElseW),
/* harmony export */   parseJSON: () => (/* binding */ parseJSON),
/* harmony export */   reduce: () => (/* binding */ reduce),
/* harmony export */   reduceRight: () => (/* binding */ reduceRight),
/* harmony export */   right: () => (/* binding */ right),
/* harmony export */   sequence: () => (/* binding */ sequence),
/* harmony export */   sequenceArray: () => (/* binding */ sequenceArray),
/* harmony export */   stringifyJSON: () => (/* binding */ stringifyJSON),
/* harmony export */   swap: () => (/* binding */ swap),
/* harmony export */   throwError: () => (/* binding */ throwError),
/* harmony export */   toError: () => (/* binding */ toError),
/* harmony export */   toUnion: () => (/* binding */ toUnion),
/* harmony export */   traverse: () => (/* binding */ traverse),
/* harmony export */   traverseArray: () => (/* binding */ traverseArray),
/* harmony export */   traverseArrayWithIndex: () => (/* binding */ traverseArrayWithIndex),
/* harmony export */   traverseReadonlyArrayWithIndex: () => (/* binding */ traverseReadonlyArrayWithIndex),
/* harmony export */   traverseReadonlyNonEmptyArrayWithIndex: () => (/* binding */ traverseReadonlyNonEmptyArrayWithIndex),
/* harmony export */   tryCatch: () => (/* binding */ tryCatch),
/* harmony export */   tryCatchK: () => (/* binding */ tryCatchK)
/* harmony export */ });
/* harmony import */ var _Applicative__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Applicative */ "./node_modules/fp-ts/es6/Applicative.js");
/* harmony import */ var _Apply__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Apply */ "./node_modules/fp-ts/es6/Apply.js");
/* harmony import */ var _Chain__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Chain */ "./node_modules/fp-ts/es6/Chain.js");
/* harmony import */ var _ChainRec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChainRec */ "./node_modules/fp-ts/es6/ChainRec.js");
/* harmony import */ var _FromEither__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FromEither */ "./node_modules/fp-ts/es6/FromEither.js");
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./function */ "./node_modules/fp-ts/es6/function.js");
/* harmony import */ var _Functor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Functor */ "./node_modules/fp-ts/es6/Functor.js");
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./internal */ "./node_modules/fp-ts/es6/internal.js");
/* harmony import */ var _Separated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Separated */ "./node_modules/fp-ts/es6/Separated.js");
/* harmony import */ var _Witherable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Witherable */ "./node_modules/fp-ts/es6/Witherable.js");










// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 2.0.0
 */
var left = _internal__WEBPACK_IMPORTED_MODULE_0__.left;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 2.0.0
 */
var right = _internal__WEBPACK_IMPORTED_MODULE_0__.right;
/**
 * @category sequencing
 * @since 2.14.0
 */
var flatMap = /*#__PURE__*/ (0,_function__WEBPACK_IMPORTED_MODULE_1__.dual)(2, function (ma, f) { return (isLeft(ma) ? ma : f(ma.right)); });
var _map = function (fa, f) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.pipe)(fa, map(f)); };
var _ap = function (fab, fa) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.pipe)(fab, ap(fa)); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.pipe)(fa, reduce(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) { return function (fa, f) {
    var foldMapM = foldMap(M);
    return (0,_function__WEBPACK_IMPORTED_MODULE_1__.pipe)(fa, foldMapM(f));
}; };
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.pipe)(fa, reduceRight(b, f)); };
var _traverse = function (F) {
    var traverseF = traverse(F);
    return function (ta, f) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.pipe)(ta, traverseF(f)); };
};
var _bimap = function (fa, f, g) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.pipe)(fa, bimap(f, g)); };
var _mapLeft = function (fa, f) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.pipe)(fa, mapLeft(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.pipe)(fa, alt(that)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.pipe)(wa, extend(f)); };
var _chainRec = function (a, f) {
    return (0,_ChainRec__WEBPACK_IMPORTED_MODULE_2__.tailRec)(f(a), function (e) {
        return isLeft(e) ? right(left(e.left)) : isLeft(e.right) ? left(f(e.right.left)) : right(right(e.right.right));
    });
};
/**
 * @category type lambdas
 * @since 2.0.0
 */
var URI = 'Either';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow = function (SE, SA) { return ({
    show: function (ma) { return (isLeft(ma) ? "left(".concat(SE.show(ma.left), ")") : "right(".concat(SA.show(ma.right), ")")); }
}); };
/**
 * @category instances
 * @since 2.0.0
 */
var getEq = function (EL, EA) { return ({
    equals: function (x, y) {
        return x === y || (isLeft(x) ? isLeft(y) && EL.equals(x.left, y.left) : isRight(y) && EA.equals(x.right, y.right));
    }
}); };
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/Either'
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * const S = getSemigroup<string, number>(SemigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 * @category instances
 * @since 2.0.0
 */
var getSemigroup = function (S) { return ({
    concat: function (x, y) { return (isLeft(y) ? x : isLeft(x) ? y : right(S.concat(x.right, y.right))); }
}); };
/**
 * Builds a `Compactable` instance for `Either` given `Monoid` for the left side.
 *
 * @category filtering
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var empty = left(M.empty);
    return {
        URI: URI,
        _E: undefined,
        compact: function (ma) { return (isLeft(ma) ? ma : ma.right._tag === 'None' ? empty : right(ma.right.value)); },
        separate: function (ma) {
            return isLeft(ma)
                ? (0,_Separated__WEBPACK_IMPORTED_MODULE_3__.separated)(ma, ma)
                : isLeft(ma.right)
                    ? (0,_Separated__WEBPACK_IMPORTED_MODULE_3__.separated)(right(ma.right.left), empty)
                    : (0,_Separated__WEBPACK_IMPORTED_MODULE_3__.separated)(empty, right(ma.right.right));
        }
    };
};
/**
 * Builds a `Filterable` instance for `Either` given `Monoid` for the left side
 *
 * @category filtering
 * @since 2.10.0
 */
var getFilterable = function (M) {
    var empty = left(M.empty);
    var _a = getCompactable(M), compact = _a.compact, separate = _a.separate;
    var filter = function (ma, predicate) {
        return isLeft(ma) ? ma : predicate(ma.right) ? ma : empty;
    };
    var partition = function (ma, p) {
        return isLeft(ma)
            ? (0,_Separated__WEBPACK_IMPORTED_MODULE_3__.separated)(ma, ma)
            : p(ma.right)
                ? (0,_Separated__WEBPACK_IMPORTED_MODULE_3__.separated)(empty, right(ma.right))
                : (0,_Separated__WEBPACK_IMPORTED_MODULE_3__.separated)(right(ma.right), empty);
    };
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        compact: compact,
        separate: separate,
        filter: filter,
        filterMap: function (ma, f) {
            if (isLeft(ma)) {
                return ma;
            }
            var ob = f(ma.right);
            return ob._tag === 'None' ? empty : right(ob.value);
        },
        partition: partition,
        partitionMap: function (ma, f) {
            if (isLeft(ma)) {
                return (0,_Separated__WEBPACK_IMPORTED_MODULE_3__.separated)(ma, ma);
            }
            var e = f(ma.right);
            return isLeft(e) ? (0,_Separated__WEBPACK_IMPORTED_MODULE_3__.separated)(right(e.left), empty) : (0,_Separated__WEBPACK_IMPORTED_MODULE_3__.separated)(empty, right(e.right));
        }
    };
};
/**
 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
 *
 * @category filtering
 * @since 2.0.0
 */
var getWitherable = function (M) {
    var F_ = getFilterable(M);
    var C = getCompactable(M);
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        compact: F_.compact,
        separate: F_.separate,
        filter: F_.filter,
        filterMap: F_.filterMap,
        partition: F_.partition,
        partitionMap: F_.partitionMap,
        traverse: _traverse,
        sequence: sequence,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        wither: (0,_Witherable__WEBPACK_IMPORTED_MODULE_4__.witherDefault)(Traversable, C),
        wilt: (0,_Witherable__WEBPACK_IMPORTED_MODULE_4__.wiltDefault)(Traversable, C)
    };
};
/**
 * The default [`Applicative`](#applicative) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as A from 'fp-ts/Apply'
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 *
 * const parseString = (u: unknown): E.Either<string, string> =>
 *   typeof u === 'string' ? E.right(u) : E.left('not a string')
 *
 * const parseNumber = (u: unknown): E.Either<string, number> =>
 *   typeof u === 'number' ? E.right(u) : E.left('not a number')
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 *
 * const parsePerson = (
 *   input: Record<string, unknown>
 * ): E.Either<string, Person> =>
 *   pipe(
 *     E.Do,
 *     E.apS('name', parseString(input.name)),
 *     E.apS('age', parseNumber(input.age))
 *   )
 *
 * assert.deepStrictEqual(parsePerson({}), E.left('not a string')) // <= first error
 *
 * const Applicative = E.getApplicativeValidation(
 *   pipe(string.Semigroup, S.intercalate(', '))
 * )
 *
 * const apS = A.apS(Applicative)
 *
 * const parsePersonAll = (
 *   input: Record<string, unknown>
 * ): E.Either<string, Person> =>
 *   pipe(
 *     E.Do,
 *     apS('name', parseString(input.name)),
 *     apS('age', parseNumber(input.age))
 *   )
 *
 * assert.deepStrictEqual(parsePersonAll({}), E.left('not a string, not a number')) // <= all errors
 *
 * @category error handling
 * @since 2.7.0
 */
var getApplicativeValidation = function (SE) { return ({
    URI: URI,
    _E: undefined,
    map: _map,
    ap: function (fab, fa) {
        return isLeft(fab)
            ? isLeft(fa)
                ? left(SE.concat(fab.left, fa.left))
                : fab
            : isLeft(fa)
                ? fa
                : right(fab.right(fa.right));
    },
    of: of
}); };
/**
 * The default [`Alt`](#alt) instance returns the last error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 *
 * const parseString = (u: unknown): E.Either<string, string> =>
 *   typeof u === 'string' ? E.right(u) : E.left('not a string')
 *
 * const parseNumber = (u: unknown): E.Either<string, number> =>
 *   typeof u === 'number' ? E.right(u) : E.left('not a number')
 *
 * const parse = (u: unknown): E.Either<string, string | number> =>
 *   pipe(
 *     parseString(u),
 *     E.alt<string, string | number>(() => parseNumber(u))
 *   )
 *
 * assert.deepStrictEqual(parse(true), E.left('not a number')) // <= last error
 *
 * const Alt = E.getAltValidation(pipe(string.Semigroup, S.intercalate(', ')))
 *
 * const parseAll = (u: unknown): E.Either<string, string | number> =>
 *   Alt.alt<string | number>(parseString(u), () => parseNumber(u))
 *
 * assert.deepStrictEqual(parseAll(true), E.left('not a string, not a number')) // <= all errors
 *
 * @category error handling
 * @since 2.7.0
 */
var getAltValidation = function (SE) { return ({
    URI: URI,
    _E: undefined,
    map: _map,
    alt: function (me, that) {
        if (isRight(me)) {
            return me;
        }
        var ea = that();
        return isLeft(ea) ? left(SE.concat(me.left, ea.left)) : ea;
    }
}); };
/**
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return function (fa) {
    return isLeft(fa) ? fa : right(f(fa.right));
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Functor = {
    URI: URI,
    map: _map
};
/**
 * @category constructors
 * @since 2.7.0
 */
var of = right;
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed = {
    URI: URI,
    of: of
};
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.8.0
 */
var apW = function (fa) { return function (fab) {
    return isLeft(fab) ? fab : isLeft(fa) ? fa : right(fab.right(fa.right));
}; };
/**
 * @since 2.0.0
 */
var ap = apW;
/**
 * @category instances
 * @since 2.10.0
 */
var Apply = {
    URI: URI,
    map: _map,
    ap: _ap
};
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of
};
/**
 * Alias of `flatMap`.
 *
 * @category sequencing
 * @since 2.6.0
 */
var chainW = flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category sequencing
 * @since 2.0.0
 */
var chain = flatMap;
/**
 * @category instances
 * @since 2.10.0
 */
var Chain = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.7.0
 */
var Monad = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: flatMap
};
/**
 * Left-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'prefix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduce(startWith, concat)),
 *   'prefix:a'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduce(startWith, concat)),
 *   'prefix'
 * )
 *
 * @category folding
 * @since 2.0.0
 */
var reduce = function (b, f) { return function (fa) {
    return isLeft(fa) ? b : f(b, fa.right);
}; };
/**
 * Map each element of the structure to a monoid, and combine the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as S from 'fp-ts/string'
 *
 * const yell = (a: string) => `${a}!`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.foldMap(S.Monoid)(yell)),
 *   'a!'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.foldMap(S.Monoid)(yell)),
 *   S.Monoid.empty
 * )
 *
 * @category folding
 * @since 2.0.0
 */
var foldMap = function (M) { return function (f) { return function (fa) {
    return isLeft(fa) ? M.empty : f(fa.right);
}; }; };
/**
 * Right-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'postfix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduceRight(startWith, concat)),
 *   'a:postfix'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduceRight(startWith, concat)),
 *   'postfix'
 * )
 *
 * @category folding
 * @since 2.0.0
 */
var reduceRight = function (b, f) { return function (fa) {
    return isLeft(fa) ? b : f(fa.right, b);
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable = {
    URI: URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(['a']), E.traverse(O.Applicative)(RA.head)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right([]), E.traverse(O.Applicative)(RA.head)),
 *   O.none
 * )
 *
 * @category traversing
 * @since 2.6.3
 */
var traverse = function (F) {
    return function (f) {
        return function (ta) {
            return isLeft(ta) ? F.of(left(ta.left)) : F.map(f(ta.right), right);
        };
    };
};
/**
 * Evaluate each monadic action in the structure from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.some('a')), E.sequence(O.Applicative)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.none), E.sequence(O.Applicative)),
 *   O.none
 * )
 *
 * @category traversing
 * @since 2.6.3
 */
var sequence = function (F) {
    return function (ma) {
        return isLeft(ma) ? F.of(left(ma.left)) : F.map(ma.right, right);
    };
};
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable = {
    URI: URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence
};
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
var bimap = function (f, g) { return function (fa) {
    return isLeft(fa) ? left(f(fa.left)) : right(g(fa.right));
}; };
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
var mapLeft = function (f) { return function (fa) {
    return isLeft(fa) ? left(f(fa.left)) : fa;
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Bifunctor = {
    URI: URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
var altW = function (that) { return function (fa) {
    return isLeft(fa) ? that() : fa;
}; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `Either` returns the left-most non-`Left` value (or the right-most `Left` value if both values are `Left`).
 *
 * | x        | y        | pipe(x, alt(() => y) |
 * | -------- | -------- | -------------------- |
 * | left(a)  | left(b)  | left(b)              |
 * | left(a)  | right(2) | right(2)             |
 * | right(1) | left(b)  | right(1)             |
 * | right(1) | right(2) | right(1)             |
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.alt(() => E.left('b'))
 *   ),
 *   E.left('b')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.alt(() => E.right(2))
 *   ),
 *   E.right(2)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.alt(() => E.left('b'))
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.alt(() => E.right(2))
 *   ),
 *   E.right(1)
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
var alt = altW;
/**
 * @category instances
 * @since 2.7.0
 */
var Alt = {
    URI: URI,
    map: _map,
    alt: _alt
};
/**
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) {
    return isLeft(wa) ? wa : right(f(wa));
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Extend = {
    URI: URI,
    map: _map,
    extend: _extend
};
/**
 * @category instances
 * @since 2.7.0
 */
var ChainRec = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: flatMap,
    chainRec: _chainRec
};
/**
 * @since 2.6.3
 */
var throwError = left;
/**
 * @category instances
 * @since 2.7.0
 */
var MonadThrow = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: flatMap,
    throwError: throwError
};
/**
 * @category instances
 * @since 2.10.0
 */
var FromEither = {
    URI: URI,
    fromEither: _function__WEBPACK_IMPORTED_MODULE_1__.identity
};
/**
 * @example
 * import { fromPredicate, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     -1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   left('error')
 * )
 *
 * @category lifting
 * @since 2.0.0
 */
var fromPredicate = /*#__PURE__*/ (0,_FromEither__WEBPACK_IMPORTED_MODULE_5__.fromPredicate)(FromEither);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some(1),
 *     E.fromOption(() => 'error')
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     E.fromOption(() => 'error')
 *   ),
 *   E.left('error')
 * )
 *
 * @category conversions
 * @since 2.0.0
 */
var fromOption = 
/*#__PURE__*/ (0,_FromEither__WEBPACK_IMPORTED_MODULE_5__.fromOption)(FromEither);
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
var isLeft = _internal__WEBPACK_IMPORTED_MODULE_0__.isLeft;
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
var isRight = _internal__WEBPACK_IMPORTED_MODULE_0__.isRight;
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
var matchW = function (onLeft, onRight) {
    return function (ma) {
        return isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
    };
};
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
var foldW = matchW;
/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import { match, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * function onLeft(errors: Array<string>): string {
 *   return `Errors: ${errors.join(', ')}`
 * }
 *
 * function onRight(value: number): string {
 *   return `Ok: ${value}`
 * }
 *
 * assert.strictEqual(
 *   pipe(
 *     right(1),
 *     match(onLeft, onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     left(['error 1', 'error 2']),
 *     match(onLeft, onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category pattern matching
 * @since 2.10.0
 */
var match = matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.0.0
 */
var fold = match;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
var getOrElseW = function (onLeft) {
    return function (ma) {
        return isLeft(ma) ? onLeft(ma.left) : ma.right;
    };
};
/**
 * Returns the wrapped value if it's a `Right` or a default value if is a `Left`.
 *
 * @example
 * import { getOrElse, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     right(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     left('error'),
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
var getOrElse = getOrElseW;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category mapping
 * @since 2.10.0
 */
var flap = /*#__PURE__*/ (0,_Functor__WEBPACK_IMPORTED_MODULE_6__.flap)(Functor);
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
var apFirst = /*#__PURE__*/ (0,_Apply__WEBPACK_IMPORTED_MODULE_7__.apFirst)(Apply);
/**
 * Less strict version of [`apFirst`](#apfirst)
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
var apFirstW = apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
var apSecond = /*#__PURE__*/ (0,_Apply__WEBPACK_IMPORTED_MODULE_7__.apSecond)(Apply);
/**
 * Less strict version of [`apSecond`](#apsecond)
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
var apSecondW = apSecond;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category sequencing
 * @since 2.0.0
 */
var chainFirst = 
/*#__PURE__*/ (0,_Chain__WEBPACK_IMPORTED_MODULE_8__.chainFirst)(Chain);
/**
 * Less strict version of [`chainFirst`](#chainfirst)
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.8.0
 */
var chainFirstW = chainFirst;
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
var flattenW = 
/*#__PURE__*/ chainW(_function__WEBPACK_IMPORTED_MODULE_1__.identity);
/**
 * The `flatten` function is the conventional monad join operator. It is used to remove one level of monadic structure, projecting its bound argument into the outer level.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(E.flatten(E.right(E.right('a'))), E.right('a'))
 * assert.deepStrictEqual(E.flatten(E.right(E.left('e'))), E.left('e'))
 * assert.deepStrictEqual(E.flatten(E.left('e')), E.left('e'))
 *
 * @category sequencing
 * @since 2.0.0
 */
var flatten = flattenW;
/**
 * @since 2.0.0
 */
var duplicate = /*#__PURE__*/ extend(_function__WEBPACK_IMPORTED_MODULE_1__.identity);
/**
 * @category lifting
 * @since 2.10.0
 */
var fromOptionK = 
/*#__PURE__*/ (0,_FromEither__WEBPACK_IMPORTED_MODULE_5__.fromOptionK)(FromEither);
/**
 * @category sequencing
 * @since 2.11.0
 */
var chainOptionK = /*#__PURE__*/ (0,_FromEither__WEBPACK_IMPORTED_MODULE_5__.chainOptionK)(FromEither, Chain);
/**
 * Less strict version of [`chainOptionK`](#chainoptionk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.13.2
 */
var chainOptionKW = /*#__PURE__*/ chainOptionK;
/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(-1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('error')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('a')
 * )
 *
 * @category filtering
 * @since 2.0.0
 */
var filterOrElse = /*#__PURE__*/ (0,_FromEither__WEBPACK_IMPORTED_MODULE_5__.filterOrElse)(FromEither, Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category filtering
 * @since 2.9.0
 */
var filterOrElseW = filterOrElse;
/**
 * Returns a `Right` if is a `Left` (and vice versa).
 *
 * @since 2.0.0
 */
var swap = function (ma) { return (isLeft(ma) ? right(ma.left) : left(ma.right)); };
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
var orElseW = function (onLeft) {
    return function (ma) {
        return isLeft(ma) ? onLeft(ma.left) : ma;
    };
};
/**
 * Useful for recovering from errors.
 *
 * @category error handling
 * @since 2.0.0
 */
var orElse = orElseW;
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`.
 *
 * @example
 * import { fromNullable, left, right } from 'fp-ts/Either'
 *
 * const parse = fromNullable('nully')
 *
 * assert.deepStrictEqual(parse(1), right(1))
 * assert.deepStrictEqual(parse(null), left('nully'))
 *
 * @category conversions
 * @since 2.0.0
 */
var fromNullable = function (e) {
    return function (a) {
        return a == null ? left(e) : right(a);
    };
};
/**
 * Constructs a new `Either` from a function that might throw.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * const unsafeHead = <A>(as: ReadonlyArray<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: ReadonlyArray<A>): E.Either<Error, A> =>
 *   E.tryCatch(() => unsafeHead(as), e => (e instanceof Error ? e : new Error('unknown error')))
 *
 * assert.deepStrictEqual(head([]), E.left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), E.right(1))
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onThrow) {
    try {
        return right(f());
    }
    catch (e) {
        return left(onThrow(e));
    }
};
/**
 * Converts a function that may throw to one returning a `Either`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK = function (f, onThrow) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return tryCatch(function () { return f.apply(void 0, a); }, onThrow);
    };
};
/**
 * @category lifting
 * @since 2.9.0
 */
var fromNullableK = function (e) {
    var from = fromNullable(e);
    return function (f) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.flow)(f, from); };
};
/**
 * @category sequencing
 * @since 2.9.0
 */
var chainNullableK = function (e) {
    var from = fromNullableK(e);
    return function (f) { return chain(from(f)); };
};
/**
 * @category conversions
 * @since 2.10.0
 */
var toUnion = /*#__PURE__*/ foldW(_function__WEBPACK_IMPORTED_MODULE_1__.identity, _function__WEBPACK_IMPORTED_MODULE_1__.identity);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Default value for the `onError` argument of `tryCatch`
 *
 * @since 2.0.0
 */
function toError(e) {
    return e instanceof Error ? e : new Error(String(e));
}
function elem(E) {
    return function (a, ma) {
        if (ma === undefined) {
            var elemE_1 = elem(E);
            return function (ma) { return elemE_1(a, ma); };
        }
        return isLeft(ma) ? false : E.equals(a, ma.right);
    };
}
/**
 * Returns `false` if `Left` or returns the result of the application of the given predicate to the `Right` value.
 *
 * @example
 * import { exists, left, right } from 'fp-ts/Either'
 *
 * const gt2 = exists((n: number) => n > 2)
 *
 * assert.strictEqual(gt2(left('a')), false)
 * assert.strictEqual(gt2(right(1)), false)
 * assert.strictEqual(gt2(right(3)), true)
 *
 * @since 2.0.0
 */
var exists = function (predicate) {
    return function (ma) {
        return isLeft(ma) ? false : predicate(ma.right);
    };
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
var Do = /*#__PURE__*/ of(_internal__WEBPACK_IMPORTED_MODULE_0__.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
var bindTo = /*#__PURE__*/ (0,_Functor__WEBPACK_IMPORTED_MODULE_6__.bindTo)(Functor);
var let_ = /*#__PURE__*/ (0,_Functor__WEBPACK_IMPORTED_MODULE_6__["let"])(Functor);

/**
 * @category do notation
 * @since 2.8.0
 */
var bind = /*#__PURE__*/ (0,_Chain__WEBPACK_IMPORTED_MODULE_8__.bind)(Chain);
/**
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
var bindW = bind;
/**
 * @category do notation
 * @since 2.8.0
 */
var apS = /*#__PURE__*/ (0,_Apply__WEBPACK_IMPORTED_MODULE_7__.apS)(Apply);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
var apSW = apS;
/**
 * @since 2.11.0
 */
var ApT = /*#__PURE__*/ of(_internal__WEBPACK_IMPORTED_MODULE_0__.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return function (as) {
        var e = f(0, _internal__WEBPACK_IMPORTED_MODULE_0__.head(as));
        if (isLeft(e)) {
            return e;
        }
        var out = [e.right];
        for (var i = 1; i < as.length; i++) {
            var e_1 = f(i, as[i]);
            if (isLeft(e_1)) {
                return e_1;
            }
            out.push(e_1.right);
        }
        return right(out);
    };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_internal__WEBPACK_IMPORTED_MODULE_0__.isNonEmpty(as) ? g(as) : ApT); };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseArray = function (f) { return traverseReadonlyArrayWithIndex(function (_, a) { return f(a); }); };
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var sequenceArray = 
/*#__PURE__*/ traverseArray(_function__WEBPACK_IMPORTED_MODULE_1__.identity);
/**
 * Use [`parse`](./Json.ts.html#parse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
function parseJSON(s, onError) {
    return tryCatch(function () { return JSON.parse(s); }, onError);
}
/**
 * Use [`stringify`](./Json.ts.html#stringify) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var stringifyJSON = function (u, onError) {
    return tryCatch(function () {
        var s = JSON.stringify(u);
        if (typeof s !== 'string') {
            throw new Error('Converting unsupported structure to JSON');
        }
        return s;
    }, onError);
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `E.Functor` instead of `E.either`
 * (where `E` is from `import E from 'fp-ts/Either'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var either = {
    URI: URI,
    map: _map,
    of: of,
    ap: _ap,
    chain: flatMap,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
    extend: _extend,
    chainRec: _chainRec,
    throwError: throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getApplySemigroup = 
/*#__PURE__*/ (0,_Apply__WEBPACK_IMPORTED_MODULE_7__.getApplySemigroup)(Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getApplyMonoid = 
/*#__PURE__*/ (0,_Applicative__WEBPACK_IMPORTED_MODULE_9__.getApplicativeMonoid)(Applicative);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getValidationSemigroup = function (SE, SA) {
    return (0,_Apply__WEBPACK_IMPORTED_MODULE_7__.getApplySemigroup)(getApplicativeValidation(SE))(SA);
};
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getValidationMonoid = function (SE, MA) {
    return (0,_Applicative__WEBPACK_IMPORTED_MODULE_9__.getApplicativeMonoid)(getApplicativeValidation(SE))(MA);
};
/**
 * Use [`getApplicativeValidation`](#getapplicativevalidation) and [`getAltValidation`](#getaltvalidation) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
function getValidation(SE) {
    var ap = getApplicativeValidation(SE).ap;
    var alt = getAltValidation(SE).alt;
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        of: of,
        chain: flatMap,
        bimap: _bimap,
        mapLeft: _mapLeft,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        extend: _extend,
        traverse: _traverse,
        sequence: sequence,
        chainRec: _chainRec,
        throwError: throwError,
        ap: ap,
        alt: alt
    };
}


/***/ }),

/***/ "./node_modules/fp-ts/es6/FromEither.js":
/*!**********************************************!*\
  !*** ./node_modules/fp-ts/es6/FromEither.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   chainEitherK: () => (/* binding */ chainEitherK),
/* harmony export */   chainFirstEitherK: () => (/* binding */ chainFirstEitherK),
/* harmony export */   chainOptionK: () => (/* binding */ chainOptionK),
/* harmony export */   filterOrElse: () => (/* binding */ filterOrElse),
/* harmony export */   fromEitherK: () => (/* binding */ fromEitherK),
/* harmony export */   fromOption: () => (/* binding */ fromOption),
/* harmony export */   fromOptionK: () => (/* binding */ fromOptionK),
/* harmony export */   fromPredicate: () => (/* binding */ fromPredicate)
/* harmony export */ });
/* harmony import */ var _Chain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Chain */ "./node_modules/fp-ts/es6/Chain.js");
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./function */ "./node_modules/fp-ts/es6/function.js");
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./internal */ "./node_modules/fp-ts/es6/internal.js");
/**
 * The `FromEither` type class represents those data types which support errors.
 *
 * @since 2.10.0
 */



function fromOption(F) {
    return function (onNone) { return function (ma) { return F.fromEither(_internal__WEBPACK_IMPORTED_MODULE_0__.isNone(ma) ? _internal__WEBPACK_IMPORTED_MODULE_0__.left(onNone()) : _internal__WEBPACK_IMPORTED_MODULE_0__.right(ma.value)); }; };
}
function fromPredicate(F) {
    return function (predicate, onFalse) {
        return function (a) {
            return F.fromEither(predicate(a) ? _internal__WEBPACK_IMPORTED_MODULE_0__.right(a) : _internal__WEBPACK_IMPORTED_MODULE_0__.left(onFalse(a)));
        };
    };
}
function fromOptionK(F) {
    var fromOptionF = fromOption(F);
    return function (onNone) {
        var from = fromOptionF(onNone);
        return function (f) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.flow)(f, from); };
    };
}
function chainOptionK(F, M) {
    var fromOptionKF = fromOptionK(F);
    return function (onNone) {
        var from = fromOptionKF(onNone);
        return function (f) { return function (ma) { return M.chain(ma, from(f)); }; };
    };
}
function fromEitherK(F) {
    return function (f) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.flow)(f, F.fromEither); };
}
function chainEitherK(F, M) {
    var fromEitherKF = fromEitherK(F);
    return function (f) { return function (ma) { return M.chain(ma, fromEitherKF(f)); }; };
}
function chainFirstEitherK(F, M) {
    return (0,_function__WEBPACK_IMPORTED_MODULE_1__.flow)(fromEitherK(F), (0,_Chain__WEBPACK_IMPORTED_MODULE_2__.chainFirst)(M));
}
function filterOrElse(F, M) {
    return function (predicate, onFalse) {
        return function (ma) {
            return M.chain(ma, function (a) { return F.fromEither(predicate(a) ? _internal__WEBPACK_IMPORTED_MODULE_0__.right(a) : _internal__WEBPACK_IMPORTED_MODULE_0__.left(onFalse(a))); });
        };
    };
}


/***/ }),

/***/ "./node_modules/fp-ts/es6/Functor.js":
/*!*******************************************!*\
  !*** ./node_modules/fp-ts/es6/Functor.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindTo: () => (/* binding */ bindTo),
/* harmony export */   flap: () => (/* binding */ flap),
/* harmony export */   getFunctorComposition: () => (/* binding */ getFunctorComposition),
/* harmony export */   "let": () => (/* binding */ let_),
/* harmony export */   map: () => (/* binding */ map)
/* harmony export */ });
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./function */ "./node_modules/fp-ts/es6/function.js");
/**
 * A `Functor` is a type constructor which supports a mapping operation `map`.
 *
 * `map` can be used to turn functions `a -> b` into functions `f a -> f b` whose argument and return types use the type
 * constructor `f` to represent some computational context.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Identity: `F.map(fa, a => a) <-> fa`
 * 2. Composition: `F.map(fa, a => bc(ab(a))) <-> F.map(F.map(fa, ab), bc)`
 *
 * @since 2.0.0
 */

function map(F, G) {
    return function (f) { return function (fa) { return F.map(fa, function (ga) { return G.map(ga, f); }); }; };
}
function flap(F) {
    return function (a) { return function (fab) { return F.map(fab, function (f) { return f(a); }); }; };
}
function bindTo(F) {
    return function (name) { return function (fa) { return F.map(fa, function (a) {
        var _a;
        return (_a = {}, _a[name] = a, _a);
    }); }; };
}
function let_(F) {
    return function (name, f) { return function (fa) { return F.map(fa, function (a) {
        var _a;
        return Object.assign({}, a, (_a = {}, _a[name] = f(a), _a));
    }); }; };
}

/** @deprecated */
function getFunctorComposition(F, G) {
    var _map = map(F, G);
    return {
        map: function (fga, f) { return (0,_function__WEBPACK_IMPORTED_MODULE_0__.pipe)(fga, _map(f)); }
    };
}


/***/ }),

/***/ "./node_modules/fp-ts/es6/Separated.js":
/*!*********************************************!*\
  !*** ./node_modules/fp-ts/es6/Separated.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bifunctor: () => (/* binding */ Bifunctor),
/* harmony export */   Functor: () => (/* binding */ Functor),
/* harmony export */   URI: () => (/* binding */ URI),
/* harmony export */   bimap: () => (/* binding */ bimap),
/* harmony export */   flap: () => (/* binding */ flap),
/* harmony export */   left: () => (/* binding */ left),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   mapLeft: () => (/* binding */ mapLeft),
/* harmony export */   right: () => (/* binding */ right),
/* harmony export */   separated: () => (/* binding */ separated)
/* harmony export */ });
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./function */ "./node_modules/fp-ts/es6/function.js");
/* harmony import */ var _Functor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Functor */ "./node_modules/fp-ts/es6/Functor.js");
/**
 * ```ts
 * interface Separated<E, A> {
 *    readonly left: E
 *    readonly right: A
 * }
 * ```
 *
 * Represents a result of separating a whole into two parts.
 *
 * @since 2.10.0
 */


// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.10.0
 */
var separated = function (left, right) { return ({ left: left, right: right }); };
var _map = function (fa, f) { return (0,_function__WEBPACK_IMPORTED_MODULE_0__.pipe)(fa, map(f)); };
var _mapLeft = function (fa, f) { return (0,_function__WEBPACK_IMPORTED_MODULE_0__.pipe)(fa, mapLeft(f)); };
var _bimap = function (fa, g, f) { return (0,_function__WEBPACK_IMPORTED_MODULE_0__.pipe)(fa, bimap(g, f)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.10.0
 */
var map = function (f) {
    return function (fa) {
        return separated(left(fa), f(right(fa)));
    };
};
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.10.0
 */
var mapLeft = function (f) {
    return function (fa) {
        return separated(f(left(fa)), right(fa));
    };
};
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.10.0
 */
var bimap = function (f, g) {
    return function (fa) {
        return separated(f(left(fa)), g(right(fa)));
    };
};
/**
 * @category type lambdas
 * @since 2.10.0
 */
var URI = 'Separated';
/**
 * @category instances
 * @since 2.10.0
 */
var Bifunctor = {
    URI: URI,
    mapLeft: _mapLeft,
    bimap: _bimap
};
/**
 * @category instances
 * @since 2.10.0
 */
var Functor = {
    URI: URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
var flap = /*#__PURE__*/ (0,_Functor__WEBPACK_IMPORTED_MODULE_1__.flap)(Functor);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
var left = function (s) { return s.left; };
/**
 * @since 2.10.0
 */
var right = function (s) { return s.right; };


/***/ }),

/***/ "./node_modules/fp-ts/es6/Witherable.js":
/*!**********************************************!*\
  !*** ./node_modules/fp-ts/es6/Witherable.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   filterE: () => (/* binding */ filterE),
/* harmony export */   wiltDefault: () => (/* binding */ wiltDefault),
/* harmony export */   witherDefault: () => (/* binding */ witherDefault)
/* harmony export */ });
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./internal */ "./node_modules/fp-ts/es6/internal.js");

function wiltDefault(T, C) {
    return function (F) {
        var traverseF = T.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), C.separate); };
    };
}
function witherDefault(T, C) {
    return function (F) {
        var traverseF = T.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), C.compact); };
    };
}
function filterE(W) {
    return function (F) {
        var witherF = W.wither(F);
        return function (predicate) { return function (ga) { return witherF(ga, function (a) { return F.map(predicate(a), function (b) { return (b ? _internal__WEBPACK_IMPORTED_MODULE_0__.some(a) : _internal__WEBPACK_IMPORTED_MODULE_0__.none); }); }); }; };
    };
}


/***/ }),

/***/ "./node_modules/fp-ts/es6/function.js":
/*!********************************************!*\
  !*** ./node_modules/fp-ts/es6/function.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SK: () => (/* binding */ SK),
/* harmony export */   absurd: () => (/* binding */ absurd),
/* harmony export */   apply: () => (/* binding */ apply),
/* harmony export */   constFalse: () => (/* binding */ constFalse),
/* harmony export */   constNull: () => (/* binding */ constNull),
/* harmony export */   constTrue: () => (/* binding */ constTrue),
/* harmony export */   constUndefined: () => (/* binding */ constUndefined),
/* harmony export */   constVoid: () => (/* binding */ constVoid),
/* harmony export */   constant: () => (/* binding */ constant),
/* harmony export */   decrement: () => (/* binding */ decrement),
/* harmony export */   dual: () => (/* binding */ dual),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   flow: () => (/* binding */ flow),
/* harmony export */   getBooleanAlgebra: () => (/* binding */ getBooleanAlgebra),
/* harmony export */   getEndomorphismMonoid: () => (/* binding */ getEndomorphismMonoid),
/* harmony export */   getMonoid: () => (/* binding */ getMonoid),
/* harmony export */   getRing: () => (/* binding */ getRing),
/* harmony export */   getSemigroup: () => (/* binding */ getSemigroup),
/* harmony export */   getSemiring: () => (/* binding */ getSemiring),
/* harmony export */   hole: () => (/* binding */ hole),
/* harmony export */   identity: () => (/* binding */ identity),
/* harmony export */   increment: () => (/* binding */ increment),
/* harmony export */   not: () => (/* binding */ not),
/* harmony export */   pipe: () => (/* binding */ pipe),
/* harmony export */   tuple: () => (/* binding */ tuple),
/* harmony export */   tupled: () => (/* binding */ tupled),
/* harmony export */   unsafeCoerce: () => (/* binding */ unsafeCoerce),
/* harmony export */   untupled: () => (/* binding */ untupled)
/* harmony export */ });
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
var getBooleanAlgebra = function (B) {
    return function () { return ({
        meet: function (x, y) { return function (a) { return B.meet(x(a), y(a)); }; },
        join: function (x, y) { return function (a) { return B.join(x(a), y(a)); }; },
        zero: function () { return B.zero; },
        one: function () { return B.one; },
        implies: function (x, y) { return function (a) { return B.implies(x(a), y(a)); }; },
        not: function (x) { return function (a) { return B.not(x(a)); }; }
    }); };
};
/**
 * Unary functions form a semigroup as long as you can provide a semigroup for the codomain.
 *
 * @example
 * import { Predicate, getSemigroup } from 'fp-ts/function'
 * import * as B from 'fp-ts/boolean'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const S1 = getSemigroup(B.SemigroupAll)<number>()
 *
 * assert.deepStrictEqual(S1.concat(f, g)(1), true)
 * assert.deepStrictEqual(S1.concat(f, g)(3), false)
 *
 * const S2 = getSemigroup(B.SemigroupAny)<number>()
 *
 * assert.deepStrictEqual(S2.concat(f, g)(1), true)
 * assert.deepStrictEqual(S2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.10.0
 */
var getSemigroup = function (S) {
    return function () { return ({
        concat: function (f, g) { return function (a) { return S.concat(f(a), g(a)); }; }
    }); };
};
/**
 * Unary functions form a monoid as long as you can provide a monoid for the codomain.
 *
 * @example
 * import { Predicate } from 'fp-ts/Predicate'
 * import { getMonoid } from 'fp-ts/function'
 * import * as B from 'fp-ts/boolean'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const M1 = getMonoid(B.MonoidAll)<number>()
 *
 * assert.deepStrictEqual(M1.concat(f, g)(1), true)
 * assert.deepStrictEqual(M1.concat(f, g)(3), false)
 *
 * const M2 = getMonoid(B.MonoidAny)<number>()
 *
 * assert.deepStrictEqual(M2.concat(f, g)(1), true)
 * assert.deepStrictEqual(M2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.10.0
 */
var getMonoid = function (M) {
    var getSemigroupM = getSemigroup(M);
    return function () { return ({
        concat: getSemigroupM().concat,
        empty: function () { return M.empty; }
    }); };
};
/**
 * @category instances
 * @since 2.10.0
 */
var getSemiring = function (S) { return ({
    add: function (f, g) { return function (x) { return S.add(f(x), g(x)); }; },
    zero: function () { return S.zero; },
    mul: function (f, g) { return function (x) { return S.mul(f(x), g(x)); }; },
    one: function () { return S.one; }
}); };
/**
 * @category instances
 * @since 2.10.0
 */
var getRing = function (R) {
    var S = getSemiring(R);
    return {
        add: S.add,
        mul: S.mul,
        one: S.one,
        zero: S.zero,
        sub: function (f, g) { return function (x) { return R.sub(f(x), g(x)); }; }
    };
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var apply = function (a) {
    return function (f) {
        return f(a);
    };
};
/**
 * @since 2.0.0
 */
function identity(a) {
    return a;
}
/**
 * @since 2.0.0
 */
var unsafeCoerce = identity;
/**
 * @since 2.0.0
 */
function constant(a) {
    return function () { return a; };
}
/**
 * A thunk that returns always `true`.
 *
 * @since 2.0.0
 */
var constTrue = /*#__PURE__*/ constant(true);
/**
 * A thunk that returns always `false`.
 *
 * @since 2.0.0
 */
var constFalse = /*#__PURE__*/ constant(false);
/**
 * A thunk that returns always `null`.
 *
 * @since 2.0.0
 */
var constNull = /*#__PURE__*/ constant(null);
/**
 * A thunk that returns always `undefined`.
 *
 * @since 2.0.0
 */
var constUndefined = /*#__PURE__*/ constant(undefined);
/**
 * A thunk that returns always `void`.
 *
 * @since 2.0.0
 */
var constVoid = constUndefined;
function flip(f) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length > 1) {
            return f(args[1], args[0]);
        }
        return function (a) { return f(a)(args[0]); };
    };
}
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
        case 1:
            return ab;
        case 2:
            return function () {
                return bc(ab.apply(this, arguments));
            };
        case 3:
            return function () {
                return cd(bc(ab.apply(this, arguments)));
            };
        case 4:
            return function () {
                return de(cd(bc(ab.apply(this, arguments))));
            };
        case 5:
            return function () {
                return ef(de(cd(bc(ab.apply(this, arguments)))));
            };
        case 6:
            return function () {
                return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
            };
        case 7:
            return function () {
                return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
            };
        case 8:
            return function () {
                return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
            };
        case 9:
            return function () {
                return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
            };
    }
    return;
}
/**
 * @since 2.0.0
 */
function tuple() {
    var t = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        t[_i] = arguments[_i];
    }
    return t;
}
/**
 * @since 2.0.0
 */
function increment(n) {
    return n + 1;
}
/**
 * @since 2.0.0
 */
function decrement(n) {
    return n - 1;
}
/**
 * @since 2.0.0
 */
function absurd(_) {
    throw new Error('Called `absurd` function which should be uncallable');
}
/**
 * Creates a tupled version of this function: instead of `n` arguments, it accepts a single tuple argument.
 *
 * @example
 * import { tupled } from 'fp-ts/function'
 *
 * const add = tupled((x: number, y: number): number => x + y)
 *
 * assert.strictEqual(add([1, 2]), 3)
 *
 * @since 2.4.0
 */
function tupled(f) {
    return function (a) { return f.apply(void 0, a); };
}
/**
 * Inverse function of `tupled`
 *
 * @since 2.4.0
 */
function untupled(f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return f(a);
    };
}
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
    switch (arguments.length) {
        case 1:
            return a;
        case 2:
            return ab(a);
        case 3:
            return bc(ab(a));
        case 4:
            return cd(bc(ab(a)));
        case 5:
            return de(cd(bc(ab(a))));
        case 6:
            return ef(de(cd(bc(ab(a)))));
        case 7:
            return fg(ef(de(cd(bc(ab(a))))));
        case 8:
            return gh(fg(ef(de(cd(bc(ab(a)))))));
        case 9:
            return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
        default: {
            var ret = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                ret = arguments[i](ret);
            }
            return ret;
        }
    }
}
/**
 * Type hole simulation
 *
 * @since 2.7.0
 */
var hole = absurd;
/**
 * @since 2.11.0
 */
var SK = function (_, b) { return b; };
/**
 * Use `Predicate` module instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
function not(predicate) {
    return function (a) { return !predicate(a); };
}
/**
 * Use `Endomorphism` module instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
var getEndomorphismMonoid = function () { return ({
    concat: function (first, second) { return flow(first, second); },
    empty: identity
}); };
/** @internal */
var dual = function (arity, body) {
    var isDataFirst = typeof arity === 'number' ? function (args) { return args.length >= arity; } : arity;
    return function () {
        var args = Array.from(arguments);
        if (isDataFirst(arguments)) {
            return body.apply(this, args);
        }
        return function (self) { return body.apply(void 0, __spreadArray([self], args, false)); };
    };
};


/***/ }),

/***/ "./node_modules/fp-ts/es6/internal.js":
/*!********************************************!*\
  !*** ./node_modules/fp-ts/es6/internal.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   emptyReadonlyArray: () => (/* binding */ emptyReadonlyArray),
/* harmony export */   emptyRecord: () => (/* binding */ emptyRecord),
/* harmony export */   fromReadonlyNonEmptyArray: () => (/* binding */ fromReadonlyNonEmptyArray),
/* harmony export */   has: () => (/* binding */ has),
/* harmony export */   head: () => (/* binding */ head),
/* harmony export */   isLeft: () => (/* binding */ isLeft),
/* harmony export */   isNonEmpty: () => (/* binding */ isNonEmpty),
/* harmony export */   isNone: () => (/* binding */ isNone),
/* harmony export */   isRight: () => (/* binding */ isRight),
/* harmony export */   isSome: () => (/* binding */ isSome),
/* harmony export */   left: () => (/* binding */ left),
/* harmony export */   none: () => (/* binding */ none),
/* harmony export */   right: () => (/* binding */ right),
/* harmony export */   singleton: () => (/* binding */ singleton),
/* harmony export */   some: () => (/* binding */ some),
/* harmony export */   tail: () => (/* binding */ tail)
/* harmony export */ });
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// -------------------------------------------------------------------------------------
// Option
// -------------------------------------------------------------------------------------
/** @internal */
var isNone = function (fa) { return fa._tag === 'None'; };
/** @internal */
var isSome = function (fa) { return fa._tag === 'Some'; };
/** @internal */
var none = { _tag: 'None' };
/** @internal */
var some = function (a) { return ({ _tag: 'Some', value: a }); };
// -------------------------------------------------------------------------------------
// Either
// -------------------------------------------------------------------------------------
/** @internal */
var isLeft = function (ma) { return ma._tag === 'Left'; };
/** @internal */
var isRight = function (ma) { return ma._tag === 'Right'; };
/** @internal */
var left = function (e) { return ({ _tag: 'Left', left: e }); };
/** @internal */
var right = function (a) { return ({ _tag: 'Right', right: a }); };
// -------------------------------------------------------------------------------------
// ReadonlyNonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
var singleton = function (a) { return [a]; };
/** @internal */
var isNonEmpty = function (as) { return as.length > 0; };
/** @internal */
var head = function (as) { return as[0]; };
/** @internal */
var tail = function (as) { return as.slice(1); };
// -------------------------------------------------------------------------------------
// empty
// -------------------------------------------------------------------------------------
/** @internal */
var emptyReadonlyArray = [];
/** @internal */
var emptyRecord = {};
// -------------------------------------------------------------------------------------
// Record
// -------------------------------------------------------------------------------------
/** @internal */
var has = Object.prototype.hasOwnProperty;
// -------------------------------------------------------------------------------------
// NonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
var fromReadonlyNonEmptyArray = function (as) { return __spreadArray([as[0]], as.slice(1), true); };


/***/ }),

/***/ "./node_modules/fp-ts/es6/pipeable.js":
/*!********************************************!*\
  !*** ./node_modules/fp-ts/es6/pipeable.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alt: () => (/* binding */ alt),
/* harmony export */   ap: () => (/* binding */ ap),
/* harmony export */   bimap: () => (/* binding */ bimap),
/* harmony export */   chain: () => (/* binding */ chain),
/* harmony export */   compose: () => (/* binding */ compose),
/* harmony export */   contramap: () => (/* binding */ contramap),
/* harmony export */   extend: () => (/* binding */ extend),
/* harmony export */   filter: () => (/* binding */ filter),
/* harmony export */   filterMap: () => (/* binding */ filterMap),
/* harmony export */   filterMapWithIndex: () => (/* binding */ filterMapWithIndex),
/* harmony export */   filterWithIndex: () => (/* binding */ filterWithIndex),
/* harmony export */   foldMap: () => (/* binding */ foldMap),
/* harmony export */   foldMapWithIndex: () => (/* binding */ foldMapWithIndex),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   mapLeft: () => (/* binding */ mapLeft),
/* harmony export */   mapWithIndex: () => (/* binding */ mapWithIndex),
/* harmony export */   partition: () => (/* binding */ partition),
/* harmony export */   partitionMap: () => (/* binding */ partitionMap),
/* harmony export */   partitionMapWithIndex: () => (/* binding */ partitionMapWithIndex),
/* harmony export */   partitionWithIndex: () => (/* binding */ partitionWithIndex),
/* harmony export */   pipe: () => (/* binding */ pipe),
/* harmony export */   pipeable: () => (/* binding */ pipeable),
/* harmony export */   promap: () => (/* binding */ promap),
/* harmony export */   reduce: () => (/* binding */ reduce),
/* harmony export */   reduceRight: () => (/* binding */ reduceRight),
/* harmony export */   reduceRightWithIndex: () => (/* binding */ reduceRightWithIndex),
/* harmony export */   reduceWithIndex: () => (/* binding */ reduceWithIndex)
/* harmony export */ });
/* harmony import */ var _Apply__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Apply */ "./node_modules/fp-ts/es6/Apply.js");
/* harmony import */ var _Chain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Chain */ "./node_modules/fp-ts/es6/Chain.js");
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./function */ "./node_modules/fp-ts/es6/function.js");



function map(F) {
    return function (f) { return function (fa) { return F.map(fa, f); }; };
}
function contramap(F) {
    return function (f) { return function (fa) { return F.contramap(fa, f); }; };
}
function mapWithIndex(F) {
    return function (f) { return function (fa) { return F.mapWithIndex(fa, f); }; };
}
function ap(F) {
    return function (fa) { return function (fab) { return F.ap(fab, fa); }; };
}
function chain(F) {
    return function (f) { return function (fa) { return F.chain(fa, f); }; };
}
function bimap(F) {
    return function (f, g) { return function (fea) { return F.bimap(fea, f, g); }; };
}
function mapLeft(F) {
    return function (f) { return function (fea) { return F.mapLeft(fea, f); }; };
}
function extend(F) {
    return function (f) { return function (wa) { return F.extend(wa, f); }; };
}
function reduce(F) {
    return function (b, f) { return function (fa) { return F.reduce(fa, b, f); }; };
}
function foldMap(F) {
    return function (M) {
        var foldMapM = F.foldMap(M);
        return function (f) { return function (fa) { return foldMapM(fa, f); }; };
    };
}
function reduceRight(F) {
    return function (b, f) { return function (fa) { return F.reduceRight(fa, b, f); }; };
}
function reduceWithIndex(F) {
    return function (b, f) { return function (fa) { return F.reduceWithIndex(fa, b, f); }; };
}
function foldMapWithIndex(F) {
    return function (M) {
        var foldMapWithIndexM = F.foldMapWithIndex(M);
        return function (f) { return function (fa) { return foldMapWithIndexM(fa, f); }; };
    };
}
function reduceRightWithIndex(F) {
    return function (b, f) { return function (fa) { return F.reduceRightWithIndex(fa, b, f); }; };
}
function alt(F) {
    return function (that) { return function (fa) { return F.alt(fa, that); }; };
}
function filter(F) {
    return function (predicate) { return function (fa) { return F.filter(fa, predicate); }; };
}
function filterMap(F) {
    return function (f) { return function (fa) { return F.filterMap(fa, f); }; };
}
function partition(F) {
    return function (f) { return function (fa) { return F.partition(fa, f); }; };
}
function partitionMap(F) {
    return function (f) { return function (fa) { return F.partitionMap(fa, f); }; };
}
function filterWithIndex(F) {
    return function (predicate) { return function (fa) { return F.filterWithIndex(fa, predicate); }; };
}
function filterMapWithIndex(F) {
    return function (f) { return function (fa) { return F.filterMapWithIndex(fa, f); }; };
}
function partitionWithIndex(F) {
    return function (f) { return function (fa) { return F.partitionWithIndex(fa, f); }; };
}
function partitionMapWithIndex(F) {
    return function (f) { return function (fa) { return F.partitionMapWithIndex(fa, f); }; };
}
function promap(F) {
    return function (f, g) { return function (fbc) { return F.promap(fbc, f, g); }; };
}
function compose(F) {
    return function (ea) { return function (ab) { return F.compose(ab, ea); }; };
}
var isFunctor = function (I) { return typeof I.map === 'function'; };
var isContravariant = function (I) { return typeof I.contramap === 'function'; };
var isFunctorWithIndex = function (I) { return typeof I.mapWithIndex === 'function'; };
var isApply = function (I) { return typeof I.ap === 'function'; };
var isChain = function (I) { return typeof I.chain === 'function'; };
var isBifunctor = function (I) { return typeof I.bimap === 'function'; };
var isExtend = function (I) { return typeof I.extend === 'function'; };
var isFoldable = function (I) { return typeof I.reduce === 'function'; };
var isFoldableWithIndex = function (I) { return typeof I.reduceWithIndex === 'function'; };
var isAlt = function (I) { return typeof I.alt === 'function'; };
var isCompactable = function (I) { return typeof I.compact === 'function'; };
var isFilterable = function (I) { return typeof I.filter === 'function'; };
var isFilterableWithIndex = function (I) {
    return typeof I.filterWithIndex === 'function';
};
var isProfunctor = function (I) { return typeof I.promap === 'function'; };
var isSemigroupoid = function (I) { return typeof I.compose === 'function'; };
var isMonadThrow = function (I) { return typeof I.throwError === 'function'; };
/** @deprecated */
function pipeable(I) {
    var r = {};
    if (isFunctor(I)) {
        r.map = map(I);
    }
    if (isContravariant(I)) {
        r.contramap = contramap(I);
    }
    if (isFunctorWithIndex(I)) {
        r.mapWithIndex = mapWithIndex(I);
    }
    if (isApply(I)) {
        r.ap = ap(I);
        r.apFirst = (0,_Apply__WEBPACK_IMPORTED_MODULE_0__.apFirst)(I);
        r.apSecond = (0,_Apply__WEBPACK_IMPORTED_MODULE_0__.apSecond)(I);
    }
    if (isChain(I)) {
        r.chain = chain(I);
        r.chainFirst = (0,_Chain__WEBPACK_IMPORTED_MODULE_1__.chainFirst)(I);
        r.flatten = r.chain(_function__WEBPACK_IMPORTED_MODULE_2__.identity);
    }
    if (isBifunctor(I)) {
        r.bimap = bimap(I);
        r.mapLeft = mapLeft(I);
    }
    if (isExtend(I)) {
        r.extend = extend(I);
        r.duplicate = r.extend(_function__WEBPACK_IMPORTED_MODULE_2__.identity);
    }
    if (isFoldable(I)) {
        r.reduce = reduce(I);
        r.foldMap = foldMap(I);
        r.reduceRight = reduceRight(I);
    }
    if (isFoldableWithIndex(I)) {
        r.reduceWithIndex = reduceWithIndex(I);
        r.foldMapWithIndex = foldMapWithIndex(I);
        r.reduceRightWithIndex = reduceRightWithIndex(I);
    }
    if (isAlt(I)) {
        r.alt = alt(I);
    }
    if (isCompactable(I)) {
        r.compact = I.compact;
        r.separate = I.separate;
    }
    if (isFilterable(I)) {
        r.filter = filter(I);
        r.filterMap = filterMap(I);
        r.partition = partition(I);
        r.partitionMap = partitionMap(I);
    }
    if (isFilterableWithIndex(I)) {
        r.filterWithIndex = filterWithIndex(I);
        r.filterMapWithIndex = filterMapWithIndex(I);
        r.partitionWithIndex = partitionWithIndex(I);
        r.partitionMapWithIndex = partitionMapWithIndex(I);
    }
    if (isProfunctor(I)) {
        r.promap = promap(I);
    }
    if (isSemigroupoid(I)) {
        r.compose = compose(I);
    }
    if (isMonadThrow(I)) {
        var fromOption = function (onNone) { return function (ma) {
            return ma._tag === 'None' ? I.throwError(onNone()) : I.of(ma.value);
        }; };
        var fromEither = function (ma) {
            return ma._tag === 'Left' ? I.throwError(ma.left) : I.of(ma.right);
        };
        var fromPredicate = function (predicate, onFalse) {
            return function (a) {
                return predicate(a) ? I.of(a) : I.throwError(onFalse(a));
            };
        };
        var filterOrElse = function (predicate, onFalse) {
            return function (ma) {
                return I.chain(ma, function (a) { return (predicate(a) ? I.of(a) : I.throwError(onFalse(a))); });
            };
        };
        r.fromOption = fromOption;
        r.fromEither = fromEither;
        r.fromPredicate = fromPredicate;
        r.filterOrElse = filterOrElse;
    }
    return r;
}
/**
 * Use [`pipe`](https://gcanti.github.io/fp-ts/modules/function.ts.html#pipe) from `function` module instead.
 *
 * @since 2.0.0
 * @deprecated
 */
var pipe = _function__WEBPACK_IMPORTED_MODULE_2__.pipe;


/***/ }),

/***/ "./node_modules/io-ts/es6/DecodeError.js":
/*!***********************************************!*\
  !*** ./node_modules/io-ts/es6/DecodeError.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fold: () => (/* binding */ fold),
/* harmony export */   getSemigroup: () => (/* binding */ getSemigroup),
/* harmony export */   index: () => (/* binding */ index),
/* harmony export */   key: () => (/* binding */ key),
/* harmony export */   lazy: () => (/* binding */ lazy),
/* harmony export */   leaf: () => (/* binding */ leaf),
/* harmony export */   member: () => (/* binding */ member),
/* harmony export */   optional: () => (/* binding */ optional),
/* harmony export */   required: () => (/* binding */ required),
/* harmony export */   wrap: () => (/* binding */ wrap)
/* harmony export */ });
/* harmony import */ var _FreeSemigroup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FreeSemigroup */ "./node_modules/io-ts/es6/FreeSemigroup.js");

/**
 * @category model
 * @since 2.2.7
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const
var required = 'required';
/**
 * @category model
 * @since 2.2.7
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const
var optional = 'optional';
/**
 * @category constructors
 * @since 2.2.7
 */
var leaf = function (actual, error) { return ({ _tag: 'Leaf', actual: actual, error: error }); };
/**
 * @category constructors
 * @since 2.2.7
 */
var key = function (key, kind, errors) { return ({
    _tag: 'Key',
    key: key,
    kind: kind,
    errors: errors
}); };
/**
 * @category constructors
 * @since 2.2.7
 */
var index = function (index, kind, errors) { return ({
    _tag: 'Index',
    index: index,
    kind: kind,
    errors: errors
}); };
/**
 * @category constructors
 * @since 2.2.7
 */
var member = function (index, errors) { return ({
    _tag: 'Member',
    index: index,
    errors: errors
}); };
/**
 * @category constructors
 * @since 2.2.7
 */
var lazy = function (id, errors) { return ({
    _tag: 'Lazy',
    id: id,
    errors: errors
}); };
/**
 * @category constructors
 * @since 2.2.9
 */
var wrap = function (error, errors) { return ({
    _tag: 'Wrap',
    error: error,
    errors: errors
}); };
/**
 * @category destructors
 * @since 2.2.7
 */
var fold = function (patterns) {
    var f = function (e) {
        switch (e._tag) {
            case 'Leaf':
                return patterns.Leaf(e.actual, e.error);
            case 'Key':
                return patterns.Key(e.key, e.kind, e.errors);
            case 'Index':
                return patterns.Index(e.index, e.kind, e.errors);
            case 'Member':
                return patterns.Member(e.index, e.errors);
            case 'Lazy':
                return patterns.Lazy(e.id, e.errors);
            case 'Wrap':
                return patterns.Wrap(e.error, e.errors);
        }
    };
    return f;
};
/**
 * @category instances
 * @since 2.2.7
 */
function getSemigroup() {
    return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_0__.getSemigroup();
}


/***/ }),

/***/ "./node_modules/io-ts/es6/Decoder.js":
/*!*******************************************!*\
  !*** ./node_modules/io-ts/es6/Decoder.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alt: () => (/* binding */ Alt),
/* harmony export */   Category: () => (/* binding */ Category),
/* harmony export */   Functor: () => (/* binding */ Functor),
/* harmony export */   SE: () => (/* binding */ SE),
/* harmony export */   Schemable: () => (/* binding */ Schemable),
/* harmony export */   URI: () => (/* binding */ URI),
/* harmony export */   UnknownArray: () => (/* binding */ UnknownArray),
/* harmony export */   UnknownRecord: () => (/* binding */ UnknownRecord),
/* harmony export */   WithRefine: () => (/* binding */ WithRefine),
/* harmony export */   WithUnion: () => (/* binding */ WithUnion),
/* harmony export */   WithUnknownContainers: () => (/* binding */ WithUnknownContainers),
/* harmony export */   alt: () => (/* binding */ alt),
/* harmony export */   ap: () => (/* binding */ ap),
/* harmony export */   array: () => (/* binding */ array),
/* harmony export */   boolean: () => (/* binding */ boolean),
/* harmony export */   compose: () => (/* binding */ compose),
/* harmony export */   draw: () => (/* binding */ draw),
/* harmony export */   error: () => (/* binding */ error),
/* harmony export */   failure: () => (/* binding */ failure),
/* harmony export */   fromArray: () => (/* binding */ fromArray),
/* harmony export */   fromGuard: () => (/* binding */ fromGuard),
/* harmony export */   fromPartial: () => (/* binding */ fromPartial),
/* harmony export */   fromRecord: () => (/* binding */ fromRecord),
/* harmony export */   fromRefinement: () => (/* binding */ fromRefinement),
/* harmony export */   fromStruct: () => (/* binding */ fromStruct),
/* harmony export */   fromSum: () => (/* binding */ fromSum),
/* harmony export */   fromTuple: () => (/* binding */ fromTuple),
/* harmony export */   fromType: () => (/* binding */ fromType),
/* harmony export */   id: () => (/* binding */ id),
/* harmony export */   intersect: () => (/* binding */ intersect),
/* harmony export */   lazy: () => (/* binding */ lazy),
/* harmony export */   literal: () => (/* binding */ literal),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   mapLeftWithInput: () => (/* binding */ mapLeftWithInput),
/* harmony export */   nullable: () => (/* binding */ nullable),
/* harmony export */   number: () => (/* binding */ number),
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   partial: () => (/* binding */ partial),
/* harmony export */   readonly: () => (/* binding */ readonly),
/* harmony export */   record: () => (/* binding */ record),
/* harmony export */   refine: () => (/* binding */ refine),
/* harmony export */   string: () => (/* binding */ string),
/* harmony export */   stringify: () => (/* binding */ stringify),
/* harmony export */   struct: () => (/* binding */ struct),
/* harmony export */   success: () => (/* binding */ success),
/* harmony export */   sum: () => (/* binding */ sum),
/* harmony export */   tuple: () => (/* binding */ tuple),
/* harmony export */   type: () => (/* binding */ type),
/* harmony export */   union: () => (/* binding */ union),
/* harmony export */   withMessage: () => (/* binding */ withMessage)
/* harmony export */ });
/* harmony import */ var fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fp-ts/es6/Either */ "./node_modules/fp-ts/es6/Either.js");
/* harmony import */ var fp_ts_es6_function__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! fp-ts/es6/function */ "./node_modules/fp-ts/es6/function.js");
/* harmony import */ var fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fp-ts/es6/pipeable */ "./node_modules/fp-ts/es6/pipeable.js");
/* harmony import */ var _DecodeError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DecodeError */ "./node_modules/io-ts/es6/DecodeError.js");
/* harmony import */ var _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FreeSemigroup */ "./node_modules/io-ts/es6/FreeSemigroup.js");
/* harmony import */ var _Guard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Guard */ "./node_modules/io-ts/es6/Guard.js");
/* harmony import */ var _Kleisli__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Kleisli */ "./node_modules/io-ts/es6/Kleisli.js");







// -------------------------------------------------------------------------------------
// Kleisli config
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
var SE = 
/*#__PURE__*/
_DecodeError__WEBPACK_IMPORTED_MODULE_0__.getSemigroup();
/**
 * @internal
 */
var ap = function (fab, fa) {
    return fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.isLeft(fab)
        ? fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.isLeft(fa)
            ? fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.left(SE.concat(fab.left, fa.left))
            : fab
        : fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.isLeft(fa)
            ? fa
            : fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.right(fab.right(fa.right));
};
var M = {
    URI: fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.URI,
    _E: undefined,
    map: function (fa, f) { return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(fa, fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.map(f)); },
    ap: ap,
    of: fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.right,
    chain: function (ma, f) { return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(ma, fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.chain(f)); },
    throwError: fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.left,
    bimap: function (fa, f, g) { return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(fa, fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.bimap(f, g)); },
    mapLeft: function (fa, f) { return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(fa, fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.mapLeft(f)); },
    alt: function (me, that) {
        if (fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.isRight(me)) {
            return me;
        }
        var ea = that();
        return fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.isLeft(ea) ? fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.left(SE.concat(me.left, ea.left)) : ea;
    }
};
/**
 * @category DecodeError
 * @since 2.2.7
 */
var error = function (actual, message) { return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.leaf(actual, message)); };
/**
 * @category DecodeError
 * @since 2.2.7
 */
var success = fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.right;
/**
 * @category DecodeError
 * @since 2.2.7
 */
var failure = function (actual, message) {
    return fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.left(error(actual, message));
};
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.8
 */
var fromRefinement = function (refinement, expected) {
    return _Kleisli__WEBPACK_IMPORTED_MODULE_4__.fromRefinement(M)(refinement, function (u) { return error(u, expected); });
};
/**
 * @category constructors
 * @since 2.2.8
 */
var fromGuard = function (guard, expected) {
    return fromRefinement(guard.is, expected);
};
/**
 * @category constructors
 * @since 2.2.7
 */
var literal = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.literal(M)(function (u, values) { return error(u, values.map(function (value) { return JSON.stringify(value); }).join(' | ')); });
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.7
 */
var string = 
/*#__PURE__*/
fromGuard(_Guard__WEBPACK_IMPORTED_MODULE_5__.string, 'string');
/**
 * @category primitives
 * @since 2.2.7
 */
var number = 
/*#__PURE__*/
fromGuard(_Guard__WEBPACK_IMPORTED_MODULE_5__.number, 'number');
/**
 * @category primitives
 * @since 2.2.7
 */
var boolean = 
/*#__PURE__*/
fromGuard(_Guard__WEBPACK_IMPORTED_MODULE_5__.boolean, 'boolean');
/**
 * @category primitives
 * @since 2.2.7
 */
var UnknownArray = 
/*#__PURE__*/
fromGuard(_Guard__WEBPACK_IMPORTED_MODULE_5__.UnknownArray, 'Array<unknown>');
/**
 * @category primitives
 * @since 2.2.7
 */
var UnknownRecord = 
/*#__PURE__*/
fromGuard(_Guard__WEBPACK_IMPORTED_MODULE_5__.UnknownRecord, 'Record<string, unknown>');
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.7
 */
var mapLeftWithInput = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.mapLeftWithInput(M);
/**
 * @category combinators
 * @since 2.2.9
 */
var withMessage = function (message) {
    return mapLeftWithInput(function (input, e) { return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.wrap(message(input, e), e)); });
};
/**
 * @category combinators
 * @since 2.2.7
 */
var refine = function (refinement, id) { return _Kleisli__WEBPACK_IMPORTED_MODULE_4__.refine(M)(refinement, function (a) { return error(a, id); }); };
/**
 * @category combinators
 * @since 2.2.7
 */
var parse = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.parse(M);
/**
 * @category combinators
 * @since 2.2.7
 */
var nullable = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.nullable(M)(function (u, e) { return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.concat(_FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.member(0, error(u, 'null'))), _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.member(1, e))); });
/**
 * @category combinators
 * @since 2.2.15
 */
var fromStruct = function (properties) {
    return _Kleisli__WEBPACK_IMPORTED_MODULE_4__.fromStruct(M)(function (k, e) { return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.key(k, _DecodeError__WEBPACK_IMPORTED_MODULE_0__.required, e)); })(properties);
};
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.8
 * @deprecated
 */
var fromType = fromStruct;
/**
 * @category combinators
 * @since 2.2.15
 */
var struct = function (properties) { return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(UnknownRecord, compose(fromStruct(properties))); };
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.7
 * @deprecated
 */
var type = struct;
/**
 * @category combinators
 * @since 2.2.8
 */
var fromPartial = function (properties) {
    return _Kleisli__WEBPACK_IMPORTED_MODULE_4__.fromPartial(M)(function (k, e) { return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.key(k, _DecodeError__WEBPACK_IMPORTED_MODULE_0__.optional, e)); })(properties);
};
/**
 * @category combinators
 * @since 2.2.7
 */
var partial = function (properties) { return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(UnknownRecord, compose(fromPartial(properties))); };
/**
 * @category combinators
 * @since 2.2.8
 */
var fromArray = function (item) {
    return _Kleisli__WEBPACK_IMPORTED_MODULE_4__.fromArray(M)(function (i, e) { return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.index(i, _DecodeError__WEBPACK_IMPORTED_MODULE_0__.optional, e)); })(item);
};
/**
 * @category combinators
 * @since 2.2.7
 */
var array = function (item) {
    return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(UnknownArray, compose(fromArray(item)));
};
/**
 * @category combinators
 * @since 2.2.8
 */
var fromRecord = function (codomain) {
    return _Kleisli__WEBPACK_IMPORTED_MODULE_4__.fromRecord(M)(function (k, e) { return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.key(k, _DecodeError__WEBPACK_IMPORTED_MODULE_0__.optional, e)); })(codomain);
};
/**
 * @category combinators
 * @since 2.2.7
 */
var record = function (codomain) {
    return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(UnknownRecord, compose(fromRecord(codomain)));
};
/**
 * @category combinators
 * @since 2.2.8
 */
var fromTuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return _Kleisli__WEBPACK_IMPORTED_MODULE_4__.fromTuple(M)(function (i, e) { return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.index(i, _DecodeError__WEBPACK_IMPORTED_MODULE_0__.required, e)); }).apply(void 0, components);
};
/**
 * @category combinators
 * @since 2.2.7
 */
var tuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(UnknownArray, compose(fromTuple.apply(void 0, components)));
};
/**
 * @category combinators
 * @since 2.2.7
 */
var union = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.union(M)(function (i, e) { return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.member(i, e)); });
/**
 * @category combinators
 * @since 2.2.7
 */
var intersect = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.intersect(M);
/**
 * @category combinators
 * @since 2.2.8
 */
var fromSum = function (tag) { return function (members) {
    return _Kleisli__WEBPACK_IMPORTED_MODULE_4__.fromSum(M)(function (tag, value, keys) {
        return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.key(tag, _DecodeError__WEBPACK_IMPORTED_MODULE_0__.required, error(value, keys.length === 0 ? 'never' : keys.map(function (k) { return JSON.stringify(k); }).join(' | '))));
    })(tag)(members);
}; };
/**
 * @category combinators
 * @since 2.2.7
 */
var sum = function (tag) { return function (members) { return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(UnknownRecord, compose(fromSum(tag)(members))); }; };
/**
 * @category combinators
 * @since 2.2.7
 */
var lazy = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.lazy(M)(function (id, e) { return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.lazy(id, e)); });
/**
 * @category combinators
 * @since 2.2.15
 */
var readonly = fp_ts_es6_function__WEBPACK_IMPORTED_MODULE_6__.identity;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var map_ = function (fa, f) { return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(fa, map(f)); };
var alt_ = function (me, that) { return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(me, alt(that)); };
var compose_ = function (ab, la) { return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(la, compose(ab)); };
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Functor
 * @since 2.2.7
 */
var map = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.map(M);
/**
 * @category Alt
 * @since 2.2.7
 */
var alt = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.alt(M);
/**
 * @category Semigroupoid
 * @since 2.2.8
 */
var compose = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.compose(M);
/**
 * @category Category
 * @since 2.2.8
 */
var id = 
/*#__PURE__*/
_Kleisli__WEBPACK_IMPORTED_MODULE_4__.id(M);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.7
 */
var URI = 'io-ts/Decoder';
/**
 * @category instances
 * @since 2.2.8
 */
var Functor = {
    URI: URI,
    map: map_
};
/**
 * @category instances
 * @since 2.2.8
 */
var Alt = {
    URI: URI,
    map: map_,
    alt: alt_
};
/**
 * @category instances
 * @since 2.2.8
 */
var Category = {
    URI: URI,
    compose: compose_,
    id: id
};
/**
 * @category instances
 * @since 2.2.8
 */
var Schemable = {
    URI: URI,
    literal: literal,
    string: string,
    number: number,
    boolean: boolean,
    nullable: nullable,
    type: type,
    struct: struct,
    partial: partial,
    record: record,
    array: array,
    tuple: tuple,
    intersect: intersect,
    sum: sum,
    lazy: lazy,
    readonly: readonly
};
/**
 * @category instances
 * @since 2.2.8
 */
var WithUnknownContainers = {
    UnknownArray: UnknownArray,
    UnknownRecord: UnknownRecord
};
/**
 * @category instances
 * @since 2.2.8
 */
var WithUnion = {
    union: union
};
/**
 * @category instances
 * @since 2.2.8
 */
var WithRefine = {
    refine: refine
};
var empty = [];
var make = function (value, forest) {
    if (forest === void 0) { forest = empty; }
    return ({
        value: value,
        forest: forest
    });
};
var drawTree = function (tree) { return tree.value + drawForest('\n', tree.forest); };
var drawForest = function (indentation, forest) {
    var r = '';
    var len = forest.length;
    var tree;
    for (var i = 0; i < len; i++) {
        tree = forest[i];
        var isLast = i === len - 1;
        r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value;
        r += drawForest(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest);
    }
    return r;
};
var toTree = _DecodeError__WEBPACK_IMPORTED_MODULE_0__.fold({
    Leaf: function (input, error) { return make("cannot decode ".concat(JSON.stringify(input), ", should be ").concat(error)); },
    Key: function (key, kind, errors) { return make("".concat(kind, " property ").concat(JSON.stringify(key)), toForest(errors)); },
    Index: function (index, kind, errors) { return make("".concat(kind, " index ").concat(index), toForest(errors)); },
    Member: function (index, errors) { return make("member ".concat(index), toForest(errors)); },
    Lazy: function (id, errors) { return make("lazy type ".concat(id), toForest(errors)); },
    Wrap: function (error, errors) { return make(error, toForest(errors)); }
});
var toForest = function (e) {
    var stack = [];
    var focus = e;
    var res = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
        switch (focus._tag) {
            case 'Of':
                {
                    res.push(toTree(focus.value));
                    var tmp = stack.pop();
                    if (tmp === undefined) {
                        return res;
                    }
                    else {
                        focus = tmp;
                    }
                }
                break;
            case 'Concat':
                stack.push(focus.right);
                focus = focus.left;
                break;
        }
    }
};
/**
 * @since 2.2.7
 */
var draw = function (e) { return toForest(e).map(drawTree).join('\n'); };
/**
 * @internal
 */
var stringify = 
/*#__PURE__*/
fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.fold(draw, function (a) { return JSON.stringify(a, null, 2); });


/***/ }),

/***/ "./node_modules/io-ts/es6/FreeSemigroup.js":
/*!*************************************************!*\
  !*** ./node_modules/io-ts/es6/FreeSemigroup.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   concat: () => (/* binding */ concat),
/* harmony export */   fold: () => (/* binding */ fold),
/* harmony export */   getSemigroup: () => (/* binding */ getSemigroup),
/* harmony export */   of: () => (/* binding */ of)
/* harmony export */ });
/**
 * @category constructors
 * @since 2.2.7
 */
var of = function (a) { return ({ _tag: 'Of', value: a }); };
/**
 * @category constructors
 * @since 2.2.7
 */
var concat = function (left, right) { return ({
    _tag: 'Concat',
    left: left,
    right: right
}); };
/**
 * @category destructors
 * @since 2.2.7
 */
var fold = function (onOf, onConcat) { return function (f) {
    switch (f._tag) {
        case 'Of':
            return onOf(f.value);
        case 'Concat':
            return onConcat(f.left, f.right);
    }
}; };
/**
 * @category instances
 * @since 2.2.7
 */
function getSemigroup() {
    return { concat: concat };
}


/***/ }),

/***/ "./node_modules/io-ts/es6/Guard.js":
/*!*****************************************!*\
  !*** ./node_modules/io-ts/es6/Guard.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Schemable: () => (/* binding */ Schemable),
/* harmony export */   URI: () => (/* binding */ URI),
/* harmony export */   UnknownArray: () => (/* binding */ UnknownArray),
/* harmony export */   UnknownRecord: () => (/* binding */ UnknownRecord),
/* harmony export */   WithRefine: () => (/* binding */ WithRefine),
/* harmony export */   WithUnion: () => (/* binding */ WithUnion),
/* harmony export */   WithUnknownContainers: () => (/* binding */ WithUnknownContainers),
/* harmony export */   alt: () => (/* binding */ alt),
/* harmony export */   array: () => (/* binding */ array),
/* harmony export */   boolean: () => (/* binding */ boolean),
/* harmony export */   compose: () => (/* binding */ compose),
/* harmony export */   id: () => (/* binding */ id),
/* harmony export */   intersect: () => (/* binding */ intersect),
/* harmony export */   lazy: () => (/* binding */ lazy),
/* harmony export */   literal: () => (/* binding */ literal),
/* harmony export */   nullable: () => (/* binding */ nullable),
/* harmony export */   number: () => (/* binding */ number),
/* harmony export */   partial: () => (/* binding */ partial),
/* harmony export */   readonly: () => (/* binding */ readonly),
/* harmony export */   record: () => (/* binding */ record),
/* harmony export */   refine: () => (/* binding */ refine),
/* harmony export */   string: () => (/* binding */ string),
/* harmony export */   struct: () => (/* binding */ struct),
/* harmony export */   sum: () => (/* binding */ sum),
/* harmony export */   tuple: () => (/* binding */ tuple),
/* harmony export */   type: () => (/* binding */ type),
/* harmony export */   union: () => (/* binding */ union),
/* harmony export */   zero: () => (/* binding */ zero)
/* harmony export */ });
/* harmony import */ var fp_ts_es6_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fp-ts/es6/function */ "./node_modules/fp-ts/es6/function.js");
/* harmony import */ var fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fp-ts/es6/pipeable */ "./node_modules/fp-ts/es6/pipeable.js");
/* harmony import */ var _Schemable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Schemable */ "./node_modules/io-ts/es6/Schemable.js");
/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community, see these tracking
 * [issues](https://github.com/gcanti/io-ts/issues?q=label%3Av2.2+) for further discussions and enhancements.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.2.0
 */



// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.0
 */
var literal = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return ({
        is: function (u) { return values.findIndex(function (a) { return a === u; }) !== -1; }
    });
};
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.0
 */
var string = {
    is: function (u) { return typeof u === 'string'; }
};
/**
 * Note: `NaN` is excluded.
 *
 * @category primitives
 * @since 2.2.0
 */
var number = {
    is: function (u) { return typeof u === 'number' && !isNaN(u); }
};
/**
 * @category primitives
 * @since 2.2.0
 */
var boolean = {
    is: function (u) { return typeof u === 'boolean'; }
};
/**
 * @category primitives
 * @since 2.2.0
 */
var UnknownArray = {
    is: Array.isArray
};
/**
 * @category primitives
 * @since 2.2.0
 */
var UnknownRecord = {
    is: function (u) { return u !== null && typeof u === 'object' && !Array.isArray(u); }
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.0
 */
var refine = function (refinement) { return function (from) { return ({
    is: function (i) { return from.is(i) && refinement(i); }
}); }; };
/**
 * @category combinators
 * @since 2.2.0
 */
var nullable = function (or) { return ({
    is: function (i) { return i === null || or.is(i); }
}); };
/**
 * @category combinators
 * @since 2.2.15
 */
var struct = function (properties) {
    return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_0__.pipe)(UnknownRecord, refine(function (r) {
        for (var k in properties) {
            if (!(k in r) || !properties[k].is(r[k])) {
                return false;
            }
        }
        return true;
    }));
};
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.0
 * @deprecated
 */
var type = struct;
/**
 * @category combinators
 * @since 2.2.0
 */
var partial = function (properties) {
    return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_0__.pipe)(UnknownRecord, refine(function (r) {
        for (var k in properties) {
            var v = r[k];
            if (v !== undefined && !properties[k].is(v)) {
                return false;
            }
        }
        return true;
    }));
};
/**
 * @category combinators
 * @since 2.2.0
 */
var array = function (item) {
    return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_0__.pipe)(UnknownArray, refine(function (us) { return us.every(item.is); }));
};
/**
 * @category combinators
 * @since 2.2.0
 */
var record = function (codomain) {
    return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_0__.pipe)(UnknownRecord, refine(function (r) {
        for (var k in r) {
            if (!codomain.is(r[k])) {
                return false;
            }
        }
        return true;
    }));
};
/**
 * @category combinators
 * @since 2.2.0
 */
var tuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return ({
        is: function (u) { return Array.isArray(u) && u.length === components.length && components.every(function (c, i) { return c.is(u[i]); }); }
    });
};
/**
 * @category combinators
 * @since 2.2.0
 */
var intersect = function (right) { return function (left) { return ({
    is: function (u) { return left.is(u) && right.is(u); }
}); }; };
/**
 * @category combinators
 * @since 2.2.0
 */
var union = function () {
    var members = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        members[_i] = arguments[_i];
    }
    return ({
        is: function (u) { return members.some(function (m) { return m.is(u); }); }
    });
};
/**
 * @category combinators
 * @since 2.2.0
 */
var sum = function (tag) { return function (members) {
    return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_0__.pipe)(UnknownRecord, refine(function (r) {
        var v = r[tag];
        if (v in members) {
            return members[v].is(r);
        }
        return false;
    }));
}; };
/**
 * @category combinators
 * @since 2.2.0
 */
var lazy = function (f) {
    var get = _Schemable__WEBPACK_IMPORTED_MODULE_1__.memoize(f);
    return {
        is: function (u) { return get().is(u); }
    };
};
/**
 * @category combinators
 * @since 2.2.15
 */
var readonly = fp_ts_es6_function__WEBPACK_IMPORTED_MODULE_2__.identity;
/**
 * @category combinators
 * @since 2.2.8
 */
var alt = function (that) { return function (me) { return ({
    is: function (i) { return me.is(i) || that().is(i); }
}); }; };
/**
 * @category combinators
 * @since 2.2.8
 */
var zero = function () { return ({
    is: function (_) { return false; }
}); };
/**
 * @category combinators
 * @since 2.2.8
 */
var compose = function (to) { return function (from) { return ({
    is: function (i) { return from.is(i) && to.is(i); }
}); }; };
/**
 * @category combinators
 * @since 2.2.8
 */
var id = function () { return ({
    is: function (_) { return true; }
}); };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.0
 */
var URI = 'io-ts/Guard';
/**
 * @category instances
 * @since 2.2.8
 */
var Schemable = {
    URI: URI,
    literal: literal,
    string: string,
    number: number,
    boolean: boolean,
    nullable: nullable,
    type: type,
    struct: struct,
    partial: partial,
    record: record,
    array: array,
    tuple: tuple,
    intersect: intersect,
    sum: sum,
    lazy: function (_, f) { return lazy(f); },
    readonly: readonly
};
/**
 * @category instances
 * @since 2.2.8
 */
var WithUnknownContainers = {
    UnknownArray: UnknownArray,
    UnknownRecord: UnknownRecord
};
/**
 * @category instances
 * @since 2.2.8
 */
var WithUnion = {
    union: union
};
/**
 * @category instances
 * @since 2.2.8
 */
var WithRefine = {
    refine: refine
};


/***/ }),

/***/ "./node_modules/io-ts/es6/Kleisli.js":
/*!*******************************************!*\
  !*** ./node_modules/io-ts/es6/Kleisli.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alt: () => (/* binding */ alt),
/* harmony export */   compose: () => (/* binding */ compose),
/* harmony export */   fromArray: () => (/* binding */ fromArray),
/* harmony export */   fromPartial: () => (/* binding */ fromPartial),
/* harmony export */   fromRecord: () => (/* binding */ fromRecord),
/* harmony export */   fromRefinement: () => (/* binding */ fromRefinement),
/* harmony export */   fromStruct: () => (/* binding */ fromStruct),
/* harmony export */   fromSum: () => (/* binding */ fromSum),
/* harmony export */   fromTuple: () => (/* binding */ fromTuple),
/* harmony export */   fromType: () => (/* binding */ fromType),
/* harmony export */   id: () => (/* binding */ id),
/* harmony export */   intersect: () => (/* binding */ intersect),
/* harmony export */   lazy: () => (/* binding */ lazy),
/* harmony export */   literal: () => (/* binding */ literal),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   mapLeftWithInput: () => (/* binding */ mapLeftWithInput),
/* harmony export */   nullable: () => (/* binding */ nullable),
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   refine: () => (/* binding */ refine),
/* harmony export */   union: () => (/* binding */ union)
/* harmony export */ });
/* harmony import */ var fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fp-ts/es6/Either */ "./node_modules/fp-ts/es6/Either.js");
/* harmony import */ var _Guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Guard */ "./node_modules/io-ts/es6/Guard.js");
/* harmony import */ var _Schemable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Schemable */ "./node_modules/io-ts/es6/Schemable.js");



// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.7
 */
function fromRefinement(M) {
    return function (refinement, onError) { return ({
        decode: function (i) { return (refinement(i) ? M.of(i) : M.throwError(onError(i))); }
    }); };
}
/**
 * @category constructors
 * @since 2.2.7
 */
function literal(M) {
    return function (onError) { return function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return ({
            decode: function (i) { return (_Guard__WEBPACK_IMPORTED_MODULE_0__.literal.apply(_Guard__WEBPACK_IMPORTED_MODULE_0__, values).is(i) ? M.of(i) : M.throwError(onError(i, values))); }
        });
    }; };
}
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.7
 */
function mapLeftWithInput(M) {
    return function (f) { return function (decoder) { return ({
        decode: function (i) { return M.mapLeft(decoder.decode(i), function (e) { return f(i, e); }); }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function refine(M) {
    return function (refinement, onError) { return function (from) { return compose(M)(fromRefinement(M)(refinement, onError))(from); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function parse(M) {
    return function (decode) { return function (from) { return compose(M)({ decode: decode })(from); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function nullable(M) {
    return function (onError) { return function (or) { return ({
        decode: function (i) {
            return i === null
                ? M.of(null)
                : M.bimap(or.decode(i), function (e) { return onError(i, e); }, function (a) { return a; });
        }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.15
 */
function fromStruct(M) {
    var traverse = traverseRecordWithIndex(M);
    return function (onPropertyError) { return function (properties) { return ({
        decode: function (i) {
            return traverse(properties, function (key, decoder) {
                return M.mapLeft(decoder.decode(i[key]), function (e) { return onPropertyError(key, e); });
            });
        }
    }); }; };
}
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.7
 * @deprecated
 */
var fromType = fromStruct;
/**
 * @category combinators
 * @since 2.2.7
 */
function fromPartial(M) {
    var traverse = traverseRecordWithIndex(M);
    var undefinedProperty = M.of(fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.right(undefined));
    var skipProperty = M.of(fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.left(undefined));
    return function (onPropertyError) { return function (properties) { return ({
        decode: function (i) {
            return M.map(traverse(properties, function (key, decoder) {
                var ikey = i[key];
                if (ikey === undefined) {
                    return key in i
                        ? // don't strip undefined properties
                            undefinedProperty
                        : // don't add missing properties
                            skipProperty;
                }
                return M.bimap(decoder.decode(ikey), function (e) { return onPropertyError(key, e); }, function (a) { return fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.right(a); });
            }), compactRecord);
        }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function fromArray(M) {
    var traverse = traverseArrayWithIndex(M);
    return function (onItemError) { return function (item) { return ({
        decode: function (is) { return traverse(is, function (index, i) { return M.mapLeft(item.decode(i), function (e) { return onItemError(index, e); }); }); }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function fromRecord(M) {
    var traverse = traverseRecordWithIndex(M);
    return function (onKeyError) { return function (codomain) { return ({
        decode: function (ir) { return traverse(ir, function (key, i) { return M.mapLeft(codomain.decode(i), function (e) { return onKeyError(key, e); }); }); }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function fromTuple(M) {
    var traverse = traverseArrayWithIndex(M);
    return function (onIndexError) { return function () {
        var components = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            components[_i] = arguments[_i];
        }
        return ({
            decode: function (is) {
                return traverse(components, function (index, decoder) {
                    return M.mapLeft(decoder.decode(is[index]), function (e) { return onIndexError(index, e); });
                });
            }
        });
    }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function union(M) {
    return function (onMemberError) { return function () {
        var members = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            members[_i] = arguments[_i];
        }
        return ({
            decode: function (i) {
                var out = M.mapLeft(members[0].decode(i), function (e) { return onMemberError(0, e); });
                var _loop_1 = function (index) {
                    out = M.alt(out, function () { return M.mapLeft(members[index].decode(i), function (e) { return onMemberError(index, e); }); });
                };
                for (var index = 1; index < members.length; index++) {
                    _loop_1(index);
                }
                return out;
            }
        });
    }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function intersect(M) {
    return function (right) { return function (left) { return ({
        decode: function (i) {
            return M.ap(M.map(left.decode(i), function (a) { return function (b) { return _Schemable__WEBPACK_IMPORTED_MODULE_2__.intersect_(a, b); }; }), right.decode(i));
        }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function fromSum(M) {
    return function (onTagError) { return function (tag) { return function (members) {
        var keys = Object.keys(members);
        return {
            decode: function (ir) {
                var v = ir[tag];
                if (Object.prototype.hasOwnProperty.call(members, v)) {
                    return members[v].decode(ir);
                }
                return M.throwError(onTagError(tag, v, keys));
            }
        };
    }; }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function lazy(M) {
    return function (onError) { return function (id, f) {
        var get = _Schemable__WEBPACK_IMPORTED_MODULE_2__.memoize(f);
        return {
            decode: function (u) { return M.mapLeft(get().decode(u), function (e) { return onError(id, e); }); }
        };
    }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function compose(M) {
    return function (ab) { return function (ia) { return ({
        decode: function (i) { return M.chain(ia.decode(i), ab.decode); }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.8
 */
function id(M) {
    return function () { return ({
        decode: M.of
    }); };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function map(F) {
    return function (f) { return function (ia) { return ({
        decode: function (i) { return F.map(ia.decode(i), f); }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function alt(A) {
    return function (that) { return function (me) { return ({
        decode: function (i) { return A.alt(me.decode(i), function () { return that().decode(i); }); }
    }); }; };
}
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
var traverseArrayWithIndex = function (M) { return function (as, f) {
    return as.reduce(function (mbs, a, i) {
        return M.ap(M.map(mbs, function (bs) { return function (b) {
            bs.push(b);
            return bs;
        }; }), f(i, a));
    }, M.of([]));
}; };
var traverseRecordWithIndex = function (M) { return function (r, f) {
    var ks = Object.keys(r);
    if (ks.length === 0) {
        return M.of({});
    }
    var fr = M.of({});
    var _loop_2 = function (key) {
        fr = M.ap(M.map(fr, function (r) { return function (b) {
            r[key] = b;
            return r;
        }; }), f(key, r[key]));
    };
    for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
        var key = ks_1[_i];
        _loop_2(key);
    }
    return fr;
}; };
var compactRecord = function (r) {
    var out = {};
    for (var k in r) {
        var rk = r[k];
        if (fp_ts_es6_Either__WEBPACK_IMPORTED_MODULE_1__.isRight(rk)) {
            out[k] = rk.right;
        }
    }
    return out;
};


/***/ }),

/***/ "./node_modules/io-ts/es6/Schemable.js":
/*!*********************************************!*\
  !*** ./node_modules/io-ts/es6/Schemable.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   intersect_: () => (/* binding */ intersect_),
/* harmony export */   memoize: () => (/* binding */ memoize)
/* harmony export */ });
/**
 * @since 2.2.0
 */
function memoize(f) {
    var cache = new Map();
    return function (a) {
        if (!cache.has(a)) {
            var b = f(a);
            cache.set(a, b);
            return b;
        }
        return cache.get(a);
    };
}
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
var typeOf = function (x) { return (x === null ? 'null' : typeof x); };
/**
 * @internal
 */
var intersect_ = function (a, b) {
    if (a !== undefined && b !== undefined) {
        var tx = typeOf(a);
        var ty = typeOf(b);
        if (tx === 'object' || ty === 'object') {
            return Object.assign({}, a, b);
        }
    }
    return b;
};


/***/ }),

/***/ "@thinking-home/ui":
/*!*********************************!*\
  !*** external "ThinkingHomeUi" ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["ThinkingHomeUi"];

/***/ }),

/***/ "react":
/*!**************************!*\
  !*** external "thReact" ***!
  \**************************/
/***/ ((module) => {

module.exports = window["thReact"];

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./frontend/page3.tsx ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @thinking-home/ui */ "@thinking-home/ui");
/* harmony import */ var _thinking_home_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var io_ts_Decoder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! io-ts/Decoder */ "./node_modules/io-ts/es6/Decoder.js");




const tmpPigDecoder = io_ts_Decoder__WEBPACK_IMPORTED_MODULE_2__.struct({
    name: io_ts_Decoder__WEBPACK_IMPORTED_MODULE_2__.string,
    size: io_ts_Decoder__WEBPACK_IMPORTED_MODULE_2__.number,
});
const TOPIC = 'mh-example';
const TmpPigToast = (e) => {
    const { msg: { topic, guid, timestamp, data: { name, size } }, counter } = e;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "New Message:")),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            "CURRENT VALUE: ",
            counter),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            "topic: ",
            topic),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            "guid: ",
            guid),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            "timestamp: ",
            timestamp),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            "pig: ",
            name),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            "size: ",
            size)));
};
const TmpSection = () => {
    const { messageHub: { send }, toaster: { showInfo } } = (0,_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__.useAppContext)();
    const [value, setValue] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
    const logger = (0,_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__.useLogger)();
    (0,_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__.useMessageHandler)(TOPIC, tmpPigDecoder, (msg) => {
        showInfo(react__WEBPACK_IMPORTED_MODULE_0__.createElement(TmpPigToast, { msg: msg, counter: value }));
        logger.log(_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Information, 'message was received');
    }, [showInfo, value, logger]);
    const onClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        const name = prompt('Enter the name of the pig');
        send(TOPIC, { name, size: value });
        logger.log(_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Information, 'button has been pressed');
    }, [send, value, logger]);
    const onIncement = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        setValue(value + 1);
    }, [value, setValue]);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null,
            "Current value: ",
            value),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { onClick: onClick }, "Send pig message"),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { onClick: onIncement }, "Incement")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__.createModule)(TmpSection));

})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLDhCQUE4QjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sNkJBQTZCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sNkJBQTZCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyw0QkFBNEI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQzFELFFBQVEsZ0RBQW1CLGFBQWEscUJBQXFCO0FBQzdEO0FBQ0EsaUVBQWUsK0RBQVksWUFBWSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L0FwcGxpY2F0aXZlLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2ZwLXRzL2VzNi9BcHBseS5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvQ2hhaW4uanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L0NoYWluUmVjLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2ZwLXRzL2VzNi9FaXRoZXIuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L0Zyb21FaXRoZXIuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L0Z1bmN0b3IuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L1NlcGFyYXRlZC5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvV2l0aGVyYWJsZS5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvZnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L2ludGVybmFsLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2ZwLXRzL2VzNi9waXBlYWJsZS5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9pby10cy9lczYvRGVjb2RlRXJyb3IuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvaW8tdHMvZXM2L0RlY29kZXIuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvaW8tdHMvZXM2L0ZyZWVTZW1pZ3JvdXAuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvaW8tdHMvZXM2L0d1YXJkLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2lvLXRzL2VzNi9LbGVpc2xpLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2lvLXRzL2VzNi9TY2hlbWFibGUuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvZXh0ZXJuYWwgd2luZG93IFwiVGhpbmtpbmdIb21lVWlcIiIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC9leHRlcm5hbCB3aW5kb3cgXCJ0aFJlYWN0XCIiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL2Zyb250ZW5kL3BhZ2UzLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBgQXBwbGljYXRpdmVgIHR5cGUgY2xhc3MgZXh0ZW5kcyB0aGUgYEFwcGx5YCB0eXBlIGNsYXNzIHdpdGggYSBgb2ZgIGZ1bmN0aW9uLCB3aGljaCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgdmFsdWVzXG4gKiBvZiB0eXBlIGBmIGFgIGZyb20gdmFsdWVzIG9mIHR5cGUgYGFgLlxuICpcbiAqIFdoZXJlIGBBcHBseWAgcHJvdmlkZXMgdGhlIGFiaWxpdHkgdG8gbGlmdCBmdW5jdGlvbnMgb2YgdHdvIG9yIG1vcmUgYXJndW1lbnRzIHRvIGZ1bmN0aW9ucyB3aG9zZSBhcmd1bWVudHMgYXJlXG4gKiB3cmFwcGVkIHVzaW5nIGBmYCwgYW5kIGBGdW5jdG9yYCBwcm92aWRlcyB0aGUgYWJpbGl0eSB0byBsaWZ0IGZ1bmN0aW9ucyBvZiBvbmUgYXJndW1lbnQsIGBwdXJlYCBjYW4gYmUgc2VlbiBhcyB0aGVcbiAqIGZ1bmN0aW9uIHdoaWNoIGxpZnRzIGZ1bmN0aW9ucyBvZiBfemVyb18gYXJndW1lbnRzLiBUaGF0IGlzLCBgQXBwbGljYXRpdmVgIGZ1bmN0b3JzIHN1cHBvcnQgYSBsaWZ0aW5nIG9wZXJhdGlvbiBmb3JcbiAqIGFueSBudW1iZXIgb2YgZnVuY3Rpb24gYXJndW1lbnRzLlxuICpcbiAqIEluc3RhbmNlcyBtdXN0IHNhdGlzZnkgdGhlIGZvbGxvd2luZyBsYXdzIGluIGFkZGl0aW9uIHRvIHRoZSBgQXBwbHlgIGxhd3M6XG4gKlxuICogMS4gSWRlbnRpdHk6IGBBLmFwKEEub2YoYSA9PiBhKSwgZmEpIDwtPiBmYWBcbiAqIDIuIEhvbW9tb3JwaGlzbTogYEEuYXAoQS5vZihhYiksIEEub2YoYSkpIDwtPiBBLm9mKGFiKGEpKWBcbiAqIDMuIEludGVyY2hhbmdlOiBgQS5hcChmYWIsIEEub2YoYSkpIDwtPiBBLmFwKEEub2YoYWIgPT4gYWIoYSkpLCBmYWIpYFxuICpcbiAqIE5vdGUuIGBGdW5jdG9yYCdzIGBtYXBgIGNhbiBiZSBkZXJpdmVkOiBgQS5tYXAoeCwgZikgPSBBLmFwKEEub2YoZiksIHgpYFxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5pbXBvcnQgeyBhcCwgZ2V0QXBwbHlTZW1pZ3JvdXAgfSBmcm9tICcuL0FwcGx5JztcbmltcG9ydCB7IHBpcGUgfSBmcm9tICcuL2Z1bmN0aW9uJztcbmltcG9ydCB7IGdldEZ1bmN0b3JDb21wb3NpdGlvbiB9IGZyb20gJy4vRnVuY3Rvcic7XG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpdmVNb25vaWQoRikge1xuICAgIHZhciBmID0gZ2V0QXBwbHlTZW1pZ3JvdXAoRik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChNKSB7IHJldHVybiAoe1xuICAgICAgICBjb25jYXQ6IGYoTSkuY29uY2F0LFxuICAgICAgICBlbXB0eTogRi5vZihNLmVtcHR5KVxuICAgIH0pOyB9O1xufVxuLyoqIEBkZXByZWNhdGVkICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpdmVDb21wb3NpdGlvbihGLCBHKSB7XG4gICAgdmFyIG1hcCA9IGdldEZ1bmN0b3JDb21wb3NpdGlvbihGLCBHKS5tYXA7XG4gICAgdmFyIF9hcCA9IGFwKEYsIEcpO1xuICAgIHJldHVybiB7XG4gICAgICAgIG1hcDogbWFwLFxuICAgICAgICBvZjogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIEYub2YoRy5vZihhKSk7IH0sXG4gICAgICAgIGFwOiBmdW5jdGlvbiAoZmdhYiwgZmdhKSB7IHJldHVybiBwaXBlKGZnYWIsIF9hcChmZ2EpKTsgfVxuICAgIH07XG59XG4iLCIvKipcbiAqIFRoZSBgQXBwbHlgIGNsYXNzIHByb3ZpZGVzIHRoZSBgYXBgIHdoaWNoIGlzIHVzZWQgdG8gYXBwbHkgYSBmdW5jdGlvbiB0byBhbiBhcmd1bWVudCB1bmRlciBhIHR5cGUgY29uc3RydWN0b3IuXG4gKlxuICogYEFwcGx5YCBjYW4gYmUgdXNlZCB0byBsaWZ0IGZ1bmN0aW9ucyBvZiB0d28gb3IgbW9yZSBhcmd1bWVudHMgdG8gd29yayBvbiB2YWx1ZXMgd3JhcHBlZCB3aXRoIHRoZSB0eXBlIGNvbnN0cnVjdG9yXG4gKiBgZmAuXG4gKlxuICogSW5zdGFuY2VzIG11c3Qgc2F0aXNmeSB0aGUgZm9sbG93aW5nIGxhdyBpbiBhZGRpdGlvbiB0byB0aGUgYEZ1bmN0b3JgIGxhd3M6XG4gKlxuICogMS4gQXNzb2NpYXRpdmUgY29tcG9zaXRpb246IGBGLmFwKEYuYXAoRi5tYXAoZmJjLCBiYyA9PiBhYiA9PiBhID0+IGJjKGFiKGEpKSksIGZhYiksIGZhKSA8LT4gRi5hcChmYmMsIEYuYXAoZmFiLCBmYSkpYFxuICpcbiAqIEZvcm1hbGx5LCBgQXBwbHlgIHJlcHJlc2VudHMgYSBzdHJvbmcgbGF4IHNlbWktbW9ub2lkYWwgZW5kb2Z1bmN0b3IuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIE8gZnJvbSAnZnAtdHMvT3B0aW9uJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICpcbiAqIGNvbnN0IGYgPSAoYTogc3RyaW5nKSA9PiAoYjogbnVtYmVyKSA9PiAoYzogYm9vbGVhbikgPT4gYSArIFN0cmluZyhiKSArIFN0cmluZyhjKVxuICogY29uc3QgZmE6IE8uT3B0aW9uPHN0cmluZz4gPSBPLnNvbWUoJ3MnKVxuICogY29uc3QgZmI6IE8uT3B0aW9uPG51bWJlcj4gPSBPLnNvbWUoMSlcbiAqIGNvbnN0IGZjOiBPLk9wdGlvbjxib29sZWFuPiA9IE8uc29tZSh0cnVlKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgLy8gbGlmdCBhIGZ1bmN0aW9uXG4gKiAgICAgTy5zb21lKGYpLFxuICogICAgIC8vIGFwcGx5IHRoZSBmaXJzdCBhcmd1bWVudFxuICogICAgIE8uYXAoZmEpLFxuICogICAgIC8vIGFwcGx5IHRoZSBzZWNvbmQgYXJndW1lbnRcbiAqICAgICBPLmFwKGZiKSxcbiAqICAgICAvLyBhcHBseSB0aGUgdGhpcmQgYXJndW1lbnRcbiAqICAgICBPLmFwKGZjKVxuICogICApLFxuICogICBPLnNvbWUoJ3MxdHJ1ZScpXG4gKiApXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmltcG9ydCB7IHR1cGxlIH0gZnJvbSAnLi9mdW5jdGlvbic7XG5pbXBvcnQgKiBhcyBfIGZyb20gJy4vaW50ZXJuYWwnO1xuZXhwb3J0IGZ1bmN0aW9uIGFwKEYsIEcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZmFiKSB7XG4gICAgICAgICAgICByZXR1cm4gRi5hcChGLm1hcChmYWIsIGZ1bmN0aW9uIChnYWIpIHsgcmV0dXJuIGZ1bmN0aW9uIChnYSkgeyByZXR1cm4gRy5hcChnYWIsIGdhKTsgfTsgfSksIGZhKTtcbiAgICAgICAgfTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFwRmlyc3QoQSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2Vjb25kKSB7IHJldHVybiBmdW5jdGlvbiAoZmlyc3QpIHtcbiAgICAgICAgcmV0dXJuIEEuYXAoQS5tYXAoZmlyc3QsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBhOyB9OyB9KSwgc2Vjb25kKTtcbiAgICB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFwU2Vjb25kKEEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNlY29uZCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGZpcnN0KSB7XG4gICAgICAgICAgICByZXR1cm4gQS5hcChBLm1hcChmaXJzdCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHsgcmV0dXJuIGI7IH07IH0pLCBzZWNvbmQpO1xuICAgICAgICB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYXBTKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5hbWUsIGZiKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICAgICAgICAgIHJldHVybiBGLmFwKEYubWFwKGZhLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGEsIChfYSA9IHt9LCBfYVtuYW1lXSA9IGIsIF9hKSk7XG4gICAgICAgICAgICB9OyB9KSwgZmIpO1xuICAgICAgICB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbHlTZW1pZ3JvdXAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoUykgeyByZXR1cm4gKHtcbiAgICAgICAgY29uY2F0OiBmdW5jdGlvbiAoZmlyc3QsIHNlY29uZCkge1xuICAgICAgICAgICAgcmV0dXJuIEYuYXAoRi5tYXAoZmlyc3QsIGZ1bmN0aW9uICh4KSB7IHJldHVybiBmdW5jdGlvbiAoeSkgeyByZXR1cm4gUy5jb25jYXQoeCwgeSk7IH07IH0pLCBzZWNvbmQpO1xuICAgICAgICB9XG4gICAgfSk7IH07XG59XG5mdW5jdGlvbiBjdXJyaWVkKGYsIG4sIGFjYykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoeCkge1xuICAgICAgICB2YXIgY29tYmluZWQgPSBBcnJheShhY2MubGVuZ3RoICsgMSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWNjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb21iaW5lZFtpXSA9IGFjY1tpXTtcbiAgICAgICAgfVxuICAgICAgICBjb21iaW5lZFthY2MubGVuZ3RoXSA9IHg7XG4gICAgICAgIHJldHVybiBuID09PSAwID8gZi5hcHBseShudWxsLCBjb21iaW5lZCkgOiBjdXJyaWVkKGYsIG4gLSAxLCBjb21iaW5lZCk7XG4gICAgfTtcbn1cbnZhciB0dXBsZUNvbnN0cnVjdG9ycyA9IHtcbiAgICAxOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gW2FdOyB9LFxuICAgIDI6IGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoYikgeyByZXR1cm4gW2EsIGJdOyB9OyB9LFxuICAgIDM6IGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoYikgeyByZXR1cm4gZnVuY3Rpb24gKGMpIHsgcmV0dXJuIFthLCBiLCBjXTsgfTsgfTsgfSxcbiAgICA0OiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHsgcmV0dXJuIGZ1bmN0aW9uIChjKSB7IHJldHVybiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gW2EsIGIsIGMsIGRdOyB9OyB9OyB9OyB9LFxuICAgIDU6IGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoYikgeyByZXR1cm4gZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGZ1bmN0aW9uIChkKSB7IHJldHVybiBmdW5jdGlvbiAoZSkgeyByZXR1cm4gW2EsIGIsIGMsIGQsIGVdOyB9OyB9OyB9OyB9OyB9XG59O1xuZnVuY3Rpb24gZ2V0VHVwbGVDb25zdHJ1Y3RvcihsZW4pIHtcbiAgICBpZiAoIV8uaGFzLmNhbGwodHVwbGVDb25zdHJ1Y3RvcnMsIGxlbikpIHtcbiAgICAgICAgdHVwbGVDb25zdHJ1Y3RvcnNbbGVuXSA9IGN1cnJpZWQodHVwbGUsIGxlbiAtIDEsIFtdKTtcbiAgICB9XG4gICAgcmV0dXJuIHR1cGxlQ29uc3RydWN0b3JzW2xlbl07XG59XG5leHBvcnQgZnVuY3Rpb24gc2VxdWVuY2VUKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgICAgICAgdmFyIGYgPSBnZXRUdXBsZUNvbnN0cnVjdG9yKGxlbik7XG4gICAgICAgIHZhciBmYXMgPSBGLm1hcChhcmdzWzBdLCBmKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgZmFzID0gRi5hcChmYXMsIGFyZ3NbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYXM7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGdldFJlY29yZENvbnN0cnVjdG9yKGtleXMpIHtcbiAgICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG4gICAgc3dpdGNoIChsZW4pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIHJldHVybiAoX2EgPSB7fSwgX2Fba2V5c1swXV0gPSBhLCBfYSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIHJldHVybiAoX2EgPSB7fSwgX2Fba2V5c1swXV0gPSBhLCBfYVtrZXlzWzFdXSA9IGIsIF9hKTtcbiAgICAgICAgICAgIH07IH07XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHsgcmV0dXJuIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIHJldHVybiAoX2EgPSB7fSwgX2Fba2V5c1swXV0gPSBhLCBfYVtrZXlzWzFdXSA9IGIsIF9hW2tleXNbMl1dID0gYywgX2EpO1xuICAgICAgICAgICAgfTsgfTsgfTtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoYikgeyByZXR1cm4gZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIHJldHVybiAoX2EgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgX2Fba2V5c1swXV0gPSBhLFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzFdXSA9IGIsXG4gICAgICAgICAgICAgICAgICAgIF9hW2tleXNbMl1dID0gYyxcbiAgICAgICAgICAgICAgICAgICAgX2Fba2V5c1szXV0gPSBkLFxuICAgICAgICAgICAgICAgICAgICBfYSk7XG4gICAgICAgICAgICB9OyB9OyB9OyB9O1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBmdW5jdGlvbiAoYykgeyByZXR1cm4gZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIHJldHVybiAoX2EgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgX2Fba2V5c1swXV0gPSBhLFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzFdXSA9IGIsXG4gICAgICAgICAgICAgICAgICAgIF9hW2tleXNbMl1dID0gYyxcbiAgICAgICAgICAgICAgICAgICAgX2Fba2V5c1szXV0gPSBkLFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzRdXSA9IGUsXG4gICAgICAgICAgICAgICAgICAgIF9hKTtcbiAgICAgICAgICAgIH07IH07IH07IH07IH07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gY3VycmllZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByID0ge307XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByW2tleXNbaV1dID0gYXJnc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9LCBsZW4gLSAxLCBbXSk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHNlcXVlbmNlUyhGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMocik7XG4gICAgICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGYgPSBnZXRSZWNvcmRDb25zdHJ1Y3RvcihrZXlzKTtcbiAgICAgICAgdmFyIGZyID0gRi5tYXAocltrZXlzWzBdXSwgZik7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGZyID0gRi5hcChmciwgcltrZXlzW2ldXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZyO1xuICAgIH07XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY2hhaW5GaXJzdChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmlyc3QpIHsgcmV0dXJuIE0uY2hhaW4oZmlyc3QsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBNLm1hcChmKGEpLCBmdW5jdGlvbiAoKSB7IHJldHVybiBhOyB9KTsgfSk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gYmluZChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lLCBmKSB7IHJldHVybiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIE0uY2hhaW4obWEsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBNLm1hcChmKGEpLCBmdW5jdGlvbiAoYikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBhLCAoX2EgPSB7fSwgX2FbbmFtZV0gPSBiLCBfYSkpO1xuICAgIH0pOyB9KTsgfTsgfTtcbn1cbiIsIi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgdGFpbFJlYyA9IGZ1bmN0aW9uIChzdGFydFdpdGgsIGYpIHtcbiAgICB2YXIgYWIgPSBmKHN0YXJ0V2l0aCk7XG4gICAgd2hpbGUgKGFiLl90YWcgPT09ICdMZWZ0Jykge1xuICAgICAgICBhYiA9IGYoYWIubGVmdCk7XG4gICAgfVxuICAgIHJldHVybiBhYi5yaWdodDtcbn07XG4iLCJpbXBvcnQgeyBnZXRBcHBsaWNhdGl2ZU1vbm9pZCB9IGZyb20gJy4vQXBwbGljYXRpdmUnO1xuaW1wb3J0IHsgYXBGaXJzdCBhcyBhcEZpcnN0XywgYXBTIGFzIGFwU18sIGFwU2Vjb25kIGFzIGFwU2Vjb25kXywgZ2V0QXBwbHlTZW1pZ3JvdXAgYXMgZ2V0QXBwbHlTZW1pZ3JvdXBfIH0gZnJvbSAnLi9BcHBseSc7XG5pbXBvcnQgeyBiaW5kIGFzIGJpbmRfLCBjaGFpbkZpcnN0IGFzIGNoYWluRmlyc3RfIH0gZnJvbSAnLi9DaGFpbic7XG5pbXBvcnQgeyB0YWlsUmVjIH0gZnJvbSAnLi9DaGFpblJlYyc7XG5pbXBvcnQgeyBjaGFpbk9wdGlvbksgYXMgY2hhaW5PcHRpb25LXywgZmlsdGVyT3JFbHNlIGFzIGZpbHRlck9yRWxzZV8sIGZyb21PcHRpb24gYXMgZnJvbU9wdGlvbl8sIGZyb21PcHRpb25LIGFzIGZyb21PcHRpb25LXywgZnJvbVByZWRpY2F0ZSBhcyBmcm9tUHJlZGljYXRlXyB9IGZyb20gJy4vRnJvbUVpdGhlcic7XG5pbXBvcnQgeyBkdWFsLCBmbG93LCBpZGVudGl0eSwgcGlwZSB9IGZyb20gJy4vZnVuY3Rpb24nO1xuaW1wb3J0IHsgYmluZFRvIGFzIGJpbmRUb18sIGZsYXAgYXMgZmxhcF8sIGxldCBhcyBsZXRfXyB9IGZyb20gJy4vRnVuY3Rvcic7XG5pbXBvcnQgKiBhcyBfIGZyb20gJy4vaW50ZXJuYWwnO1xuaW1wb3J0IHsgc2VwYXJhdGVkIH0gZnJvbSAnLi9TZXBhcmF0ZWQnO1xuaW1wb3J0IHsgd2lsdERlZmF1bHQsIHdpdGhlckRlZmF1bHQgfSBmcm9tICcuL1dpdGhlcmFibGUnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gY29uc3RydWN0b3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlcmAgaG9sZGluZyBhIGBMZWZ0YCB2YWx1ZS4gVGhpcyB1c3VhbGx5IHJlcHJlc2VudHMgYSBmYWlsdXJlLCBkdWUgdG8gdGhlIHJpZ2h0LWJpYXMgb2YgdGhpc1xuICogc3RydWN0dXJlLlxuICpcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGxlZnQgPSBfLmxlZnQ7XG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlcmAgaG9sZGluZyBhIGBSaWdodGAgdmFsdWUuIFRoaXMgdXN1YWxseSByZXByZXNlbnRzIGEgc3VjY2Vzc2Z1bCB2YWx1ZSBkdWUgdG8gdGhlIHJpZ2h0IGJpYXNcbiAqIG9mIHRoaXMgc3RydWN0dXJlLlxuICpcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIHJpZ2h0ID0gXy5yaWdodDtcbi8qKlxuICogQGNhdGVnb3J5IHNlcXVlbmNpbmdcbiAqIEBzaW5jZSAyLjE0LjBcbiAqL1xuZXhwb3J0IHZhciBmbGF0TWFwID0gLyojX19QVVJFX18qLyBkdWFsKDIsIGZ1bmN0aW9uIChtYSwgZikgeyByZXR1cm4gKGlzTGVmdChtYSkgPyBtYSA6IGYobWEucmlnaHQpKTsgfSk7XG52YXIgX21hcCA9IGZ1bmN0aW9uIChmYSwgZikgeyByZXR1cm4gcGlwZShmYSwgbWFwKGYpKTsgfTtcbnZhciBfYXAgPSBmdW5jdGlvbiAoZmFiLCBmYSkgeyByZXR1cm4gcGlwZShmYWIsIGFwKGZhKSk7IH07XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIF9yZWR1Y2UgPSBmdW5jdGlvbiAoZmEsIGIsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIHJlZHVjZShiLCBmKSk7IH07XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIF9mb2xkTWFwID0gZnVuY3Rpb24gKE0pIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSwgZikge1xuICAgIHZhciBmb2xkTWFwTSA9IGZvbGRNYXAoTSk7XG4gICAgcmV0dXJuIHBpcGUoZmEsIGZvbGRNYXBNKGYpKTtcbn07IH07XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIF9yZWR1Y2VSaWdodCA9IGZ1bmN0aW9uIChmYSwgYiwgZikgeyByZXR1cm4gcGlwZShmYSwgcmVkdWNlUmlnaHQoYiwgZikpOyB9O1xudmFyIF90cmF2ZXJzZSA9IGZ1bmN0aW9uIChGKSB7XG4gICAgdmFyIHRyYXZlcnNlRiA9IHRyYXZlcnNlKEYpO1xuICAgIHJldHVybiBmdW5jdGlvbiAodGEsIGYpIHsgcmV0dXJuIHBpcGUodGEsIHRyYXZlcnNlRihmKSk7IH07XG59O1xudmFyIF9iaW1hcCA9IGZ1bmN0aW9uIChmYSwgZiwgZykgeyByZXR1cm4gcGlwZShmYSwgYmltYXAoZiwgZykpOyB9O1xudmFyIF9tYXBMZWZ0ID0gZnVuY3Rpb24gKGZhLCBmKSB7IHJldHVybiBwaXBlKGZhLCBtYXBMZWZ0KGYpKTsgfTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgX2FsdCA9IGZ1bmN0aW9uIChmYSwgdGhhdCkgeyByZXR1cm4gcGlwZShmYSwgYWx0KHRoYXQpKTsgfTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgX2V4dGVuZCA9IGZ1bmN0aW9uICh3YSwgZikgeyByZXR1cm4gcGlwZSh3YSwgZXh0ZW5kKGYpKTsgfTtcbnZhciBfY2hhaW5SZWMgPSBmdW5jdGlvbiAoYSwgZikge1xuICAgIHJldHVybiB0YWlsUmVjKGYoYSksIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBpc0xlZnQoZSkgPyByaWdodChsZWZ0KGUubGVmdCkpIDogaXNMZWZ0KGUucmlnaHQpID8gbGVmdChmKGUucmlnaHQubGVmdCkpIDogcmlnaHQocmlnaHQoZS5yaWdodC5yaWdodCkpO1xuICAgIH0pO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IHR5cGUgbGFtYmRhc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgVVJJID0gJ0VpdGhlcic7XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGdldFNob3cgPSBmdW5jdGlvbiAoU0UsIFNBKSB7IHJldHVybiAoe1xuICAgIHNob3c6IGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gKGlzTGVmdChtYSkgPyBcImxlZnQoXCIuY29uY2F0KFNFLnNob3cobWEubGVmdCksIFwiKVwiKSA6IFwicmlnaHQoXCIuY29uY2F0KFNBLnNob3cobWEucmlnaHQpLCBcIilcIikpOyB9XG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0RXEgPSBmdW5jdGlvbiAoRUwsIEVBKSB7IHJldHVybiAoe1xuICAgIGVxdWFsczogZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIHggPT09IHkgfHwgKGlzTGVmdCh4KSA/IGlzTGVmdCh5KSAmJiBFTC5lcXVhbHMoeC5sZWZ0LCB5LmxlZnQpIDogaXNSaWdodCh5KSAmJiBFQS5lcXVhbHMoeC5yaWdodCwgeS5yaWdodCkpO1xuICAgIH1cbn0pOyB9O1xuLyoqXG4gKiBTZW1pZ3JvdXAgcmV0dXJuaW5nIHRoZSBsZWZ0LW1vc3Qgbm9uLWBMZWZ0YCB2YWx1ZS4gSWYgYm90aCBvcGVyYW5kcyBhcmUgYFJpZ2h0YHMgdGhlbiB0aGUgaW5uZXIgdmFsdWVzIGFyZVxuICogY29uY2F0ZW5hdGVkIHVzaW5nIHRoZSBwcm92aWRlZCBgU2VtaWdyb3VwYFxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBnZXRTZW1pZ3JvdXAsIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgU2VtaWdyb3VwU3VtIH0gZnJvbSAnZnAtdHMvbnVtYmVyJ1xuICpcbiAqIGNvbnN0IFMgPSBnZXRTZW1pZ3JvdXA8c3RyaW5nLCBudW1iZXI+KFNlbWlncm91cFN1bSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoUy5jb25jYXQobGVmdCgnYScpLCBsZWZ0KCdiJykpLCBsZWZ0KCdhJykpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMuY29uY2F0KGxlZnQoJ2EnKSwgcmlnaHQoMikpLCByaWdodCgyKSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoUy5jb25jYXQocmlnaHQoMSksIGxlZnQoJ2InKSksIHJpZ2h0KDEpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChyaWdodCgxKSwgcmlnaHQoMikpLCByaWdodCgzKSlcbiAqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRTZW1pZ3JvdXAgPSBmdW5jdGlvbiAoUykgeyByZXR1cm4gKHtcbiAgICBjb25jYXQ6IGZ1bmN0aW9uICh4LCB5KSB7IHJldHVybiAoaXNMZWZ0KHkpID8geCA6IGlzTGVmdCh4KSA/IHkgOiByaWdodChTLmNvbmNhdCh4LnJpZ2h0LCB5LnJpZ2h0KSkpOyB9XG59KTsgfTtcbi8qKlxuICogQnVpbGRzIGEgYENvbXBhY3RhYmxlYCBpbnN0YW5jZSBmb3IgYEVpdGhlcmAgZ2l2ZW4gYE1vbm9pZGAgZm9yIHRoZSBsZWZ0IHNpZGUuXG4gKlxuICogQGNhdGVnb3J5IGZpbHRlcmluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIGdldENvbXBhY3RhYmxlID0gZnVuY3Rpb24gKE0pIHtcbiAgICB2YXIgZW1wdHkgPSBsZWZ0KE0uZW1wdHkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFVSSTogVVJJLFxuICAgICAgICBfRTogdW5kZWZpbmVkLFxuICAgICAgICBjb21wYWN0OiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIChpc0xlZnQobWEpID8gbWEgOiBtYS5yaWdodC5fdGFnID09PSAnTm9uZScgPyBlbXB0eSA6IHJpZ2h0KG1hLnJpZ2h0LnZhbHVlKSk7IH0sXG4gICAgICAgIHNlcGFyYXRlOiBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xlZnQobWEpXG4gICAgICAgICAgICAgICAgPyBzZXBhcmF0ZWQobWEsIG1hKVxuICAgICAgICAgICAgICAgIDogaXNMZWZ0KG1hLnJpZ2h0KVxuICAgICAgICAgICAgICAgICAgICA/IHNlcGFyYXRlZChyaWdodChtYS5yaWdodC5sZWZ0KSwgZW1wdHkpXG4gICAgICAgICAgICAgICAgICAgIDogc2VwYXJhdGVkKGVtcHR5LCByaWdodChtYS5yaWdodC5yaWdodCkpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4vKipcbiAqIEJ1aWxkcyBhIGBGaWx0ZXJhYmxlYCBpbnN0YW5jZSBmb3IgYEVpdGhlcmAgZ2l2ZW4gYE1vbm9pZGAgZm9yIHRoZSBsZWZ0IHNpZGVcbiAqXG4gKiBAY2F0ZWdvcnkgZmlsdGVyaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0RmlsdGVyYWJsZSA9IGZ1bmN0aW9uIChNKSB7XG4gICAgdmFyIGVtcHR5ID0gbGVmdChNLmVtcHR5KTtcbiAgICB2YXIgX2EgPSBnZXRDb21wYWN0YWJsZShNKSwgY29tcGFjdCA9IF9hLmNvbXBhY3QsIHNlcGFyYXRlID0gX2Euc2VwYXJhdGU7XG4gICAgdmFyIGZpbHRlciA9IGZ1bmN0aW9uIChtYSwgcHJlZGljYXRlKSB7XG4gICAgICAgIHJldHVybiBpc0xlZnQobWEpID8gbWEgOiBwcmVkaWNhdGUobWEucmlnaHQpID8gbWEgOiBlbXB0eTtcbiAgICB9O1xuICAgIHZhciBwYXJ0aXRpb24gPSBmdW5jdGlvbiAobWEsIHApIHtcbiAgICAgICAgcmV0dXJuIGlzTGVmdChtYSlcbiAgICAgICAgICAgID8gc2VwYXJhdGVkKG1hLCBtYSlcbiAgICAgICAgICAgIDogcChtYS5yaWdodClcbiAgICAgICAgICAgICAgICA/IHNlcGFyYXRlZChlbXB0eSwgcmlnaHQobWEucmlnaHQpKVxuICAgICAgICAgICAgICAgIDogc2VwYXJhdGVkKHJpZ2h0KG1hLnJpZ2h0KSwgZW1wdHkpO1xuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVVJJOiBVUkksXG4gICAgICAgIF9FOiB1bmRlZmluZWQsXG4gICAgICAgIG1hcDogX21hcCxcbiAgICAgICAgY29tcGFjdDogY29tcGFjdCxcbiAgICAgICAgc2VwYXJhdGU6IHNlcGFyYXRlLFxuICAgICAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICAgICAgZmlsdGVyTWFwOiBmdW5jdGlvbiAobWEsIGYpIHtcbiAgICAgICAgICAgIGlmIChpc0xlZnQobWEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG9iID0gZihtYS5yaWdodCk7XG4gICAgICAgICAgICByZXR1cm4gb2IuX3RhZyA9PT0gJ05vbmUnID8gZW1wdHkgOiByaWdodChvYi52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHBhcnRpdGlvbjogcGFydGl0aW9uLFxuICAgICAgICBwYXJ0aXRpb25NYXA6IGZ1bmN0aW9uIChtYSwgZikge1xuICAgICAgICAgICAgaWYgKGlzTGVmdChtYSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VwYXJhdGVkKG1hLCBtYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZSA9IGYobWEucmlnaHQpO1xuICAgICAgICAgICAgcmV0dXJuIGlzTGVmdChlKSA/IHNlcGFyYXRlZChyaWdodChlLmxlZnQpLCBlbXB0eSkgOiBzZXBhcmF0ZWQoZW1wdHksIHJpZ2h0KGUucmlnaHQpKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuLyoqXG4gKiBCdWlsZHMgYFdpdGhlcmFibGVgIGluc3RhbmNlIGZvciBgRWl0aGVyYCBnaXZlbiBgTW9ub2lkYCBmb3IgdGhlIGxlZnQgc2lkZVxuICpcbiAqIEBjYXRlZ29yeSBmaWx0ZXJpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGdldFdpdGhlcmFibGUgPSBmdW5jdGlvbiAoTSkge1xuICAgIHZhciBGXyA9IGdldEZpbHRlcmFibGUoTSk7XG4gICAgdmFyIEMgPSBnZXRDb21wYWN0YWJsZShNKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBVUkk6IFVSSSxcbiAgICAgICAgX0U6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFwOiBfbWFwLFxuICAgICAgICBjb21wYWN0OiBGXy5jb21wYWN0LFxuICAgICAgICBzZXBhcmF0ZTogRl8uc2VwYXJhdGUsXG4gICAgICAgIGZpbHRlcjogRl8uZmlsdGVyLFxuICAgICAgICBmaWx0ZXJNYXA6IEZfLmZpbHRlck1hcCxcbiAgICAgICAgcGFydGl0aW9uOiBGXy5wYXJ0aXRpb24sXG4gICAgICAgIHBhcnRpdGlvbk1hcDogRl8ucGFydGl0aW9uTWFwLFxuICAgICAgICB0cmF2ZXJzZTogX3RyYXZlcnNlLFxuICAgICAgICBzZXF1ZW5jZTogc2VxdWVuY2UsXG4gICAgICAgIHJlZHVjZTogX3JlZHVjZSxcbiAgICAgICAgZm9sZE1hcDogX2ZvbGRNYXAsXG4gICAgICAgIHJlZHVjZVJpZ2h0OiBfcmVkdWNlUmlnaHQsXG4gICAgICAgIHdpdGhlcjogd2l0aGVyRGVmYXVsdChUcmF2ZXJzYWJsZSwgQyksXG4gICAgICAgIHdpbHQ6IHdpbHREZWZhdWx0KFRyYXZlcnNhYmxlLCBDKVxuICAgIH07XG59O1xuLyoqXG4gKiBUaGUgZGVmYXVsdCBbYEFwcGxpY2F0aXZlYF0oI2FwcGxpY2F0aXZlKSBpbnN0YW5jZSByZXR1cm5zIHRoZSBmaXJzdCBlcnJvciwgaWYgeW91IHdhbnQgdG9cbiAqIGdldCBhbGwgZXJyb3JzIHlvdSBuZWVkIHRvIHByb3ZpZGUgYSB3YXkgdG8gY29uY2F0ZW5hdGUgdGhlbSB2aWEgYSBgU2VtaWdyb3VwYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgQSBmcm9tICdmcC10cy9BcHBseSdcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgUyBmcm9tICdmcC10cy9TZW1pZ3JvdXAnXG4gKiBpbXBvcnQgKiBhcyBzdHJpbmcgZnJvbSAnZnAtdHMvc3RyaW5nJ1xuICpcbiAqIGNvbnN0IHBhcnNlU3RyaW5nID0gKHU6IHVua25vd24pOiBFLkVpdGhlcjxzdHJpbmcsIHN0cmluZz4gPT5cbiAqICAgdHlwZW9mIHUgPT09ICdzdHJpbmcnID8gRS5yaWdodCh1KSA6IEUubGVmdCgnbm90IGEgc3RyaW5nJylcbiAqXG4gKiBjb25zdCBwYXJzZU51bWJlciA9ICh1OiB1bmtub3duKTogRS5FaXRoZXI8c3RyaW5nLCBudW1iZXI+ID0+XG4gKiAgIHR5cGVvZiB1ID09PSAnbnVtYmVyJyA/IEUucmlnaHQodSkgOiBFLmxlZnQoJ25vdCBhIG51bWJlcicpXG4gKlxuICogaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZ1xuICogICByZWFkb25seSBhZ2U6IG51bWJlclxuICogfVxuICpcbiAqIGNvbnN0IHBhcnNlUGVyc29uID0gKFxuICogICBpbnB1dDogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAqICk6IEUuRWl0aGVyPHN0cmluZywgUGVyc29uPiA9PlxuICogICBwaXBlKFxuICogICAgIEUuRG8sXG4gKiAgICAgRS5hcFMoJ25hbWUnLCBwYXJzZVN0cmluZyhpbnB1dC5uYW1lKSksXG4gKiAgICAgRS5hcFMoJ2FnZScsIHBhcnNlTnVtYmVyKGlucHV0LmFnZSkpXG4gKiAgIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKHBhcnNlUGVyc29uKHt9KSwgRS5sZWZ0KCdub3QgYSBzdHJpbmcnKSkgLy8gPD0gZmlyc3QgZXJyb3JcbiAqXG4gKiBjb25zdCBBcHBsaWNhdGl2ZSA9IEUuZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uKFxuICogICBwaXBlKHN0cmluZy5TZW1pZ3JvdXAsIFMuaW50ZXJjYWxhdGUoJywgJykpXG4gKiApXG4gKlxuICogY29uc3QgYXBTID0gQS5hcFMoQXBwbGljYXRpdmUpXG4gKlxuICogY29uc3QgcGFyc2VQZXJzb25BbGwgPSAoXG4gKiAgIGlucHV0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICogKTogRS5FaXRoZXI8c3RyaW5nLCBQZXJzb24+ID0+XG4gKiAgIHBpcGUoXG4gKiAgICAgRS5EbyxcbiAqICAgICBhcFMoJ25hbWUnLCBwYXJzZVN0cmluZyhpbnB1dC5uYW1lKSksXG4gKiAgICAgYXBTKCdhZ2UnLCBwYXJzZU51bWJlcihpbnB1dC5hZ2UpKVxuICogICApXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwYXJzZVBlcnNvbkFsbCh7fSksIEUubGVmdCgnbm90IGEgc3RyaW5nLCBub3QgYSBudW1iZXInKSkgLy8gPD0gYWxsIGVycm9yc1xuICpcbiAqIEBjYXRlZ29yeSBlcnJvciBoYW5kbGluZ1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uID0gZnVuY3Rpb24gKFNFKSB7IHJldHVybiAoe1xuICAgIFVSSTogVVJJLFxuICAgIF9FOiB1bmRlZmluZWQsXG4gICAgbWFwOiBfbWFwLFxuICAgIGFwOiBmdW5jdGlvbiAoZmFiLCBmYSkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KGZhYilcbiAgICAgICAgICAgID8gaXNMZWZ0KGZhKVxuICAgICAgICAgICAgICAgID8gbGVmdChTRS5jb25jYXQoZmFiLmxlZnQsIGZhLmxlZnQpKVxuICAgICAgICAgICAgICAgIDogZmFiXG4gICAgICAgICAgICA6IGlzTGVmdChmYSlcbiAgICAgICAgICAgICAgICA/IGZhXG4gICAgICAgICAgICAgICAgOiByaWdodChmYWIucmlnaHQoZmEucmlnaHQpKTtcbiAgICB9LFxuICAgIG9mOiBvZlxufSk7IH07XG4vKipcbiAqIFRoZSBkZWZhdWx0IFtgQWx0YF0oI2FsdCkgaW5zdGFuY2UgcmV0dXJucyB0aGUgbGFzdCBlcnJvciwgaWYgeW91IHdhbnQgdG9cbiAqIGdldCBhbGwgZXJyb3JzIHlvdSBuZWVkIHRvIHByb3ZpZGUgYSB3YXkgdG8gY29uY2F0ZW5hdGUgdGhlbSB2aWEgYSBgU2VtaWdyb3VwYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBTIGZyb20gJ2ZwLXRzL1NlbWlncm91cCdcbiAqIGltcG9ydCAqIGFzIHN0cmluZyBmcm9tICdmcC10cy9zdHJpbmcnXG4gKlxuICogY29uc3QgcGFyc2VTdHJpbmcgPSAodTogdW5rbm93bik6IEUuRWl0aGVyPHN0cmluZywgc3RyaW5nPiA9PlxuICogICB0eXBlb2YgdSA9PT0gJ3N0cmluZycgPyBFLnJpZ2h0KHUpIDogRS5sZWZ0KCdub3QgYSBzdHJpbmcnKVxuICpcbiAqIGNvbnN0IHBhcnNlTnVtYmVyID0gKHU6IHVua25vd24pOiBFLkVpdGhlcjxzdHJpbmcsIG51bWJlcj4gPT5cbiAqICAgdHlwZW9mIHUgPT09ICdudW1iZXInID8gRS5yaWdodCh1KSA6IEUubGVmdCgnbm90IGEgbnVtYmVyJylcbiAqXG4gKiBjb25zdCBwYXJzZSA9ICh1OiB1bmtub3duKTogRS5FaXRoZXI8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXI+ID0+XG4gKiAgIHBpcGUoXG4gKiAgICAgcGFyc2VTdHJpbmcodSksXG4gKiAgICAgRS5hbHQ8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXI+KCgpID0+IHBhcnNlTnVtYmVyKHUpKVxuICogICApXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwYXJzZSh0cnVlKSwgRS5sZWZ0KCdub3QgYSBudW1iZXInKSkgLy8gPD0gbGFzdCBlcnJvclxuICpcbiAqIGNvbnN0IEFsdCA9IEUuZ2V0QWx0VmFsaWRhdGlvbihwaXBlKHN0cmluZy5TZW1pZ3JvdXAsIFMuaW50ZXJjYWxhdGUoJywgJykpKVxuICpcbiAqIGNvbnN0IHBhcnNlQWxsID0gKHU6IHVua25vd24pOiBFLkVpdGhlcjxzdHJpbmcsIHN0cmluZyB8IG51bWJlcj4gPT5cbiAqICAgQWx0LmFsdDxzdHJpbmcgfCBudW1iZXI+KHBhcnNlU3RyaW5nKHUpLCAoKSA9PiBwYXJzZU51bWJlcih1KSlcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKHBhcnNlQWxsKHRydWUpLCBFLmxlZnQoJ25vdCBhIHN0cmluZywgbm90IGEgbnVtYmVyJykpIC8vIDw9IGFsbCBlcnJvcnNcbiAqXG4gKiBAY2F0ZWdvcnkgZXJyb3IgaGFuZGxpbmdcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIGdldEFsdFZhbGlkYXRpb24gPSBmdW5jdGlvbiAoU0UpIHsgcmV0dXJuICh7XG4gICAgVVJJOiBVUkksXG4gICAgX0U6IHVuZGVmaW5lZCxcbiAgICBtYXA6IF9tYXAsXG4gICAgYWx0OiBmdW5jdGlvbiAobWUsIHRoYXQpIHtcbiAgICAgICAgaWYgKGlzUmlnaHQobWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVhID0gdGhhdCgpO1xuICAgICAgICByZXR1cm4gaXNMZWZ0KGVhKSA/IGxlZnQoU0UuY29uY2F0KG1lLmxlZnQsIGVhLmxlZnQpKSA6IGVhO1xuICAgIH1cbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgbWFwcGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgbWFwID0gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgIHJldHVybiBpc0xlZnQoZmEpID8gZmEgOiByaWdodChmKGZhLnJpZ2h0KSk7XG59OyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBGdW5jdG9yID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcFxufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgb2YgPSByaWdodDtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIFBvaW50ZWQgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgb2Y6IG9mXG59O1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgYXBgXSgjYXApLlxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAc2luY2UgMi44LjBcbiAqL1xuZXhwb3J0IHZhciBhcFcgPSBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYWIpIHtcbiAgICByZXR1cm4gaXNMZWZ0KGZhYikgPyBmYWIgOiBpc0xlZnQoZmEpID8gZmEgOiByaWdodChmYWIucmlnaHQoZmEucmlnaHQpKTtcbn07IH07XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGFwID0gYXBXO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgQXBwbHkgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBfbWFwLFxuICAgIGFwOiBfYXBcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIEFwcGxpY2F0aXZlID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcCxcbiAgICBhcDogX2FwLFxuICAgIG9mOiBvZlxufTtcbi8qKlxuICogQWxpYXMgb2YgYGZsYXRNYXBgLlxuICpcbiAqIEBjYXRlZ29yeSBzZXF1ZW5jaW5nXG4gKiBAc2luY2UgMi42LjBcbiAqL1xuZXhwb3J0IHZhciBjaGFpblcgPSBmbGF0TWFwO1xuLyoqXG4gKiBBbGlhcyBvZiBgZmxhdE1hcGAuXG4gKlxuICogQGNhdGVnb3J5IHNlcXVlbmNpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGNoYWluID0gZmxhdE1hcDtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIENoYWluID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcCxcbiAgICBhcDogX2FwLFxuICAgIGNoYWluOiBmbGF0TWFwXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBNb25hZCA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgYXA6IF9hcCxcbiAgICBvZjogb2YsXG4gICAgY2hhaW46IGZsYXRNYXBcbn07XG4vKipcbiAqIExlZnQtYXNzb2NpYXRpdmUgZm9sZCBvZiBhIHN0cnVjdHVyZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKlxuICogY29uc3Qgc3RhcnRXaXRoID0gJ3ByZWZpeCdcbiAqIGNvbnN0IGNvbmNhdCA9IChhOiBzdHJpbmcsIGI6IHN0cmluZykgPT4gYCR7YX06JHtifWBcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUucmlnaHQoJ2EnKSwgRS5yZWR1Y2Uoc3RhcnRXaXRoLCBjb25jYXQpKSxcbiAqICAgJ3ByZWZpeDphJ1xuICogKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5sZWZ0KCdlJyksIEUucmVkdWNlKHN0YXJ0V2l0aCwgY29uY2F0KSksXG4gKiAgICdwcmVmaXgnXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGZvbGRpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIHJlZHVjZSA9IGZ1bmN0aW9uIChiLCBmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICByZXR1cm4gaXNMZWZ0KGZhKSA/IGIgOiBmKGIsIGZhLnJpZ2h0KTtcbn07IH07XG4vKipcbiAqIE1hcCBlYWNoIGVsZW1lbnQgb2YgdGhlIHN0cnVjdHVyZSB0byBhIG1vbm9pZCwgYW5kIGNvbWJpbmUgdGhlIHJlc3VsdHMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0ICogYXMgUyBmcm9tICdmcC10cy9zdHJpbmcnXG4gKlxuICogY29uc3QgeWVsbCA9IChhOiBzdHJpbmcpID0+IGAke2F9IWBcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUucmlnaHQoJ2EnKSwgRS5mb2xkTWFwKFMuTW9ub2lkKSh5ZWxsKSksXG4gKiAgICdhISdcbiAqIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUubGVmdCgnZScpLCBFLmZvbGRNYXAoUy5Nb25vaWQpKHllbGwpKSxcbiAqICAgUy5Nb25vaWQuZW1wdHlcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgZm9sZGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZm9sZE1hcCA9IGZ1bmN0aW9uIChNKSB7IHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGlzTGVmdChmYSkgPyBNLmVtcHR5IDogZihmYS5yaWdodCk7XG59OyB9OyB9O1xuLyoqXG4gKiBSaWdodC1hc3NvY2lhdGl2ZSBmb2xkIG9mIGEgc3RydWN0dXJlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBzdGFydFdpdGggPSAncG9zdGZpeCdcbiAqIGNvbnN0IGNvbmNhdCA9IChhOiBzdHJpbmcsIGI6IHN0cmluZykgPT4gYCR7YX06JHtifWBcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUucmlnaHQoJ2EnKSwgRS5yZWR1Y2VSaWdodChzdGFydFdpdGgsIGNvbmNhdCkpLFxuICogICAnYTpwb3N0Zml4J1xuICogKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5sZWZ0KCdlJyksIEUucmVkdWNlUmlnaHQoc3RhcnRXaXRoLCBjb25jYXQpKSxcbiAqICAgJ3Bvc3RmaXgnXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGZvbGRpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIHJlZHVjZVJpZ2h0ID0gZnVuY3Rpb24gKGIsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgIHJldHVybiBpc0xlZnQoZmEpID8gYiA6IGYoZmEucmlnaHQsIGIpO1xufTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgRm9sZGFibGUgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgcmVkdWNlOiBfcmVkdWNlLFxuICAgIGZvbGRNYXA6IF9mb2xkTWFwLFxuICAgIHJlZHVjZVJpZ2h0OiBfcmVkdWNlUmlnaHRcbn07XG4vKipcbiAqIE1hcCBlYWNoIGVsZW1lbnQgb2YgYSBzdHJ1Y3R1cmUgdG8gYW4gYWN0aW9uLCBldmFsdWF0ZSB0aGVzZSBhY3Rpb25zIGZyb20gbGVmdCB0byByaWdodCwgYW5kIGNvbGxlY3QgdGhlIHJlc3VsdHMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIFJBIGZyb20gJ2ZwLXRzL1JlYWRvbmx5QXJyYXknXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCAqIGFzIE8gZnJvbSAnZnAtdHMvT3B0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodChbJ2EnXSksIEUudHJhdmVyc2UoTy5BcHBsaWNhdGl2ZSkoUkEuaGVhZCkpLFxuICogICBPLnNvbWUoRS5yaWdodCgnYScpKVxuICogIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUucmlnaHQoW10pLCBFLnRyYXZlcnNlKE8uQXBwbGljYXRpdmUpKFJBLmhlYWQpKSxcbiAqICAgTy5ub25lXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjYuM1xuICovXG5leHBvcnQgdmFyIHRyYXZlcnNlID0gZnVuY3Rpb24gKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTGVmdCh0YSkgPyBGLm9mKGxlZnQodGEubGVmdCkpIDogRi5tYXAoZih0YS5yaWdodCksIHJpZ2h0KTtcbiAgICAgICAgfTtcbiAgICB9O1xufTtcbi8qKlxuICogRXZhbHVhdGUgZWFjaCBtb25hZGljIGFjdGlvbiBpbiB0aGUgc3RydWN0dXJlIGZyb20gbGVmdCB0byByaWdodCwgYW5kIGNvbGxlY3QgdGhlIHJlc3VsdHMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0ICogYXMgTyBmcm9tICdmcC10cy9PcHRpb24nXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KE8uc29tZSgnYScpKSwgRS5zZXF1ZW5jZShPLkFwcGxpY2F0aXZlKSksXG4gKiAgIE8uc29tZShFLnJpZ2h0KCdhJykpXG4gKiAgKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodChPLm5vbmUpLCBFLnNlcXVlbmNlKE8uQXBwbGljYXRpdmUpKSxcbiAqICAgTy5ub25lXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjYuM1xuICovXG5leHBvcnQgdmFyIHNlcXVlbmNlID0gZnVuY3Rpb24gKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG1hKSB7XG4gICAgICAgIHJldHVybiBpc0xlZnQobWEpID8gRi5vZihsZWZ0KG1hLmxlZnQpKSA6IEYubWFwKG1hLnJpZ2h0LCByaWdodCk7XG4gICAgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIFRyYXZlcnNhYmxlID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcCxcbiAgICByZWR1Y2U6IF9yZWR1Y2UsXG4gICAgZm9sZE1hcDogX2ZvbGRNYXAsXG4gICAgcmVkdWNlUmlnaHQ6IF9yZWR1Y2VSaWdodCxcbiAgICB0cmF2ZXJzZTogX3RyYXZlcnNlLFxuICAgIHNlcXVlbmNlOiBzZXF1ZW5jZVxufTtcbi8qKlxuICogTWFwIGEgcGFpciBvZiBmdW5jdGlvbnMgb3ZlciB0aGUgdHdvIHR5cGUgYXJndW1lbnRzIG9mIHRoZSBiaWZ1bmN0b3IuXG4gKlxuICogQGNhdGVnb3J5IG1hcHBpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGJpbWFwID0gZnVuY3Rpb24gKGYsIGcpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgIHJldHVybiBpc0xlZnQoZmEpID8gbGVmdChmKGZhLmxlZnQpKSA6IHJpZ2h0KGcoZmEucmlnaHQpKTtcbn07IH07XG4vKipcbiAqIE1hcCBhIGZ1bmN0aW9uIG92ZXIgdGhlIGZpcnN0IHR5cGUgYXJndW1lbnQgb2YgYSBiaWZ1bmN0b3IuXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBtYXBMZWZ0ID0gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgIHJldHVybiBpc0xlZnQoZmEpID8gbGVmdChmKGZhLmxlZnQpKSA6IGZhO1xufTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgQmlmdW5jdG9yID0ge1xuICAgIFVSSTogVVJJLFxuICAgIGJpbWFwOiBfYmltYXAsXG4gICAgbWFwTGVmdDogX21hcExlZnRcbn07XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BhbHRgXSgjYWx0KS5cbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgZXJyb3IgYW5kIHRoZSByZXR1cm4gdHlwZXMgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi45LjBcbiAqL1xuZXhwb3J0IHZhciBhbHRXID0gZnVuY3Rpb24gKHRoYXQpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgIHJldHVybiBpc0xlZnQoZmEpID8gdGhhdCgpIDogZmE7XG59OyB9O1xuLyoqXG4gKiBJZGVudGlmaWVzIGFuIGFzc29jaWF0aXZlIG9wZXJhdGlvbiBvbiBhIHR5cGUgY29uc3RydWN0b3IuIEl0IGlzIHNpbWlsYXIgdG8gYFNlbWlncm91cGAsIGV4Y2VwdCB0aGF0IGl0IGFwcGxpZXMgdG9cbiAqIHR5cGVzIG9mIGtpbmQgYCogLT4gKmAuXG4gKlxuICogSW4gY2FzZSBvZiBgRWl0aGVyYCByZXR1cm5zIHRoZSBsZWZ0LW1vc3Qgbm9uLWBMZWZ0YCB2YWx1ZSAob3IgdGhlIHJpZ2h0LW1vc3QgYExlZnRgIHZhbHVlIGlmIGJvdGggdmFsdWVzIGFyZSBgTGVmdGApLlxuICpcbiAqIHwgeCAgICAgICAgfCB5ICAgICAgICB8IHBpcGUoeCwgYWx0KCgpID0+IHkpIHxcbiAqIHwgLS0tLS0tLS0gfCAtLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgbGVmdChhKSAgfCBsZWZ0KGIpICB8IGxlZnQoYikgICAgICAgICAgICAgIHxcbiAqIHwgbGVmdChhKSAgfCByaWdodCgyKSB8IHJpZ2h0KDIpICAgICAgICAgICAgIHxcbiAqIHwgcmlnaHQoMSkgfCBsZWZ0KGIpICB8IHJpZ2h0KDEpICAgICAgICAgICAgIHxcbiAqIHwgcmlnaHQoMSkgfCByaWdodCgyKSB8IHJpZ2h0KDEpICAgICAgICAgICAgIHxcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBFLmxlZnQoJ2EnKSxcbiAqICAgICBFLmFsdCgoKSA9PiBFLmxlZnQoJ2InKSlcbiAqICAgKSxcbiAqICAgRS5sZWZ0KCdiJylcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgRS5sZWZ0KCdhJyksXG4gKiAgICAgRS5hbHQoKCkgPT4gRS5yaWdodCgyKSlcbiAqICAgKSxcbiAqICAgRS5yaWdodCgyKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBFLnJpZ2h0KDEpLFxuICogICAgIEUuYWx0KCgpID0+IEUubGVmdCgnYicpKVxuICogICApLFxuICogICBFLnJpZ2h0KDEpXG4gKiApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIEUucmlnaHQoMSksXG4gKiAgICAgRS5hbHQoKCkgPT4gRS5yaWdodCgyKSlcbiAqICAgKSxcbiAqICAgRS5yaWdodCgxKVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBlcnJvciBoYW5kbGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgYWx0ID0gYWx0Vztcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgQWx0ID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcCxcbiAgICBhbHQ6IF9hbHRcbn07XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGV4dGVuZCA9IGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAod2EpIHtcbiAgICByZXR1cm4gaXNMZWZ0KHdhKSA/IHdhIDogcmlnaHQoZih3YSkpO1xufTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgRXh0ZW5kID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcCxcbiAgICBleHRlbmQ6IF9leHRlbmRcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIENoYWluUmVjID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcCxcbiAgICBhcDogX2FwLFxuICAgIGNoYWluOiBmbGF0TWFwLFxuICAgIGNoYWluUmVjOiBfY2hhaW5SZWNcbn07XG4vKipcbiAqIEBzaW5jZSAyLjYuM1xuICovXG5leHBvcnQgdmFyIHRocm93RXJyb3IgPSBsZWZ0O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBNb25hZFRocm93ID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcCxcbiAgICBhcDogX2FwLFxuICAgIG9mOiBvZixcbiAgICBjaGFpbjogZmxhdE1hcCxcbiAgICB0aHJvd0Vycm9yOiB0aHJvd0Vycm9yXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgRnJvbUVpdGhlciA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBmcm9tRWl0aGVyOiBpZGVudGl0eVxufTtcbi8qKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IGZyb21QcmVkaWNhdGUsIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgMSxcbiAqICAgICBmcm9tUHJlZGljYXRlKFxuICogICAgICAgKG4pID0+IG4gPiAwLFxuICogICAgICAgKCkgPT4gJ2Vycm9yJ1xuICogICAgIClcbiAqICAgKSxcbiAqICAgcmlnaHQoMSlcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgLTEsXG4gKiAgICAgZnJvbVByZWRpY2F0ZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIGxlZnQoJ2Vycm9yJylcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgbGlmdGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZnJvbVByZWRpY2F0ZSA9IC8qI19fUFVSRV9fKi8gZnJvbVByZWRpY2F0ZV8oRnJvbUVpdGhlcik7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb252ZXJzaW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBPIGZyb20gJ2ZwLXRzL09wdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIE8uc29tZSgxKSxcbiAqICAgICBFLmZyb21PcHRpb24oKCkgPT4gJ2Vycm9yJylcbiAqICAgKSxcbiAqICAgRS5yaWdodCgxKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBPLm5vbmUsXG4gKiAgICAgRS5mcm9tT3B0aW9uKCgpID0+ICdlcnJvcicpXG4gKiAgICksXG4gKiAgIEUubGVmdCgnZXJyb3InKVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBjb252ZXJzaW9uc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZnJvbU9wdGlvbiA9IFxuLyojX19QVVJFX18qLyBmcm9tT3B0aW9uXyhGcm9tRWl0aGVyKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHJlZmluZW1lbnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBlaXRoZXIgaXMgYW4gaW5zdGFuY2Ugb2YgYExlZnRgLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqXG4gKiBAY2F0ZWdvcnkgcmVmaW5lbWVudHNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGlzTGVmdCA9IF8uaXNMZWZ0O1xuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZWl0aGVyIGlzIGFuIGluc3RhbmNlIG9mIGBSaWdodGAsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICpcbiAqIEBjYXRlZ29yeSByZWZpbmVtZW50c1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgaXNSaWdodCA9IF8uaXNSaWdodDtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYG1hdGNoYF0oI21hdGNoKS5cbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgaGFuZGxlciByZXR1cm4gdHlwZXMgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQGNhdGVnb3J5IHBhdHRlcm4gbWF0Y2hpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBtYXRjaFcgPSBmdW5jdGlvbiAob25MZWZ0LCBvblJpZ2h0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKSA/IG9uTGVmdChtYS5sZWZ0KSA6IG9uUmlnaHQobWEucmlnaHQpO1xuICAgIH07XG59O1xuLyoqXG4gKiBBbGlhcyBvZiBbYG1hdGNoV2BdKCNtYXRjaHcpLlxuICpcbiAqIEBjYXRlZ29yeSBwYXR0ZXJuIG1hdGNoaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZm9sZFcgPSBtYXRjaFc7XG4vKipcbiAqIFRha2VzIHR3byBmdW5jdGlvbnMgYW5kIGFuIGBFaXRoZXJgIHZhbHVlLCBpZiB0aGUgdmFsdWUgaXMgYSBgTGVmdGAgdGhlIGlubmVyIHZhbHVlIGlzIGFwcGxpZWQgdG8gdGhlIGZpcnN0IGZ1bmN0aW9uLFxuICogaWYgdGhlIHZhbHVlIGlzIGEgYFJpZ2h0YCB0aGUgaW5uZXIgdmFsdWUgaXMgYXBwbGllZCB0byB0aGUgc2Vjb25kIGZ1bmN0aW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBtYXRjaCwgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogZnVuY3Rpb24gb25MZWZ0KGVycm9yczogQXJyYXk8c3RyaW5nPik6IHN0cmluZyB7XG4gKiAgIHJldHVybiBgRXJyb3JzOiAke2Vycm9ycy5qb2luKCcsICcpfWBcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBvblJpZ2h0KHZhbHVlOiBudW1iZXIpOiBzdHJpbmcge1xuICogICByZXR1cm4gYE9rOiAke3ZhbHVlfWBcbiAqIH1cbiAqXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgcmlnaHQoMSksXG4gKiAgICAgbWF0Y2gob25MZWZ0LCBvblJpZ2h0KVxuICogICApLFxuICogICAnT2s6IDEnXG4gKiApXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgbGVmdChbJ2Vycm9yIDEnLCAnZXJyb3IgMiddKSxcbiAqICAgICBtYXRjaChvbkxlZnQsIG9uUmlnaHQpXG4gKiAgICksXG4gKiAgICdFcnJvcnM6IGVycm9yIDEsIGVycm9yIDInXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IHBhdHRlcm4gbWF0Y2hpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBtYXRjaCA9IG1hdGNoVztcbi8qKlxuICogQWxpYXMgb2YgW2BtYXRjaGBdKCNtYXRjaCkuXG4gKlxuICogQGNhdGVnb3J5IHBhdHRlcm4gbWF0Y2hpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGZvbGQgPSBtYXRjaDtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGdldE9yRWxzZWBdKCNnZXRvcmVsc2UpLlxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBoYW5kbGVyIHJldHVybiB0eXBlIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBjYXRlZ29yeSBlcnJvciBoYW5kbGluZ1xuICogQHNpbmNlIDIuNi4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0T3JFbHNlVyA9IGZ1bmN0aW9uIChvbkxlZnQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG1hKSB7XG4gICAgICAgIHJldHVybiBpc0xlZnQobWEpID8gb25MZWZ0KG1hLmxlZnQpIDogbWEucmlnaHQ7XG4gICAgfTtcbn07XG4vKipcbiAqIFJldHVybnMgdGhlIHdyYXBwZWQgdmFsdWUgaWYgaXQncyBhIGBSaWdodGAgb3IgYSBkZWZhdWx0IHZhbHVlIGlmIGlzIGEgYExlZnRgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBnZXRPckVsc2UsIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgcmlnaHQoMSksXG4gKiAgICAgZ2V0T3JFbHNlKCgpID0+IDApXG4gKiAgICksXG4gKiAgIDFcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgbGVmdCgnZXJyb3InKSxcbiAqICAgICBnZXRPckVsc2UoKCkgPT4gMClcbiAqICAgKSxcbiAqICAgMFxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBlcnJvciBoYW5kbGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0T3JFbHNlID0gZ2V0T3JFbHNlVztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbWJpbmF0b3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBtYXBwaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZmxhcCA9IC8qI19fUFVSRV9fKi8gZmxhcF8oRnVuY3Rvcik7XG4vKipcbiAqIENvbWJpbmUgdHdvIGVmZmVjdGZ1bCBhY3Rpb25zLCBrZWVwaW5nIG9ubHkgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgYXBGaXJzdCA9IC8qI19fUFVSRV9fKi8gYXBGaXJzdF8oQXBwbHkpO1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgYXBGaXJzdGBdKCNhcGZpcnN0KVxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAc2luY2UgMi4xMi4wXG4gKi9cbmV4cG9ydCB2YXIgYXBGaXJzdFcgPSBhcEZpcnN0O1xuLyoqXG4gKiBDb21iaW5lIHR3byBlZmZlY3RmdWwgYWN0aW9ucywga2VlcGluZyBvbmx5IHRoZSByZXN1bHQgb2YgdGhlIHNlY29uZC5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBhcFNlY29uZCA9IC8qI19fUFVSRV9fKi8gYXBTZWNvbmRfKEFwcGx5KTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGFwU2Vjb25kYF0oI2Fwc2Vjb25kKVxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAc2luY2UgMi4xMi4wXG4gKi9cbmV4cG9ydCB2YXIgYXBTZWNvbmRXID0gYXBTZWNvbmQ7XG4vKipcbiAqIENvbXBvc2VzIGNvbXB1dGF0aW9ucyBpbiBzZXF1ZW5jZSwgdXNpbmcgdGhlIHJldHVybiB2YWx1ZSBvZiBvbmUgY29tcHV0YXRpb24gdG8gZGV0ZXJtaW5lIHRoZSBuZXh0IGNvbXB1dGF0aW9uIGFuZFxuICoga2VlcGluZyBvbmx5IHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0LlxuICpcbiAqIEBjYXRlZ29yeSBzZXF1ZW5jaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBjaGFpbkZpcnN0ID0gXG4vKiNfX1BVUkVfXyovIGNoYWluRmlyc3RfKENoYWluKTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGNoYWluRmlyc3RgXSgjY2hhaW5maXJzdClcbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgZXJyb3IgdHlwZXMgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQGNhdGVnb3J5IHNlcXVlbmNpbmdcbiAqIEBzaW5jZSAyLjguMFxuICovXG5leHBvcnQgdmFyIGNoYWluRmlyc3RXID0gY2hhaW5GaXJzdDtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGZsYXR0ZW5gXSgjZmxhdHRlbikuXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIGVycm9yIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBjYXRlZ29yeSBzZXF1ZW5jaW5nXG4gKiBAc2luY2UgMi4xMS4wXG4gKi9cbmV4cG9ydCB2YXIgZmxhdHRlblcgPSBcbi8qI19fUFVSRV9fKi8gY2hhaW5XKGlkZW50aXR5KTtcbi8qKlxuICogVGhlIGBmbGF0dGVuYCBmdW5jdGlvbiBpcyB0aGUgY29udmVudGlvbmFsIG1vbmFkIGpvaW4gb3BlcmF0b3IuIEl0IGlzIHVzZWQgdG8gcmVtb3ZlIG9uZSBsZXZlbCBvZiBtb25hZGljIHN0cnVjdHVyZSwgcHJvamVjdGluZyBpdHMgYm91bmQgYXJndW1lbnQgaW50byB0aGUgb3V0ZXIgbGV2ZWwuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoRS5mbGF0dGVuKEUucmlnaHQoRS5yaWdodCgnYScpKSksIEUucmlnaHQoJ2EnKSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoRS5mbGF0dGVuKEUucmlnaHQoRS5sZWZ0KCdlJykpKSwgRS5sZWZ0KCdlJykpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKEUuZmxhdHRlbihFLmxlZnQoJ2UnKSksIEUubGVmdCgnZScpKVxuICpcbiAqIEBjYXRlZ29yeSBzZXF1ZW5jaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBmbGF0dGVuID0gZmxhdHRlblc7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGR1cGxpY2F0ZSA9IC8qI19fUFVSRV9fKi8gZXh0ZW5kKGlkZW50aXR5KTtcbi8qKlxuICogQGNhdGVnb3J5IGxpZnRpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBmcm9tT3B0aW9uSyA9IFxuLyojX19QVVJFX18qLyBmcm9tT3B0aW9uS18oRnJvbUVpdGhlcik7XG4vKipcbiAqIEBjYXRlZ29yeSBzZXF1ZW5jaW5nXG4gKiBAc2luY2UgMi4xMS4wXG4gKi9cbmV4cG9ydCB2YXIgY2hhaW5PcHRpb25LID0gLyojX19QVVJFX18qLyBjaGFpbk9wdGlvbktfKEZyb21FaXRoZXIsIENoYWluKTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGNoYWluT3B0aW9uS2BdKCNjaGFpbm9wdGlvbmspLlxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgc2VxdWVuY2luZ1xuICogQHNpbmNlIDIuMTMuMlxuICovXG5leHBvcnQgdmFyIGNoYWluT3B0aW9uS1cgPSAvKiNfX1BVUkVfXyovIGNoYWluT3B0aW9uSztcbi8qKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgRS5yaWdodCgxKSxcbiAqICAgICBFLmZpbHRlck9yRWxzZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIEUucmlnaHQoMSlcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgRS5yaWdodCgtMSksXG4gKiAgICAgRS5maWx0ZXJPckVsc2UoXG4gKiAgICAgICAobikgPT4gbiA+IDAsXG4gKiAgICAgICAoKSA9PiAnZXJyb3InXG4gKiAgICAgKVxuICogICApLFxuICogICBFLmxlZnQoJ2Vycm9yJylcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgRS5sZWZ0KCdhJyksXG4gKiAgICAgRS5maWx0ZXJPckVsc2UoXG4gKiAgICAgICAobikgPT4gbiA+IDAsXG4gKiAgICAgICAoKSA9PiAnZXJyb3InXG4gKiAgICAgKVxuICogICApLFxuICogICBFLmxlZnQoJ2EnKVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBmaWx0ZXJpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGZpbHRlck9yRWxzZSA9IC8qI19fUFVSRV9fKi8gZmlsdGVyT3JFbHNlXyhGcm9tRWl0aGVyLCBDaGFpbik7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BmaWx0ZXJPckVsc2VgXSgjZmlsdGVyb3JlbHNlKS5cbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgZXJyb3IgdHlwZXMgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQGNhdGVnb3J5IGZpbHRlcmluZ1xuICogQHNpbmNlIDIuOS4wXG4gKi9cbmV4cG9ydCB2YXIgZmlsdGVyT3JFbHNlVyA9IGZpbHRlck9yRWxzZTtcbi8qKlxuICogUmV0dXJucyBhIGBSaWdodGAgaWYgaXMgYSBgTGVmdGAgKGFuZCB2aWNlIHZlcnNhKS5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBzd2FwID0gZnVuY3Rpb24gKG1hKSB7IHJldHVybiAoaXNMZWZ0KG1hKSA/IHJpZ2h0KG1hLmxlZnQpIDogbGVmdChtYS5yaWdodCkpOyB9O1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgb3JFbHNlYF0oI29yZWxzZSkuXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIHJldHVybiB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgZXJyb3IgaGFuZGxpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBvckVsc2VXID0gZnVuY3Rpb24gKG9uTGVmdCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVmdChtYSkgPyBvbkxlZnQobWEubGVmdCkgOiBtYTtcbiAgICB9O1xufTtcbi8qKlxuICogVXNlZnVsIGZvciByZWNvdmVyaW5nIGZyb20gZXJyb3JzLlxuICpcbiAqIEBjYXRlZ29yeSBlcnJvciBoYW5kbGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgb3JFbHNlID0gb3JFbHNlVztcbi8qKlxuICogVGFrZXMgYSBkZWZhdWx0IGFuZCBhIG51bGxhYmxlIHZhbHVlLCBpZiB0aGUgdmFsdWUgaXMgbm90IG51bGx5LCB0dXJuIGl0IGludG8gYSBgUmlnaHRgLCBpZiB0aGUgdmFsdWUgaXMgbnVsbHkgdXNlXG4gKiB0aGUgcHJvdmlkZWQgZGVmYXVsdCBhcyBhIGBMZWZ0YC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZnJvbU51bGxhYmxlLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBwYXJzZSA9IGZyb21OdWxsYWJsZSgnbnVsbHknKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwocGFyc2UoMSksIHJpZ2h0KDEpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwYXJzZShudWxsKSwgbGVmdCgnbnVsbHknKSlcbiAqXG4gKiBAY2F0ZWdvcnkgY29udmVyc2lvbnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGZyb21OdWxsYWJsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiBhID09IG51bGwgPyBsZWZ0KGUpIDogcmlnaHQoYSk7XG4gICAgfTtcbn07XG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlcmAgZnJvbSBhIGZ1bmN0aW9uIHRoYXQgbWlnaHQgdGhyb3cuXG4gKlxuICogU2VlIGFsc28gW2B0cnlDYXRjaEtgXSgjdHJ5Y2F0Y2hrKS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKlxuICogY29uc3QgdW5zYWZlSGVhZCA9IDxBPihhczogUmVhZG9ubHlBcnJheTxBPik6IEEgPT4ge1xuICogICBpZiAoYXMubGVuZ3RoID4gMCkge1xuICogICAgIHJldHVybiBhc1swXVxuICogICB9IGVsc2Uge1xuICogICAgIHRocm93IG5ldyBFcnJvcignZW1wdHkgYXJyYXknKVxuICogICB9XG4gKiB9XG4gKlxuICogY29uc3QgaGVhZCA9IDxBPihhczogUmVhZG9ubHlBcnJheTxBPik6IEUuRWl0aGVyPEVycm9yLCBBPiA9PlxuICogICBFLnRyeUNhdGNoKCgpID0+IHVuc2FmZUhlYWQoYXMpLCBlID0+IChlIGluc3RhbmNlb2YgRXJyb3IgPyBlIDogbmV3IEVycm9yKCd1bmtub3duIGVycm9yJykpKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoaGVhZChbXSksIEUubGVmdChuZXcgRXJyb3IoJ2VtcHR5IGFycmF5JykpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChoZWFkKFsxLCAyLCAzXSksIEUucmlnaHQoMSkpXG4gKlxuICogQGNhdGVnb3J5IGludGVyb3BcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIHRyeUNhdGNoID0gZnVuY3Rpb24gKGYsIG9uVGhyb3cpIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gcmlnaHQoZigpKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQob25UaHJvdyhlKSk7XG4gICAgfVxufTtcbi8qKlxuICogQ29udmVydHMgYSBmdW5jdGlvbiB0aGF0IG1heSB0aHJvdyB0byBvbmUgcmV0dXJuaW5nIGEgYEVpdGhlcmAuXG4gKlxuICogQGNhdGVnb3J5IGludGVyb3BcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciB0cnlDYXRjaEsgPSBmdW5jdGlvbiAoZiwgb25UaHJvdykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRyeUNhdGNoKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGYuYXBwbHkodm9pZCAwLCBhKTsgfSwgb25UaHJvdyk7XG4gICAgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBsaWZ0aW5nXG4gKiBAc2luY2UgMi45LjBcbiAqL1xuZXhwb3J0IHZhciBmcm9tTnVsbGFibGVLID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgZnJvbSA9IGZyb21OdWxsYWJsZShlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZsb3coZiwgZnJvbSk7IH07XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgc2VxdWVuY2luZ1xuICogQHNpbmNlIDIuOS4wXG4gKi9cbmV4cG9ydCB2YXIgY2hhaW5OdWxsYWJsZUsgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBmcm9tID0gZnJvbU51bGxhYmxlSyhlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGNoYWluKGZyb20oZikpOyB9O1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbnZlcnNpb25zXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgdG9VbmlvbiA9IC8qI19fUFVSRV9fKi8gZm9sZFcoaWRlbnRpdHksIGlkZW50aXR5KTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIERlZmF1bHQgdmFsdWUgZm9yIHRoZSBgb25FcnJvcmAgYXJndW1lbnQgb2YgYHRyeUNhdGNoYFxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9FcnJvcihlKSB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBFcnJvciA/IGUgOiBuZXcgRXJyb3IoU3RyaW5nKGUpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBlbGVtKEUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEsIG1hKSB7XG4gICAgICAgIGlmIChtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgZWxlbUVfMSA9IGVsZW0oRSk7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1hKSB7IHJldHVybiBlbGVtRV8xKGEsIG1hKTsgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKSA/IGZhbHNlIDogRS5lcXVhbHMoYSwgbWEucmlnaHQpO1xuICAgIH07XG59XG4vKipcbiAqIFJldHVybnMgYGZhbHNlYCBpZiBgTGVmdGAgb3IgcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSBhcHBsaWNhdGlvbiBvZiB0aGUgZ2l2ZW4gcHJlZGljYXRlIHRvIHRoZSBgUmlnaHRgIHZhbHVlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBleGlzdHMsIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICpcbiAqIGNvbnN0IGd0MiA9IGV4aXN0cygobjogbnVtYmVyKSA9PiBuID4gMilcbiAqXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoZ3QyKGxlZnQoJ2EnKSksIGZhbHNlKVxuICogYXNzZXJ0LnN0cmljdEVxdWFsKGd0MihyaWdodCgxKSksIGZhbHNlKVxuICogYXNzZXJ0LnN0cmljdEVxdWFsKGd0MihyaWdodCgzKSksIHRydWUpXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZXhpc3RzID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVmdChtYSkgPyBmYWxzZSA6IHByZWRpY2F0ZShtYS5yaWdodCk7XG4gICAgfTtcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBkbyBub3RhdGlvblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgZG8gbm90YXRpb25cbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnQgdmFyIERvID0gLyojX19QVVJFX18qLyBvZihfLmVtcHR5UmVjb3JkKTtcbi8qKlxuICogQGNhdGVnb3J5IGRvIG5vdGF0aW9uXG4gKiBAc2luY2UgMi44LjBcbiAqL1xuZXhwb3J0IHZhciBiaW5kVG8gPSAvKiNfX1BVUkVfXyovIGJpbmRUb18oRnVuY3Rvcik7XG52YXIgbGV0XyA9IC8qI19fUFVSRV9fKi8gbGV0X18oRnVuY3Rvcik7XG5leHBvcnQgeyBcbi8qKlxuICogQGNhdGVnb3J5IGRvIG5vdGF0aW9uXG4gKiBAc2luY2UgMi4xMy4wXG4gKi9cbmxldF8gYXMgbGV0IH07XG4vKipcbiAqIEBjYXRlZ29yeSBkbyBub3RhdGlvblxuICogQHNpbmNlIDIuOC4wXG4gKi9cbmV4cG9ydCB2YXIgYmluZCA9IC8qI19fUFVSRV9fKi8gYmluZF8oQ2hhaW4pO1xuLyoqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgZXJyb3IgdHlwZXMgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQGNhdGVnb3J5IGRvIG5vdGF0aW9uXG4gKiBAc2luY2UgMi44LjBcbiAqL1xuZXhwb3J0IHZhciBiaW5kVyA9IGJpbmQ7XG4vKipcbiAqIEBjYXRlZ29yeSBkbyBub3RhdGlvblxuICogQHNpbmNlIDIuOC4wXG4gKi9cbmV4cG9ydCB2YXIgYXBTID0gLyojX19QVVJFX18qLyBhcFNfKEFwcGx5KTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGFwU2BdKCNhcHMpLlxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgZG8gbm90YXRpb25cbiAqIEBzaW5jZSAyLjguMFxuICovXG5leHBvcnQgdmFyIGFwU1cgPSBhcFM7XG4vKipcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciBBcFQgPSAvKiNfX1BVUkVfXyovIG9mKF8uZW1wdHlSZWFkb25seUFycmF5KTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGFycmF5IHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gYFJlYWRvbmx5Tm9uRW1wdHlBcnJheSN0cmF2ZXJzZVdpdGhJbmRleChBcHBsaWNhdGl2ZSlgLlxuICpcbiAqIEBjYXRlZ29yeSB0cmF2ZXJzaW5nXG4gKiBAc2luY2UgMi4xMS4wXG4gKi9cbmV4cG9ydCB2YXIgdHJhdmVyc2VSZWFkb25seU5vbkVtcHR5QXJyYXlXaXRoSW5kZXggPSBmdW5jdGlvbiAoZikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYXMpIHtcbiAgICAgICAgdmFyIGUgPSBmKDAsIF8uaGVhZChhcykpO1xuICAgICAgICBpZiAoaXNMZWZ0KGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3V0ID0gW2UucmlnaHRdO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZV8xID0gZihpLCBhc1tpXSk7XG4gICAgICAgICAgICBpZiAoaXNMZWZ0KGVfMSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZV8xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0LnB1c2goZV8xLnJpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmlnaHQob3V0KTtcbiAgICB9O1xufTtcbi8qKlxuICogRXF1aXZhbGVudCB0byBgUmVhZG9ubHlBcnJheSN0cmF2ZXJzZVdpdGhJbmRleChBcHBsaWNhdGl2ZSlgLlxuICpcbiAqIEBjYXRlZ29yeSB0cmF2ZXJzaW5nXG4gKiBAc2luY2UgMi4xMS4wXG4gKi9cbmV4cG9ydCB2YXIgdHJhdmVyc2VSZWFkb25seUFycmF5V2l0aEluZGV4ID0gZnVuY3Rpb24gKGYpIHtcbiAgICB2YXIgZyA9IHRyYXZlcnNlUmVhZG9ubHlOb25FbXB0eUFycmF5V2l0aEluZGV4KGYpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoYXMpIHsgcmV0dXJuIChfLmlzTm9uRW1wdHkoYXMpID8gZyhhcykgOiBBcFQpOyB9O1xufTtcbi8qKlxuICogRXF1aXZhbGVudCB0byBgUmVhZG9ubHlBcnJheSN0cmF2ZXJzZVdpdGhJbmRleChBcHBsaWNhdGl2ZSlgLlxuICpcbiAqIEBjYXRlZ29yeSB0cmF2ZXJzaW5nXG4gKiBAc2luY2UgMi45LjBcbiAqL1xuZXhwb3J0IHZhciB0cmF2ZXJzZUFycmF5V2l0aEluZGV4ID0gdHJhdmVyc2VSZWFkb25seUFycmF5V2l0aEluZGV4O1xuLyoqXG4gKiBFcXVpdmFsZW50IHRvIGBSZWFkb25seUFycmF5I3RyYXZlcnNlKEFwcGxpY2F0aXZlKWAuXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnQgdmFyIHRyYXZlcnNlQXJyYXkgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gdHJhdmVyc2VSZWFkb25seUFycmF5V2l0aEluZGV4KGZ1bmN0aW9uIChfLCBhKSB7IHJldHVybiBmKGEpOyB9KTsgfTtcbi8qKlxuICogRXF1aXZhbGVudCB0byBgUmVhZG9ubHlBcnJheSNzZXF1ZW5jZShBcHBsaWNhdGl2ZSlgLlxuICpcbiAqIEBjYXRlZ29yeSB0cmF2ZXJzaW5nXG4gKiBAc2luY2UgMi45LjBcbiAqL1xuZXhwb3J0IHZhciBzZXF1ZW5jZUFycmF5ID0gXG4vKiNfX1BVUkVfXyovIHRyYXZlcnNlQXJyYXkoaWRlbnRpdHkpO1xuLyoqXG4gKiBVc2UgW2BwYXJzZWBdKC4vSnNvbi50cy5odG1sI3BhcnNlKSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUpTT04ocywgb25FcnJvcikge1xuICAgIHJldHVybiB0cnlDYXRjaChmdW5jdGlvbiAoKSB7IHJldHVybiBKU09OLnBhcnNlKHMpOyB9LCBvbkVycm9yKTtcbn1cbi8qKlxuICogVXNlIFtgc3RyaW5naWZ5YF0oLi9Kc29uLnRzLmh0bWwjc3RyaW5naWZ5KSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgc3RyaW5naWZ5SlNPTiA9IGZ1bmN0aW9uICh1LCBvbkVycm9yKSB7XG4gICAgcmV0dXJuIHRyeUNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHMgPSBKU09OLnN0cmluZ2lmeSh1KTtcbiAgICAgICAgaWYgKHR5cGVvZiBzICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb252ZXJ0aW5nIHVuc3VwcG9ydGVkIHN0cnVjdHVyZSB0byBKU09OJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfSwgb25FcnJvcik7XG59O1xuLyoqXG4gKiBUaGlzIGluc3RhbmNlIGlzIGRlcHJlY2F0ZWQsIHVzZSBzbWFsbCwgc3BlY2lmaWMgaW5zdGFuY2VzIGluc3RlYWQuXG4gKiBGb3IgZXhhbXBsZSBpZiBhIGZ1bmN0aW9uIG5lZWRzIGEgYEZ1bmN0b3JgIGluc3RhbmNlLCBwYXNzIGBFLkZ1bmN0b3JgIGluc3RlYWQgb2YgYEUuZWl0aGVyYFxuICogKHdoZXJlIGBFYCBpcyBmcm9tIGBpbXBvcnQgRSBmcm9tICdmcC10cy9FaXRoZXInYClcbiAqXG4gKiBAY2F0ZWdvcnkgem9uZSBvZiBkZWF0aFxuICogQHNpbmNlIDIuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgdmFyIGVpdGhlciA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgb2Y6IG9mLFxuICAgIGFwOiBfYXAsXG4gICAgY2hhaW46IGZsYXRNYXAsXG4gICAgcmVkdWNlOiBfcmVkdWNlLFxuICAgIGZvbGRNYXA6IF9mb2xkTWFwLFxuICAgIHJlZHVjZVJpZ2h0OiBfcmVkdWNlUmlnaHQsXG4gICAgdHJhdmVyc2U6IF90cmF2ZXJzZSxcbiAgICBzZXF1ZW5jZTogc2VxdWVuY2UsXG4gICAgYmltYXA6IF9iaW1hcCxcbiAgICBtYXBMZWZ0OiBfbWFwTGVmdCxcbiAgICBhbHQ6IF9hbHQsXG4gICAgZXh0ZW5kOiBfZXh0ZW5kLFxuICAgIGNoYWluUmVjOiBfY2hhaW5SZWMsXG4gICAgdGhyb3dFcnJvcjogdGhyb3dFcnJvclxufTtcbi8qKlxuICogVXNlIFtgZ2V0QXBwbHlTZW1pZ3JvdXBgXSguL0FwcGx5LnRzLmh0bWwjZ2V0YXBwbHlzZW1pZ3JvdXApIGluc3RlYWQuXG4gKlxuICogU2VtaWdyb3VwIHJldHVybmluZyB0aGUgbGVmdC1tb3N0IGBMZWZ0YCB2YWx1ZS4gSWYgYm90aCBvcGVyYW5kcyBhcmUgYFJpZ2h0YHMgdGhlbiB0aGUgaW5uZXIgdmFsdWVzXG4gKiBhcmUgY29uY2F0ZW5hdGVkIHVzaW5nIHRoZSBwcm92aWRlZCBgU2VtaWdyb3VwYFxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZ2V0QXBwbHlTZW1pZ3JvdXAgPSBcbi8qI19fUFVSRV9fKi8gZ2V0QXBwbHlTZW1pZ3JvdXBfKEFwcGx5KTtcbi8qKlxuICogVXNlIFtgZ2V0QXBwbGljYXRpdmVNb25vaWRgXSguL0FwcGxpY2F0aXZlLnRzLmh0bWwjZ2V0YXBwbGljYXRpdmVtb25vaWQpIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciBnZXRBcHBseU1vbm9pZCA9IFxuLyojX19QVVJFX18qLyBnZXRBcHBsaWNhdGl2ZU1vbm9pZChBcHBsaWNhdGl2ZSk7XG4vKipcbiAqIFVzZSBbYGdldEFwcGx5U2VtaWdyb3VwYF0oLi9BcHBseS50cy5odG1sI2dldGFwcGx5c2VtaWdyb3VwKSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZ2V0VmFsaWRhdGlvblNlbWlncm91cCA9IGZ1bmN0aW9uIChTRSwgU0EpIHtcbiAgICByZXR1cm4gZ2V0QXBwbHlTZW1pZ3JvdXBfKGdldEFwcGxpY2F0aXZlVmFsaWRhdGlvbihTRSkpKFNBKTtcbn07XG4vKipcbiAqIFVzZSBbYGdldEFwcGxpY2F0aXZlTW9ub2lkYF0oLi9BcHBsaWNhdGl2ZS50cy5odG1sI2dldGFwcGxpY2F0aXZlbW9ub2lkKSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZ2V0VmFsaWRhdGlvbk1vbm9pZCA9IGZ1bmN0aW9uIChTRSwgTUEpIHtcbiAgICByZXR1cm4gZ2V0QXBwbGljYXRpdmVNb25vaWQoZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uKFNFKSkoTUEpO1xufTtcbi8qKlxuICogVXNlIFtgZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uYF0oI2dldGFwcGxpY2F0aXZldmFsaWRhdGlvbikgYW5kIFtgZ2V0QWx0VmFsaWRhdGlvbmBdKCNnZXRhbHR2YWxpZGF0aW9uKSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZGF0aW9uKFNFKSB7XG4gICAgdmFyIGFwID0gZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uKFNFKS5hcDtcbiAgICB2YXIgYWx0ID0gZ2V0QWx0VmFsaWRhdGlvbihTRSkuYWx0O1xuICAgIHJldHVybiB7XG4gICAgICAgIFVSSTogVVJJLFxuICAgICAgICBfRTogdW5kZWZpbmVkLFxuICAgICAgICBtYXA6IF9tYXAsXG4gICAgICAgIG9mOiBvZixcbiAgICAgICAgY2hhaW46IGZsYXRNYXAsXG4gICAgICAgIGJpbWFwOiBfYmltYXAsXG4gICAgICAgIG1hcExlZnQ6IF9tYXBMZWZ0LFxuICAgICAgICByZWR1Y2U6IF9yZWR1Y2UsXG4gICAgICAgIGZvbGRNYXA6IF9mb2xkTWFwLFxuICAgICAgICByZWR1Y2VSaWdodDogX3JlZHVjZVJpZ2h0LFxuICAgICAgICBleHRlbmQ6IF9leHRlbmQsXG4gICAgICAgIHRyYXZlcnNlOiBfdHJhdmVyc2UsXG4gICAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSxcbiAgICAgICAgY2hhaW5SZWM6IF9jaGFpblJlYyxcbiAgICAgICAgdGhyb3dFcnJvcjogdGhyb3dFcnJvcixcbiAgICAgICAgYXA6IGFwLFxuICAgICAgICBhbHQ6IGFsdFxuICAgIH07XG59XG4iLCIvKipcbiAqIFRoZSBgRnJvbUVpdGhlcmAgdHlwZSBjbGFzcyByZXByZXNlbnRzIHRob3NlIGRhdGEgdHlwZXMgd2hpY2ggc3VwcG9ydCBlcnJvcnMuXG4gKlxuICogQHNpbmNlIDIuMTAuMFxuICovXG5pbXBvcnQgeyBjaGFpbkZpcnN0IH0gZnJvbSAnLi9DaGFpbic7XG5pbXBvcnQgeyBmbG93IH0gZnJvbSAnLi9mdW5jdGlvbic7XG5pbXBvcnQgKiBhcyBfIGZyb20gJy4vaW50ZXJuYWwnO1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21PcHRpb24oRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAob25Ob25lKSB7IHJldHVybiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIEYuZnJvbUVpdGhlcihfLmlzTm9uZShtYSkgPyBfLmxlZnQob25Ob25lKCkpIDogXy5yaWdodChtYS52YWx1ZSkpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZyb21QcmVkaWNhdGUoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAocHJlZGljYXRlLCBvbkZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIEYuZnJvbUVpdGhlcihwcmVkaWNhdGUoYSkgPyBfLnJpZ2h0KGEpIDogXy5sZWZ0KG9uRmFsc2UoYSkpKTtcbiAgICAgICAgfTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZyb21PcHRpb25LKEYpIHtcbiAgICB2YXIgZnJvbU9wdGlvbkYgPSBmcm9tT3B0aW9uKEYpO1xuICAgIHJldHVybiBmdW5jdGlvbiAob25Ob25lKSB7XG4gICAgICAgIHZhciBmcm9tID0gZnJvbU9wdGlvbkYob25Ob25lKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmbG93KGYsIGZyb20pOyB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gY2hhaW5PcHRpb25LKEYsIE0pIHtcbiAgICB2YXIgZnJvbU9wdGlvbktGID0gZnJvbU9wdGlvbksoRik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbk5vbmUpIHtcbiAgICAgICAgdmFyIGZyb20gPSBmcm9tT3B0aW9uS0Yob25Ob25lKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIE0uY2hhaW4obWEsIGZyb20oZikpOyB9OyB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbUVpdGhlcksoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZmxvdyhmLCBGLmZyb21FaXRoZXIpOyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNoYWluRWl0aGVySyhGLCBNKSB7XG4gICAgdmFyIGZyb21FaXRoZXJLRiA9IGZyb21FaXRoZXJLKEYpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKG1hKSB7IHJldHVybiBNLmNoYWluKG1hLCBmcm9tRWl0aGVyS0YoZikpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNoYWluRmlyc3RFaXRoZXJLKEYsIE0pIHtcbiAgICByZXR1cm4gZmxvdyhmcm9tRWl0aGVySyhGKSwgY2hhaW5GaXJzdChNKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyT3JFbHNlKEYsIE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHByZWRpY2F0ZSwgb25GYWxzZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1hKSB7XG4gICAgICAgICAgICByZXR1cm4gTS5jaGFpbihtYSwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIEYuZnJvbUVpdGhlcihwcmVkaWNhdGUoYSkgPyBfLnJpZ2h0KGEpIDogXy5sZWZ0KG9uRmFsc2UoYSkpKTsgfSk7XG4gICAgICAgIH07XG4gICAgfTtcbn1cbiIsIi8qKlxuICogQSBgRnVuY3RvcmAgaXMgYSB0eXBlIGNvbnN0cnVjdG9yIHdoaWNoIHN1cHBvcnRzIGEgbWFwcGluZyBvcGVyYXRpb24gYG1hcGAuXG4gKlxuICogYG1hcGAgY2FuIGJlIHVzZWQgdG8gdHVybiBmdW5jdGlvbnMgYGEgLT4gYmAgaW50byBmdW5jdGlvbnMgYGYgYSAtPiBmIGJgIHdob3NlIGFyZ3VtZW50IGFuZCByZXR1cm4gdHlwZXMgdXNlIHRoZSB0eXBlXG4gKiBjb25zdHJ1Y3RvciBgZmAgdG8gcmVwcmVzZW50IHNvbWUgY29tcHV0YXRpb25hbCBjb250ZXh0LlxuICpcbiAqIEluc3RhbmNlcyBtdXN0IHNhdGlzZnkgdGhlIGZvbGxvd2luZyBsYXdzOlxuICpcbiAqIDEuIElkZW50aXR5OiBgRi5tYXAoZmEsIGEgPT4gYSkgPC0+IGZhYFxuICogMi4gQ29tcG9zaXRpb246IGBGLm1hcChmYSwgYSA9PiBiYyhhYihhKSkpIDwtPiBGLm1hcChGLm1hcChmYSwgYWIpLCBiYylgXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmltcG9ydCB7IHBpcGUgfSBmcm9tICcuL2Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBtYXAoRiwgRykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLm1hcChmYSwgZnVuY3Rpb24gKGdhKSB7IHJldHVybiBHLm1hcChnYSwgZik7IH0pOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZsYXAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZnVuY3Rpb24gKGZhYikgeyByZXR1cm4gRi5tYXAoZmFiLCBmdW5jdGlvbiAoZikgeyByZXR1cm4gZihhKTsgfSk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gYmluZFRvKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5tYXAoZmEsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIChfYSA9IHt9LCBfYVtuYW1lXSA9IGEsIF9hKTtcbiAgICB9KTsgfTsgfTtcbn1cbmZ1bmN0aW9uIGxldF8oRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLm1hcChmYSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYSwgKF9hID0ge30sIF9hW25hbWVdID0gZihhKSwgX2EpKTtcbiAgICB9KTsgfTsgfTtcbn1cbmV4cG9ydCB7IFxuLyoqXG4gKiBAc2luY2UgMi4xMy4wXG4gKi9cbmxldF8gYXMgbGV0IH07XG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jdG9yQ29tcG9zaXRpb24oRiwgRykge1xuICAgIHZhciBfbWFwID0gbWFwKEYsIEcpO1xuICAgIHJldHVybiB7XG4gICAgICAgIG1hcDogZnVuY3Rpb24gKGZnYSwgZikgeyByZXR1cm4gcGlwZShmZ2EsIF9tYXAoZikpOyB9XG4gICAgfTtcbn1cbiIsIi8qKlxuICogYGBgdHNcbiAqIGludGVyZmFjZSBTZXBhcmF0ZWQ8RSwgQT4ge1xuICogICAgcmVhZG9ubHkgbGVmdDogRVxuICogICAgcmVhZG9ubHkgcmlnaHQ6IEFcbiAqIH1cbiAqIGBgYFxuICpcbiAqIFJlcHJlc2VudHMgYSByZXN1bHQgb2Ygc2VwYXJhdGluZyBhIHdob2xlIGludG8gdHdvIHBhcnRzLlxuICpcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJy4vZnVuY3Rpb24nO1xuaW1wb3J0IHsgZmxhcCBhcyBmbGFwXyB9IGZyb20gJy4vRnVuY3Rvcic7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdHJ1Y3RvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIHNlcGFyYXRlZCA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gKHsgbGVmdDogbGVmdCwgcmlnaHQ6IHJpZ2h0IH0pOyB9O1xudmFyIF9tYXAgPSBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIG1hcChmKSk7IH07XG52YXIgX21hcExlZnQgPSBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIG1hcExlZnQoZikpOyB9O1xudmFyIF9iaW1hcCA9IGZ1bmN0aW9uIChmYSwgZywgZikgeyByZXR1cm4gcGlwZShmYSwgYmltYXAoZywgZikpOyB9O1xuLyoqXG4gKiBgbWFwYCBjYW4gYmUgdXNlZCB0byB0dXJuIGZ1bmN0aW9ucyBgKGE6IEEpID0+IEJgIGludG8gZnVuY3Rpb25zIGAoZmE6IEY8QT4pID0+IEY8Qj5gIHdob3NlIGFyZ3VtZW50IGFuZCByZXR1cm4gdHlwZXNcbiAqIHVzZSB0aGUgdHlwZSBjb25zdHJ1Y3RvciBgRmAgdG8gcmVwcmVzZW50IHNvbWUgY29tcHV0YXRpb25hbCBjb250ZXh0LlxuICpcbiAqIEBjYXRlZ29yeSBtYXBwaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgbWFwID0gZnVuY3Rpb24gKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgICAgIHJldHVybiBzZXBhcmF0ZWQobGVmdChmYSksIGYocmlnaHQoZmEpKSk7XG4gICAgfTtcbn07XG4vKipcbiAqIE1hcCBhIGZ1bmN0aW9uIG92ZXIgdGhlIGZpcnN0IHR5cGUgYXJndW1lbnQgb2YgYSBiaWZ1bmN0b3IuXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgbWFwTGVmdCA9IGZ1bmN0aW9uIChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgICAgICByZXR1cm4gc2VwYXJhdGVkKGYobGVmdChmYSkpLCByaWdodChmYSkpO1xuICAgIH07XG59O1xuLyoqXG4gKiBNYXAgYSBwYWlyIG9mIGZ1bmN0aW9ucyBvdmVyIHRoZSB0d28gdHlwZSBhcmd1bWVudHMgb2YgdGhlIGJpZnVuY3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgbWFwcGluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIGJpbWFwID0gZnVuY3Rpb24gKGYsIGcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgICAgIHJldHVybiBzZXBhcmF0ZWQoZihsZWZ0KGZhKSksIGcocmlnaHQoZmEpKSk7XG4gICAgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSB0eXBlIGxhbWJkYXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBVUkkgPSAnU2VwYXJhdGVkJztcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIEJpZnVuY3RvciA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXBMZWZ0OiBfbWFwTGVmdCxcbiAgICBiaW1hcDogX2JpbWFwXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgRnVuY3RvciA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXBcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBtYXBwaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZmxhcCA9IC8qI19fUFVSRV9fKi8gZmxhcF8oRnVuY3Rvcik7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB1dGlsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgbGVmdCA9IGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLmxlZnQ7IH07XG4vKipcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciByaWdodCA9IGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLnJpZ2h0OyB9O1xuIiwiaW1wb3J0ICogYXMgXyBmcm9tICcuL2ludGVybmFsJztcbmV4cG9ydCBmdW5jdGlvbiB3aWx0RGVmYXVsdChULCBDKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChGKSB7XG4gICAgICAgIHZhciB0cmF2ZXJzZUYgPSBULnRyYXZlcnNlKEYpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHdhLCBmKSB7IHJldHVybiBGLm1hcCh0cmF2ZXJzZUYod2EsIGYpLCBDLnNlcGFyYXRlKTsgfTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhlckRlZmF1bHQoVCwgQykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoRikge1xuICAgICAgICB2YXIgdHJhdmVyc2VGID0gVC50cmF2ZXJzZShGKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh3YSwgZikgeyByZXR1cm4gRi5tYXAodHJhdmVyc2VGKHdhLCBmKSwgQy5jb21wYWN0KTsgfTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckUoVykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoRikge1xuICAgICAgICB2YXIgd2l0aGVyRiA9IFcud2l0aGVyKEYpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHByZWRpY2F0ZSkgeyByZXR1cm4gZnVuY3Rpb24gKGdhKSB7IHJldHVybiB3aXRoZXJGKGdhLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gRi5tYXAocHJlZGljYXRlKGEpLCBmdW5jdGlvbiAoYikgeyByZXR1cm4gKGIgPyBfLnNvbWUoYSkgOiBfLm5vbmUpOyB9KTsgfSk7IH07IH07XG4gICAgfTtcbn1cbiIsInZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGluc3RhbmNlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0Qm9vbGVhbkFsZ2VicmEgPSBmdW5jdGlvbiAoQikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgICAgICBtZWV0OiBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIEIubWVldCh4KGEpLCB5KGEpKTsgfTsgfSxcbiAgICAgICAgam9pbjogZnVuY3Rpb24gKHgsIHkpIHsgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBCLmpvaW4oeChhKSwgeShhKSk7IH07IH0sXG4gICAgICAgIHplcm86IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEIuemVybzsgfSxcbiAgICAgICAgb25lOiBmdW5jdGlvbiAoKSB7IHJldHVybiBCLm9uZTsgfSxcbiAgICAgICAgaW1wbGllczogZnVuY3Rpb24gKHgsIHkpIHsgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBCLmltcGxpZXMoeChhKSwgeShhKSk7IH07IH0sXG4gICAgICAgIG5vdDogZnVuY3Rpb24gKHgpIHsgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBCLm5vdCh4KGEpKTsgfTsgfVxuICAgIH0pOyB9O1xufTtcbi8qKlxuICogVW5hcnkgZnVuY3Rpb25zIGZvcm0gYSBzZW1pZ3JvdXAgYXMgbG9uZyBhcyB5b3UgY2FuIHByb3ZpZGUgYSBzZW1pZ3JvdXAgZm9yIHRoZSBjb2RvbWFpbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgUHJlZGljYXRlLCBnZXRTZW1pZ3JvdXAgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIEIgZnJvbSAnZnAtdHMvYm9vbGVhbidcbiAqXG4gKiBjb25zdCBmOiBQcmVkaWNhdGU8bnVtYmVyPiA9IChuKSA9PiBuIDw9IDJcbiAqIGNvbnN0IGc6IFByZWRpY2F0ZTxudW1iZXI+ID0gKG4pID0+IG4gPj0gMFxuICpcbiAqIGNvbnN0IFMxID0gZ2V0U2VtaWdyb3VwKEIuU2VtaWdyb3VwQWxsKTxudW1iZXI+KClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMxLmNvbmNhdChmLCBnKSgxKSwgdHJ1ZSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoUzEuY29uY2F0KGYsIGcpKDMpLCBmYWxzZSlcbiAqXG4gKiBjb25zdCBTMiA9IGdldFNlbWlncm91cChCLlNlbWlncm91cEFueSk8bnVtYmVyPigpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTMi5jb25jYXQoZiwgZykoMSksIHRydWUpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMyLmNvbmNhdChmLCBnKSgzKSwgdHJ1ZSlcbiAqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0U2VtaWdyb3VwID0gZnVuY3Rpb24gKFMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICAgICAgY29uY2F0OiBmdW5jdGlvbiAoZiwgZykgeyByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIFMuY29uY2F0KGYoYSksIGcoYSkpOyB9OyB9XG4gICAgfSk7IH07XG59O1xuLyoqXG4gKiBVbmFyeSBmdW5jdGlvbnMgZm9ybSBhIG1vbm9pZCBhcyBsb25nIGFzIHlvdSBjYW4gcHJvdmlkZSBhIG1vbm9pZCBmb3IgdGhlIGNvZG9tYWluLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBQcmVkaWNhdGUgfSBmcm9tICdmcC10cy9QcmVkaWNhdGUnXG4gKiBpbXBvcnQgeyBnZXRNb25vaWQgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIEIgZnJvbSAnZnAtdHMvYm9vbGVhbidcbiAqXG4gKiBjb25zdCBmOiBQcmVkaWNhdGU8bnVtYmVyPiA9IChuKSA9PiBuIDw9IDJcbiAqIGNvbnN0IGc6IFByZWRpY2F0ZTxudW1iZXI+ID0gKG4pID0+IG4gPj0gMFxuICpcbiAqIGNvbnN0IE0xID0gZ2V0TW9ub2lkKEIuTW9ub2lkQWxsKTxudW1iZXI+KClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKE0xLmNvbmNhdChmLCBnKSgxKSwgdHJ1ZSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoTTEuY29uY2F0KGYsIGcpKDMpLCBmYWxzZSlcbiAqXG4gKiBjb25zdCBNMiA9IGdldE1vbm9pZChCLk1vbm9pZEFueSk8bnVtYmVyPigpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChNMi5jb25jYXQoZiwgZykoMSksIHRydWUpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKE0yLmNvbmNhdChmLCBnKSgzKSwgdHJ1ZSlcbiAqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0TW9ub2lkID0gZnVuY3Rpb24gKE0pIHtcbiAgICB2YXIgZ2V0U2VtaWdyb3VwTSA9IGdldFNlbWlncm91cChNKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICAgICAgY29uY2F0OiBnZXRTZW1pZ3JvdXBNKCkuY29uY2F0LFxuICAgICAgICBlbXB0eTogZnVuY3Rpb24gKCkgeyByZXR1cm4gTS5lbXB0eTsgfVxuICAgIH0pOyB9O1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIGdldFNlbWlyaW5nID0gZnVuY3Rpb24gKFMpIHsgcmV0dXJuICh7XG4gICAgYWRkOiBmdW5jdGlvbiAoZiwgZykgeyByZXR1cm4gZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFMuYWRkKGYoeCksIGcoeCkpOyB9OyB9LFxuICAgIHplcm86IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFMuemVybzsgfSxcbiAgICBtdWw6IGZ1bmN0aW9uIChmLCBnKSB7IHJldHVybiBmdW5jdGlvbiAoeCkgeyByZXR1cm4gUy5tdWwoZih4KSwgZyh4KSk7IH07IH0sXG4gICAgb25lOiBmdW5jdGlvbiAoKSB7IHJldHVybiBTLm9uZTsgfVxufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRSaW5nID0gZnVuY3Rpb24gKFIpIHtcbiAgICB2YXIgUyA9IGdldFNlbWlyaW5nKFIpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGFkZDogUy5hZGQsXG4gICAgICAgIG11bDogUy5tdWwsXG4gICAgICAgIG9uZTogUy5vbmUsXG4gICAgICAgIHplcm86IFMuemVybyxcbiAgICAgICAgc3ViOiBmdW5jdGlvbiAoZiwgZykgeyByZXR1cm4gZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFIuc3ViKGYoeCksIGcoeCkpOyB9OyB9XG4gICAgfTtcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB1dGlsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAc2luY2UgMi4xMS4wXG4gKi9cbmV4cG9ydCB2YXIgYXBwbHkgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikge1xuICAgICAgICByZXR1cm4gZihhKTtcbiAgICB9O1xufTtcbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eShhKSB7XG4gICAgcmV0dXJuIGE7XG59XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIHVuc2FmZUNvZXJjZSA9IGlkZW50aXR5O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0YW50KGEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gYTsgfTtcbn1cbi8qKlxuICogQSB0aHVuayB0aGF0IHJldHVybnMgYWx3YXlzIGB0cnVlYC5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBjb25zdFRydWUgPSAvKiNfX1BVUkVfXyovIGNvbnN0YW50KHRydWUpO1xuLyoqXG4gKiBBIHRodW5rIHRoYXQgcmV0dXJucyBhbHdheXMgYGZhbHNlYC5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBjb25zdEZhbHNlID0gLyojX19QVVJFX18qLyBjb25zdGFudChmYWxzZSk7XG4vKipcbiAqIEEgdGh1bmsgdGhhdCByZXR1cm5zIGFsd2F5cyBgbnVsbGAuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgY29uc3ROdWxsID0gLyojX19QVVJFX18qLyBjb25zdGFudChudWxsKTtcbi8qKlxuICogQSB0aHVuayB0aGF0IHJldHVybnMgYWx3YXlzIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGNvbnN0VW5kZWZpbmVkID0gLyojX19QVVJFX18qLyBjb25zdGFudCh1bmRlZmluZWQpO1xuLyoqXG4gKiBBIHRodW5rIHRoYXQgcmV0dXJucyBhbHdheXMgYHZvaWRgLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGNvbnN0Vm9pZCA9IGNvbnN0VW5kZWZpbmVkO1xuZXhwb3J0IGZ1bmN0aW9uIGZsaXAoZikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGYoYXJnc1sxXSwgYXJnc1swXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBmKGEpKGFyZ3NbMF0pOyB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmxvdyhhYiwgYmMsIGNkLCBkZSwgZWYsIGZnLCBnaCwgaGksIGlqKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBhYjtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmMoYWIuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWYoZGUoY2QoYmMoYWIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmZyhlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnaChmZyhlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKSkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGkoZ2goZmcoZWYoZGUoY2QoYmMoYWIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkpKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpaihoaShnaChmZyhlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm47XG59XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgZnVuY3Rpb24gdHVwbGUoKSB7XG4gICAgdmFyIHQgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICB0W19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiB0O1xufVxuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluY3JlbWVudChuKSB7XG4gICAgcmV0dXJuIG4gKyAxO1xufVxuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY3JlbWVudChuKSB7XG4gICAgcmV0dXJuIG4gLSAxO1xufVxuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFic3VyZChfKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsZWQgYGFic3VyZGAgZnVuY3Rpb24gd2hpY2ggc2hvdWxkIGJlIHVuY2FsbGFibGUnKTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIHR1cGxlZCB2ZXJzaW9uIG9mIHRoaXMgZnVuY3Rpb246IGluc3RlYWQgb2YgYG5gIGFyZ3VtZW50cywgaXQgYWNjZXB0cyBhIHNpbmdsZSB0dXBsZSBhcmd1bWVudC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgdHVwbGVkIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogY29uc3QgYWRkID0gdHVwbGVkKCh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciA9PiB4ICsgeSlcbiAqXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoYWRkKFsxLCAyXSksIDMpXG4gKlxuICogQHNpbmNlIDIuNC4wXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0dXBsZWQoZikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZi5hcHBseSh2b2lkIDAsIGEpOyB9O1xufVxuLyoqXG4gKiBJbnZlcnNlIGZ1bmN0aW9uIG9mIGB0dXBsZWRgXG4gKlxuICogQHNpbmNlIDIuNC4wXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bnR1cGxlZChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZihhKTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBpcGUoYSwgYWIsIGJjLCBjZCwgZGUsIGVmLCBmZywgZ2gsIGhpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gYWIoYSk7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBiYyhhYihhKSk7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBjZChiYyhhYihhKSkpO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gZGUoY2QoYmMoYWIoYSkpKSk7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiBlZihkZShjZChiYyhhYihhKSkpKSk7XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiBmZyhlZihkZShjZChiYyhhYihhKSkpKSkpO1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSk7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSk7XG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIHZhciByZXQgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJldCA9IGFyZ3VtZW50c1tpXShyZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogVHlwZSBob2xlIHNpbXVsYXRpb25cbiAqXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBob2xlID0gYWJzdXJkO1xuLyoqXG4gKiBAc2luY2UgMi4xMS4wXG4gKi9cbmV4cG9ydCB2YXIgU0sgPSBmdW5jdGlvbiAoXywgYikgeyByZXR1cm4gYjsgfTtcbi8qKlxuICogVXNlIGBQcmVkaWNhdGVgIG1vZHVsZSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3QocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiAhcHJlZGljYXRlKGEpOyB9O1xufVxuLyoqXG4gKiBVc2UgYEVuZG9tb3JwaGlzbWAgbW9kdWxlIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjEwLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZ2V0RW5kb21vcnBoaXNtTW9ub2lkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICBjb25jYXQ6IGZ1bmN0aW9uIChmaXJzdCwgc2Vjb25kKSB7IHJldHVybiBmbG93KGZpcnN0LCBzZWNvbmQpOyB9LFxuICAgIGVtcHR5OiBpZGVudGl0eVxufSk7IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGR1YWwgPSBmdW5jdGlvbiAoYXJpdHksIGJvZHkpIHtcbiAgICB2YXIgaXNEYXRhRmlyc3QgPSB0eXBlb2YgYXJpdHkgPT09ICdudW1iZXInID8gZnVuY3Rpb24gKGFyZ3MpIHsgcmV0dXJuIGFyZ3MubGVuZ3RoID49IGFyaXR5OyB9IDogYXJpdHk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgICAgIGlmIChpc0RhdGFGaXJzdChhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gYm9keS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGYpIHsgcmV0dXJuIGJvZHkuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtzZWxmXSwgYXJncywgZmFsc2UpKTsgfTtcbiAgICB9O1xufTtcbiIsInZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wdGlvblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBpc05vbmUgPSBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIGZhLl90YWcgPT09ICdOb25lJzsgfTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgaXNTb21lID0gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBmYS5fdGFnID09PSAnU29tZSc7IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIG5vbmUgPSB7IF90YWc6ICdOb25lJyB9O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBzb21lID0gZnVuY3Rpb24gKGEpIHsgcmV0dXJuICh7IF90YWc6ICdTb21lJywgdmFsdWU6IGEgfSk7IH07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFaXRoZXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgaXNMZWZ0ID0gZnVuY3Rpb24gKG1hKSB7IHJldHVybiBtYS5fdGFnID09PSAnTGVmdCc7IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGlzUmlnaHQgPSBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIG1hLl90YWcgPT09ICdSaWdodCc7IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGxlZnQgPSBmdW5jdGlvbiAoZSkgeyByZXR1cm4gKHsgX3RhZzogJ0xlZnQnLCBsZWZ0OiBlIH0pOyB9O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciByaWdodCA9IGZ1bmN0aW9uIChhKSB7IHJldHVybiAoeyBfdGFnOiAnUmlnaHQnLCByaWdodDogYSB9KTsgfTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJlYWRvbmx5Tm9uRW1wdHlBcnJheVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBzaW5nbGV0b24gPSBmdW5jdGlvbiAoYSkgeyByZXR1cm4gW2FdOyB9O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBpc05vbkVtcHR5ID0gZnVuY3Rpb24gKGFzKSB7IHJldHVybiBhcy5sZW5ndGggPiAwOyB9O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBoZWFkID0gZnVuY3Rpb24gKGFzKSB7IHJldHVybiBhc1swXTsgfTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgdGFpbCA9IGZ1bmN0aW9uIChhcykgeyByZXR1cm4gYXMuc2xpY2UoMSk7IH07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBlbXB0eVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBlbXB0eVJlYWRvbmx5QXJyYXkgPSBbXTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgZW1wdHlSZWNvcmQgPSB7fTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJlY29yZFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTm9uRW1wdHlBcnJheVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBmcm9tUmVhZG9ubHlOb25FbXB0eUFycmF5ID0gZnVuY3Rpb24gKGFzKSB7IHJldHVybiBfX3NwcmVhZEFycmF5KFthc1swXV0sIGFzLnNsaWNlKDEpLCB0cnVlKTsgfTtcbiIsImltcG9ydCB7IGFwRmlyc3QgYXMgYXBGaXJzdF8sIGFwU2Vjb25kIGFzIGFwU2Vjb25kXyB9IGZyb20gJy4vQXBwbHknO1xuaW1wb3J0IHsgY2hhaW5GaXJzdCBhcyBjaGFpbkZpcnN0XyB9IGZyb20gJy4vQ2hhaW4nO1xuaW1wb3J0IHsgaWRlbnRpdHksIHBpcGUgYXMgcGlwZUZyb21GdW5jdGlvbk1vZHVsZSB9IGZyb20gJy4vZnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIG1hcChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYubWFwKGZhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb250cmFtYXAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLmNvbnRyYW1hcChmYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gbWFwV2l0aEluZGV4KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5tYXBXaXRoSW5kZXgoZmEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBmdW5jdGlvbiAoZmFiKSB7IHJldHVybiBGLmFwKGZhYiwgZmEpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNoYWluKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5jaGFpbihmYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gYmltYXAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZiwgZykgeyByZXR1cm4gZnVuY3Rpb24gKGZlYSkgeyByZXR1cm4gRi5iaW1hcChmZWEsIGYsIGcpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIG1hcExlZnQoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZlYSkgeyByZXR1cm4gRi5tYXBMZWZ0KGZlYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uICh3YSkgeyByZXR1cm4gRi5leHRlbmQod2EsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZShGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChiLCBmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYucmVkdWNlKGZhLCBiLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb2xkTWFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKE0pIHtcbiAgICAgICAgdmFyIGZvbGRNYXBNID0gRi5mb2xkTWFwKE0pO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gZm9sZE1hcE0oZmEsIGYpOyB9OyB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlUmlnaHQoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYiwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLnJlZHVjZVJpZ2h0KGZhLCBiLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VXaXRoSW5kZXgoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYiwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLnJlZHVjZVdpdGhJbmRleChmYSwgYiwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZm9sZE1hcFdpdGhJbmRleChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChNKSB7XG4gICAgICAgIHZhciBmb2xkTWFwV2l0aEluZGV4TSA9IEYuZm9sZE1hcFdpdGhJbmRleChNKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIGZvbGRNYXBXaXRoSW5kZXhNKGZhLCBmKTsgfTsgfTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0V2l0aEluZGV4KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGIsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5yZWR1Y2VSaWdodFdpdGhJbmRleChmYSwgYiwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gYWx0KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRoYXQpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5hbHQoZmEsIHRoYXQpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlcihGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwcmVkaWNhdGUpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5maWx0ZXIoZmEsIHByZWRpY2F0ZSk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyTWFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5maWx0ZXJNYXAoZmEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpdGlvbihGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYucGFydGl0aW9uKGZhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aXRpb25NYXAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLnBhcnRpdGlvbk1hcChmYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyV2l0aEluZGV4KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHByZWRpY2F0ZSkgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLmZpbHRlcldpdGhJbmRleChmYSwgcHJlZGljYXRlKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJNYXBXaXRoSW5kZXgoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLmZpbHRlck1hcFdpdGhJbmRleChmYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gcGFydGl0aW9uV2l0aEluZGV4KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5wYXJ0aXRpb25XaXRoSW5kZXgoZmEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpdGlvbk1hcFdpdGhJbmRleChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYucGFydGl0aW9uTWFwV2l0aEluZGV4KGZhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcm9tYXAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZiwgZykgeyByZXR1cm4gZnVuY3Rpb24gKGZiYykgeyByZXR1cm4gRi5wcm9tYXAoZmJjLCBmLCBnKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGVhKSB7IHJldHVybiBmdW5jdGlvbiAoYWIpIHsgcmV0dXJuIEYuY29tcG9zZShhYiwgZWEpOyB9OyB9O1xufVxudmFyIGlzRnVuY3RvciA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5tYXAgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNDb250cmF2YXJpYW50ID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLmNvbnRyYW1hcCA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0Z1bmN0b3JXaXRoSW5kZXggPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkubWFwV2l0aEluZGV4ID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzQXBwbHkgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkuYXAgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNDaGFpbiA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5jaGFpbiA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0JpZnVuY3RvciA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5iaW1hcCA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0V4dGVuZCA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5leHRlbmQgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNGb2xkYWJsZSA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5yZWR1Y2UgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNGb2xkYWJsZVdpdGhJbmRleCA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5yZWR1Y2VXaXRoSW5kZXggPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNBbHQgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkuYWx0ID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzQ29tcGFjdGFibGUgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkuY29tcGFjdCA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0ZpbHRlcmFibGUgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkuZmlsdGVyID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzRmlsdGVyYWJsZVdpdGhJbmRleCA9IGZ1bmN0aW9uIChJKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBJLmZpbHRlcldpdGhJbmRleCA9PT0gJ2Z1bmN0aW9uJztcbn07XG52YXIgaXNQcm9mdW5jdG9yID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLnByb21hcCA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc1NlbWlncm91cG9pZCA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5jb21wb3NlID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzTW9uYWRUaHJvdyA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS50aHJvd0Vycm9yID09PSAnZnVuY3Rpb24nOyB9O1xuLyoqIEBkZXByZWNhdGVkICovXG5leHBvcnQgZnVuY3Rpb24gcGlwZWFibGUoSSkge1xuICAgIHZhciByID0ge307XG4gICAgaWYgKGlzRnVuY3RvcihJKSkge1xuICAgICAgICByLm1hcCA9IG1hcChJKTtcbiAgICB9XG4gICAgaWYgKGlzQ29udHJhdmFyaWFudChJKSkge1xuICAgICAgICByLmNvbnRyYW1hcCA9IGNvbnRyYW1hcChJKTtcbiAgICB9XG4gICAgaWYgKGlzRnVuY3RvcldpdGhJbmRleChJKSkge1xuICAgICAgICByLm1hcFdpdGhJbmRleCA9IG1hcFdpdGhJbmRleChJKTtcbiAgICB9XG4gICAgaWYgKGlzQXBwbHkoSSkpIHtcbiAgICAgICAgci5hcCA9IGFwKEkpO1xuICAgICAgICByLmFwRmlyc3QgPSBhcEZpcnN0XyhJKTtcbiAgICAgICAgci5hcFNlY29uZCA9IGFwU2Vjb25kXyhJKTtcbiAgICB9XG4gICAgaWYgKGlzQ2hhaW4oSSkpIHtcbiAgICAgICAgci5jaGFpbiA9IGNoYWluKEkpO1xuICAgICAgICByLmNoYWluRmlyc3QgPSBjaGFpbkZpcnN0XyhJKTtcbiAgICAgICAgci5mbGF0dGVuID0gci5jaGFpbihpZGVudGl0eSk7XG4gICAgfVxuICAgIGlmIChpc0JpZnVuY3RvcihJKSkge1xuICAgICAgICByLmJpbWFwID0gYmltYXAoSSk7XG4gICAgICAgIHIubWFwTGVmdCA9IG1hcExlZnQoSSk7XG4gICAgfVxuICAgIGlmIChpc0V4dGVuZChJKSkge1xuICAgICAgICByLmV4dGVuZCA9IGV4dGVuZChJKTtcbiAgICAgICAgci5kdXBsaWNhdGUgPSByLmV4dGVuZChpZGVudGl0eSk7XG4gICAgfVxuICAgIGlmIChpc0ZvbGRhYmxlKEkpKSB7XG4gICAgICAgIHIucmVkdWNlID0gcmVkdWNlKEkpO1xuICAgICAgICByLmZvbGRNYXAgPSBmb2xkTWFwKEkpO1xuICAgICAgICByLnJlZHVjZVJpZ2h0ID0gcmVkdWNlUmlnaHQoSSk7XG4gICAgfVxuICAgIGlmIChpc0ZvbGRhYmxlV2l0aEluZGV4KEkpKSB7XG4gICAgICAgIHIucmVkdWNlV2l0aEluZGV4ID0gcmVkdWNlV2l0aEluZGV4KEkpO1xuICAgICAgICByLmZvbGRNYXBXaXRoSW5kZXggPSBmb2xkTWFwV2l0aEluZGV4KEkpO1xuICAgICAgICByLnJlZHVjZVJpZ2h0V2l0aEluZGV4ID0gcmVkdWNlUmlnaHRXaXRoSW5kZXgoSSk7XG4gICAgfVxuICAgIGlmIChpc0FsdChJKSkge1xuICAgICAgICByLmFsdCA9IGFsdChJKTtcbiAgICB9XG4gICAgaWYgKGlzQ29tcGFjdGFibGUoSSkpIHtcbiAgICAgICAgci5jb21wYWN0ID0gSS5jb21wYWN0O1xuICAgICAgICByLnNlcGFyYXRlID0gSS5zZXBhcmF0ZTtcbiAgICB9XG4gICAgaWYgKGlzRmlsdGVyYWJsZShJKSkge1xuICAgICAgICByLmZpbHRlciA9IGZpbHRlcihJKTtcbiAgICAgICAgci5maWx0ZXJNYXAgPSBmaWx0ZXJNYXAoSSk7XG4gICAgICAgIHIucGFydGl0aW9uID0gcGFydGl0aW9uKEkpO1xuICAgICAgICByLnBhcnRpdGlvbk1hcCA9IHBhcnRpdGlvbk1hcChJKTtcbiAgICB9XG4gICAgaWYgKGlzRmlsdGVyYWJsZVdpdGhJbmRleChJKSkge1xuICAgICAgICByLmZpbHRlcldpdGhJbmRleCA9IGZpbHRlcldpdGhJbmRleChJKTtcbiAgICAgICAgci5maWx0ZXJNYXBXaXRoSW5kZXggPSBmaWx0ZXJNYXBXaXRoSW5kZXgoSSk7XG4gICAgICAgIHIucGFydGl0aW9uV2l0aEluZGV4ID0gcGFydGl0aW9uV2l0aEluZGV4KEkpO1xuICAgICAgICByLnBhcnRpdGlvbk1hcFdpdGhJbmRleCA9IHBhcnRpdGlvbk1hcFdpdGhJbmRleChJKTtcbiAgICB9XG4gICAgaWYgKGlzUHJvZnVuY3RvcihJKSkge1xuICAgICAgICByLnByb21hcCA9IHByb21hcChJKTtcbiAgICB9XG4gICAgaWYgKGlzU2VtaWdyb3Vwb2lkKEkpKSB7XG4gICAgICAgIHIuY29tcG9zZSA9IGNvbXBvc2UoSSk7XG4gICAgfVxuICAgIGlmIChpc01vbmFkVGhyb3coSSkpIHtcbiAgICAgICAgdmFyIGZyb21PcHRpb24gPSBmdW5jdGlvbiAob25Ob25lKSB7IHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgICAgIHJldHVybiBtYS5fdGFnID09PSAnTm9uZScgPyBJLnRocm93RXJyb3Iob25Ob25lKCkpIDogSS5vZihtYS52YWx1ZSk7XG4gICAgICAgIH07IH07XG4gICAgICAgIHZhciBmcm9tRWl0aGVyID0gZnVuY3Rpb24gKG1hKSB7XG4gICAgICAgICAgICByZXR1cm4gbWEuX3RhZyA9PT0gJ0xlZnQnID8gSS50aHJvd0Vycm9yKG1hLmxlZnQpIDogSS5vZihtYS5yaWdodCk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBmcm9tUHJlZGljYXRlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSwgb25GYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWRpY2F0ZShhKSA/IEkub2YoYSkgOiBJLnRocm93RXJyb3Iob25GYWxzZShhKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZmlsdGVyT3JFbHNlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSwgb25GYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJLmNoYWluKG1hLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gKHByZWRpY2F0ZShhKSA/IEkub2YoYSkgOiBJLnRocm93RXJyb3Iob25GYWxzZShhKSkpOyB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHIuZnJvbU9wdGlvbiA9IGZyb21PcHRpb247XG4gICAgICAgIHIuZnJvbUVpdGhlciA9IGZyb21FaXRoZXI7XG4gICAgICAgIHIuZnJvbVByZWRpY2F0ZSA9IGZyb21QcmVkaWNhdGU7XG4gICAgICAgIHIuZmlsdGVyT3JFbHNlID0gZmlsdGVyT3JFbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcjtcbn1cbi8qKlxuICogVXNlIFtgcGlwZWBdKGh0dHBzOi8vZ2NhbnRpLmdpdGh1Yi5pby9mcC10cy9tb2R1bGVzL2Z1bmN0aW9uLnRzLmh0bWwjcGlwZSkgZnJvbSBgZnVuY3Rpb25gIG1vZHVsZSBpbnN0ZWFkLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciBwaXBlID0gcGlwZUZyb21GdW5jdGlvbk1vZHVsZTtcbiIsImltcG9ydCAqIGFzIEZTIGZyb20gJy4vRnJlZVNlbWlncm91cCc7XG4vKipcbiAqIEBjYXRlZ29yeSBtb2RlbFxuICogQHNpbmNlIDIuMi43XG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLWFzLWNvbnN0XG5leHBvcnQgdmFyIHJlcXVpcmVkID0gJ3JlcXVpcmVkJztcbi8qKlxuICogQGNhdGVnb3J5IG1vZGVsXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9wcmVmZXItYXMtY29uc3RcbmV4cG9ydCB2YXIgb3B0aW9uYWwgPSAnb3B0aW9uYWwnO1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBsZWFmID0gZnVuY3Rpb24gKGFjdHVhbCwgZXJyb3IpIHsgcmV0dXJuICh7IF90YWc6ICdMZWFmJywgYWN0dWFsOiBhY3R1YWwsIGVycm9yOiBlcnJvciB9KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIga2V5ID0gZnVuY3Rpb24gKGtleSwga2luZCwgZXJyb3JzKSB7IHJldHVybiAoe1xuICAgIF90YWc6ICdLZXknLFxuICAgIGtleToga2V5LFxuICAgIGtpbmQ6IGtpbmQsXG4gICAgZXJyb3JzOiBlcnJvcnNcbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBpbmRleCA9IGZ1bmN0aW9uIChpbmRleCwga2luZCwgZXJyb3JzKSB7IHJldHVybiAoe1xuICAgIF90YWc6ICdJbmRleCcsXG4gICAgaW5kZXg6IGluZGV4LFxuICAgIGtpbmQ6IGtpbmQsXG4gICAgZXJyb3JzOiBlcnJvcnNcbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBtZW1iZXIgPSBmdW5jdGlvbiAoaW5kZXgsIGVycm9ycykgeyByZXR1cm4gKHtcbiAgICBfdGFnOiAnTWVtYmVyJyxcbiAgICBpbmRleDogaW5kZXgsXG4gICAgZXJyb3JzOiBlcnJvcnNcbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBsYXp5ID0gZnVuY3Rpb24gKGlkLCBlcnJvcnMpIHsgcmV0dXJuICh7XG4gICAgX3RhZzogJ0xhenknLFxuICAgIGlkOiBpZCxcbiAgICBlcnJvcnM6IGVycm9yc1xufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuOVxuICovXG5leHBvcnQgdmFyIHdyYXAgPSBmdW5jdGlvbiAoZXJyb3IsIGVycm9ycykgeyByZXR1cm4gKHtcbiAgICBfdGFnOiAnV3JhcCcsXG4gICAgZXJyb3I6IGVycm9yLFxuICAgIGVycm9yczogZXJyb3JzXG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGRlc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBmb2xkID0gZnVuY3Rpb24gKHBhdHRlcm5zKSB7XG4gICAgdmFyIGYgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBzd2l0Y2ggKGUuX3RhZykge1xuICAgICAgICAgICAgY2FzZSAnTGVhZic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm5zLkxlYWYoZS5hY3R1YWwsIGUuZXJyb3IpO1xuICAgICAgICAgICAgY2FzZSAnS2V5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0dGVybnMuS2V5KGUua2V5LCBlLmtpbmQsIGUuZXJyb3JzKTtcbiAgICAgICAgICAgIGNhc2UgJ0luZGV4JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0dGVybnMuSW5kZXgoZS5pbmRleCwgZS5raW5kLCBlLmVycm9ycyk7XG4gICAgICAgICAgICBjYXNlICdNZW1iZXInOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXR0ZXJucy5NZW1iZXIoZS5pbmRleCwgZS5lcnJvcnMpO1xuICAgICAgICAgICAgY2FzZSAnTGF6eSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm5zLkxhenkoZS5pZCwgZS5lcnJvcnMpO1xuICAgICAgICAgICAgY2FzZSAnV3JhcCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm5zLldyYXAoZS5lcnJvciwgZS5lcnJvcnMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gZjtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VtaWdyb3VwKCkge1xuICAgIHJldHVybiBGUy5nZXRTZW1pZ3JvdXAoKTtcbn1cbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvZXM2L0VpdGhlcic7XG5pbXBvcnQgeyBpZGVudGl0eSB9IGZyb20gJ2ZwLXRzL2VzNi9mdW5jdGlvbic7XG5pbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZXM2L3BpcGVhYmxlJztcbmltcG9ydCAqIGFzIERFIGZyb20gJy4vRGVjb2RlRXJyb3InO1xuaW1wb3J0ICogYXMgRlMgZnJvbSAnLi9GcmVlU2VtaWdyb3VwJztcbmltcG9ydCAqIGFzIEcgZnJvbSAnLi9HdWFyZCc7XG5pbXBvcnQgKiBhcyBLIGZyb20gJy4vS2xlaXNsaSc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBLbGVpc2xpIGNvbmZpZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IHZhciBTRSA9IFxuLyojX19QVVJFX18qL1xuREUuZ2V0U2VtaWdyb3VwKCk7XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgdmFyIGFwID0gZnVuY3Rpb24gKGZhYiwgZmEpIHtcbiAgICByZXR1cm4gRS5pc0xlZnQoZmFiKVxuICAgICAgICA/IEUuaXNMZWZ0KGZhKVxuICAgICAgICAgICAgPyBFLmxlZnQoU0UuY29uY2F0KGZhYi5sZWZ0LCBmYS5sZWZ0KSlcbiAgICAgICAgICAgIDogZmFiXG4gICAgICAgIDogRS5pc0xlZnQoZmEpXG4gICAgICAgICAgICA/IGZhXG4gICAgICAgICAgICA6IEUucmlnaHQoZmFiLnJpZ2h0KGZhLnJpZ2h0KSk7XG59O1xudmFyIE0gPSB7XG4gICAgVVJJOiBFLlVSSSxcbiAgICBfRTogdW5kZWZpbmVkLFxuICAgIG1hcDogZnVuY3Rpb24gKGZhLCBmKSB7IHJldHVybiBwaXBlKGZhLCBFLm1hcChmKSk7IH0sXG4gICAgYXA6IGFwLFxuICAgIG9mOiBFLnJpZ2h0LFxuICAgIGNoYWluOiBmdW5jdGlvbiAobWEsIGYpIHsgcmV0dXJuIHBpcGUobWEsIEUuY2hhaW4oZikpOyB9LFxuICAgIHRocm93RXJyb3I6IEUubGVmdCxcbiAgICBiaW1hcDogZnVuY3Rpb24gKGZhLCBmLCBnKSB7IHJldHVybiBwaXBlKGZhLCBFLmJpbWFwKGYsIGcpKTsgfSxcbiAgICBtYXBMZWZ0OiBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIEUubWFwTGVmdChmKSk7IH0sXG4gICAgYWx0OiBmdW5jdGlvbiAobWUsIHRoYXQpIHtcbiAgICAgICAgaWYgKEUuaXNSaWdodChtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBtZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZWEgPSB0aGF0KCk7XG4gICAgICAgIHJldHVybiBFLmlzTGVmdChlYSkgPyBFLmxlZnQoU0UuY29uY2F0KG1lLmxlZnQsIGVhLmxlZnQpKSA6IGVhO1xuICAgIH1cbn07XG4vKipcbiAqIEBjYXRlZ29yeSBEZWNvZGVFcnJvclxuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgZXJyb3IgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7IHJldHVybiBGUy5vZihERS5sZWFmKGFjdHVhbCwgbWVzc2FnZSkpOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgRGVjb2RlRXJyb3JcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIHN1Y2Nlc3MgPSBFLnJpZ2h0O1xuLyoqXG4gKiBAY2F0ZWdvcnkgRGVjb2RlRXJyb3JcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGZhaWx1cmUgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIEUubGVmdChlcnJvcihhY3R1YWwsIG1lc3NhZ2UpKTtcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdHJ1Y3RvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgZnJvbVJlZmluZW1lbnQgPSBmdW5jdGlvbiAocmVmaW5lbWVudCwgZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gSy5mcm9tUmVmaW5lbWVudChNKShyZWZpbmVtZW50LCBmdW5jdGlvbiAodSkgeyByZXR1cm4gZXJyb3IodSwgZXhwZWN0ZWQpOyB9KTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGZyb21HdWFyZCA9IGZ1bmN0aW9uIChndWFyZCwgZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gZnJvbVJlZmluZW1lbnQoZ3VhcmQuaXMsIGV4cGVjdGVkKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGxpdGVyYWwgPSBcbi8qI19fUFVSRV9fKi9cbksubGl0ZXJhbChNKShmdW5jdGlvbiAodSwgdmFsdWVzKSB7IHJldHVybiBlcnJvcih1LCB2YWx1ZXMubWFwKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpOyB9KS5qb2luKCcgfCAnKSk7IH0pO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcHJpbWl0aXZlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgc3RyaW5nID0gXG4vKiNfX1BVUkVfXyovXG5mcm9tR3VhcmQoRy5zdHJpbmcsICdzdHJpbmcnKTtcbi8qKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIG51bWJlciA9IFxuLyojX19QVVJFX18qL1xuZnJvbUd1YXJkKEcubnVtYmVyLCAnbnVtYmVyJyk7XG4vKipcbiAqIEBjYXRlZ29yeSBwcmltaXRpdmVzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBib29sZWFuID0gXG4vKiNfX1BVUkVfXyovXG5mcm9tR3VhcmQoRy5ib29sZWFuLCAnYm9vbGVhbicpO1xuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgVW5rbm93bkFycmF5ID0gXG4vKiNfX1BVUkVfXyovXG5mcm9tR3VhcmQoRy5Vbmtub3duQXJyYXksICdBcnJheTx1bmtub3duPicpO1xuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgVW5rbm93blJlY29yZCA9IFxuLyojX19QVVJFX18qL1xuZnJvbUd1YXJkKEcuVW5rbm93blJlY29yZCwgJ1JlY29yZDxzdHJpbmcsIHVua25vd24+Jyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb21iaW5hdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIG1hcExlZnRXaXRoSW5wdXQgPSBcbi8qI19fUFVSRV9fKi9cbksubWFwTGVmdFdpdGhJbnB1dChNKTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjlcbiAqL1xuZXhwb3J0IHZhciB3aXRoTWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG1hcExlZnRXaXRoSW5wdXQoZnVuY3Rpb24gKGlucHV0LCBlKSB7IHJldHVybiBGUy5vZihERS53cmFwKG1lc3NhZ2UoaW5wdXQsIGUpLCBlKSk7IH0pO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciByZWZpbmUgPSBmdW5jdGlvbiAocmVmaW5lbWVudCwgaWQpIHsgcmV0dXJuIEsucmVmaW5lKE0pKHJlZmluZW1lbnQsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBlcnJvcihhLCBpZCk7IH0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIHBhcnNlID0gXG4vKiNfX1BVUkVfXyovXG5LLnBhcnNlKE0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIG51bGxhYmxlID0gXG4vKiNfX1BVUkVfXyovXG5LLm51bGxhYmxlKE0pKGZ1bmN0aW9uICh1LCBlKSB7IHJldHVybiBGUy5jb25jYXQoRlMub2YoREUubWVtYmVyKDAsIGVycm9yKHUsICdudWxsJykpKSwgRlMub2YoREUubWVtYmVyKDEsIGUpKSk7IH0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMTVcbiAqL1xuZXhwb3J0IHZhciBmcm9tU3RydWN0ID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICByZXR1cm4gSy5mcm9tU3RydWN0KE0pKGZ1bmN0aW9uIChrLCBlKSB7IHJldHVybiBGUy5vZihERS5rZXkoaywgREUucmVxdWlyZWQsIGUpKTsgfSkocHJvcGVydGllcyk7XG59O1xuLyoqXG4gKiBVc2UgYGZyb21TdHJ1Y3RgIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZnJvbVR5cGUgPSBmcm9tU3RydWN0O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMTVcbiAqL1xuZXhwb3J0IHZhciBzdHJ1Y3QgPSBmdW5jdGlvbiAocHJvcGVydGllcykgeyByZXR1cm4gcGlwZShVbmtub3duUmVjb3JkLCBjb21wb3NlKGZyb21TdHJ1Y3QocHJvcGVydGllcykpKTsgfTtcbi8qKlxuICogVXNlIGBzdHJ1Y3RgIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgdHlwZSA9IHN0cnVjdDtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBmcm9tUGFydGlhbCA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgcmV0dXJuIEsuZnJvbVBhcnRpYWwoTSkoZnVuY3Rpb24gKGssIGUpIHsgcmV0dXJuIEZTLm9mKERFLmtleShrLCBERS5vcHRpb25hbCwgZSkpOyB9KShwcm9wZXJ0aWVzKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgcGFydGlhbCA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7IHJldHVybiBwaXBlKFVua25vd25SZWNvcmQsIGNvbXBvc2UoZnJvbVBhcnRpYWwocHJvcGVydGllcykpKTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBmcm9tQXJyYXkgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBLLmZyb21BcnJheShNKShmdW5jdGlvbiAoaSwgZSkgeyByZXR1cm4gRlMub2YoREUuaW5kZXgoaSwgREUub3B0aW9uYWwsIGUpKTsgfSkoaXRlbSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGFycmF5ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gcGlwZShVbmtub3duQXJyYXksIGNvbXBvc2UoZnJvbUFycmF5KGl0ZW0pKSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGZyb21SZWNvcmQgPSBmdW5jdGlvbiAoY29kb21haW4pIHtcbiAgICByZXR1cm4gSy5mcm9tUmVjb3JkKE0pKGZ1bmN0aW9uIChrLCBlKSB7IHJldHVybiBGUy5vZihERS5rZXkoaywgREUub3B0aW9uYWwsIGUpKTsgfSkoY29kb21haW4pO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciByZWNvcmQgPSBmdW5jdGlvbiAoY29kb21haW4pIHtcbiAgICByZXR1cm4gcGlwZShVbmtub3duUmVjb3JkLCBjb21wb3NlKGZyb21SZWNvcmQoY29kb21haW4pKSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGZyb21UdXBsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29tcG9uZW50cyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGNvbXBvbmVudHNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIEsuZnJvbVR1cGxlKE0pKGZ1bmN0aW9uIChpLCBlKSB7IHJldHVybiBGUy5vZihERS5pbmRleChpLCBERS5yZXF1aXJlZCwgZSkpOyB9KS5hcHBseSh2b2lkIDAsIGNvbXBvbmVudHMpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciB0dXBsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29tcG9uZW50cyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGNvbXBvbmVudHNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIHBpcGUoVW5rbm93bkFycmF5LCBjb21wb3NlKGZyb21UdXBsZS5hcHBseSh2b2lkIDAsIGNvbXBvbmVudHMpKSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIHVuaW9uID0gXG4vKiNfX1BVUkVfXyovXG5LLnVuaW9uKE0pKGZ1bmN0aW9uIChpLCBlKSB7IHJldHVybiBGUy5vZihERS5tZW1iZXIoaSwgZSkpOyB9KTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBpbnRlcnNlY3QgPSBcbi8qI19fUFVSRV9fKi9cbksuaW50ZXJzZWN0KE0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGZyb21TdW0gPSBmdW5jdGlvbiAodGFnKSB7IHJldHVybiBmdW5jdGlvbiAobWVtYmVycykge1xuICAgIHJldHVybiBLLmZyb21TdW0oTSkoZnVuY3Rpb24gKHRhZywgdmFsdWUsIGtleXMpIHtcbiAgICAgICAgcmV0dXJuIEZTLm9mKERFLmtleSh0YWcsIERFLnJlcXVpcmVkLCBlcnJvcih2YWx1ZSwga2V5cy5sZW5ndGggPT09IDAgPyAnbmV2ZXInIDoga2V5cy5tYXAoZnVuY3Rpb24gKGspIHsgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGspOyB9KS5qb2luKCcgfCAnKSkpKTtcbiAgICB9KSh0YWcpKG1lbWJlcnMpO1xufTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBzdW0gPSBmdW5jdGlvbiAodGFnKSB7IHJldHVybiBmdW5jdGlvbiAobWVtYmVycykgeyByZXR1cm4gcGlwZShVbmtub3duUmVjb3JkLCBjb21wb3NlKGZyb21TdW0odGFnKShtZW1iZXJzKSkpOyB9OyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGxhenkgPSBcbi8qI19fUFVSRV9fKi9cbksubGF6eShNKShmdW5jdGlvbiAoaWQsIGUpIHsgcmV0dXJuIEZTLm9mKERFLmxhenkoaWQsIGUpKTsgfSk7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4xNVxuICovXG5leHBvcnQgdmFyIHJlYWRvbmx5ID0gaWRlbnRpdHk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBub24tcGlwZWFibGVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgbWFwXyA9IGZ1bmN0aW9uIChmYSwgZikgeyByZXR1cm4gcGlwZShmYSwgbWFwKGYpKTsgfTtcbnZhciBhbHRfID0gZnVuY3Rpb24gKG1lLCB0aGF0KSB7IHJldHVybiBwaXBlKG1lLCBhbHQodGhhdCkpOyB9O1xudmFyIGNvbXBvc2VfID0gZnVuY3Rpb24gKGFiLCBsYSkgeyByZXR1cm4gcGlwZShsYSwgY29tcG9zZShhYikpOyB9O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcGlwZWFibGVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBGdW5jdG9yXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBtYXAgPSBcbi8qI19fUFVSRV9fKi9cbksubWFwKE0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgQWx0XG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBhbHQgPSBcbi8qI19fUFVSRV9fKi9cbksuYWx0KE0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgU2VtaWdyb3Vwb2lkXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBjb21wb3NlID0gXG4vKiNfX1BVUkVfXyovXG5LLmNvbXBvc2UoTSk7XG4vKipcbiAqIEBjYXRlZ29yeSBDYXRlZ29yeVxuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgaWQgPSBcbi8qI19fUFVSRV9fKi9cbksuaWQoTSk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBpbnN0YW5jZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgVVJJID0gJ2lvLXRzL0RlY29kZXInO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBGdW5jdG9yID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogbWFwX1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgQWx0ID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogbWFwXyxcbiAgICBhbHQ6IGFsdF9cbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIENhdGVnb3J5ID0ge1xuICAgIFVSSTogVVJJLFxuICAgIGNvbXBvc2U6IGNvbXBvc2VfLFxuICAgIGlkOiBpZFxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgU2NoZW1hYmxlID0ge1xuICAgIFVSSTogVVJJLFxuICAgIGxpdGVyYWw6IGxpdGVyYWwsXG4gICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgbnVtYmVyOiBudW1iZXIsXG4gICAgYm9vbGVhbjogYm9vbGVhbixcbiAgICBudWxsYWJsZTogbnVsbGFibGUsXG4gICAgdHlwZTogdHlwZSxcbiAgICBzdHJ1Y3Q6IHN0cnVjdCxcbiAgICBwYXJ0aWFsOiBwYXJ0aWFsLFxuICAgIHJlY29yZDogcmVjb3JkLFxuICAgIGFycmF5OiBhcnJheSxcbiAgICB0dXBsZTogdHVwbGUsXG4gICAgaW50ZXJzZWN0OiBpbnRlcnNlY3QsXG4gICAgc3VtOiBzdW0sXG4gICAgbGF6eTogbGF6eSxcbiAgICByZWFkb25seTogcmVhZG9ubHlcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIFdpdGhVbmtub3duQ29udGFpbmVycyA9IHtcbiAgICBVbmtub3duQXJyYXk6IFVua25vd25BcnJheSxcbiAgICBVbmtub3duUmVjb3JkOiBVbmtub3duUmVjb3JkXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBXaXRoVW5pb24gPSB7XG4gICAgdW5pb246IHVuaW9uXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBXaXRoUmVmaW5lID0ge1xuICAgIHJlZmluZTogcmVmaW5lXG59O1xudmFyIGVtcHR5ID0gW107XG52YXIgbWFrZSA9IGZ1bmN0aW9uICh2YWx1ZSwgZm9yZXN0KSB7XG4gICAgaWYgKGZvcmVzdCA9PT0gdm9pZCAwKSB7IGZvcmVzdCA9IGVtcHR5OyB9XG4gICAgcmV0dXJuICh7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZm9yZXN0OiBmb3Jlc3RcbiAgICB9KTtcbn07XG52YXIgZHJhd1RyZWUgPSBmdW5jdGlvbiAodHJlZSkgeyByZXR1cm4gdHJlZS52YWx1ZSArIGRyYXdGb3Jlc3QoJ1xcbicsIHRyZWUuZm9yZXN0KTsgfTtcbnZhciBkcmF3Rm9yZXN0ID0gZnVuY3Rpb24gKGluZGVudGF0aW9uLCBmb3Jlc3QpIHtcbiAgICB2YXIgciA9ICcnO1xuICAgIHZhciBsZW4gPSBmb3Jlc3QubGVuZ3RoO1xuICAgIHZhciB0cmVlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdHJlZSA9IGZvcmVzdFtpXTtcbiAgICAgICAgdmFyIGlzTGFzdCA9IGkgPT09IGxlbiAtIDE7XG4gICAgICAgIHIgKz0gaW5kZW50YXRpb24gKyAoaXNMYXN0ID8gJ+KUlCcgOiAn4pScJykgKyAn4pSAICcgKyB0cmVlLnZhbHVlO1xuICAgICAgICByICs9IGRyYXdGb3Jlc3QoaW5kZW50YXRpb24gKyAobGVuID4gMSAmJiAhaXNMYXN0ID8gJ+KUgiAgJyA6ICcgICAnKSwgdHJlZS5mb3Jlc3QpO1xuICAgIH1cbiAgICByZXR1cm4gcjtcbn07XG52YXIgdG9UcmVlID0gREUuZm9sZCh7XG4gICAgTGVhZjogZnVuY3Rpb24gKGlucHV0LCBlcnJvcikgeyByZXR1cm4gbWFrZShcImNhbm5vdCBkZWNvZGUgXCIuY29uY2F0KEpTT04uc3RyaW5naWZ5KGlucHV0KSwgXCIsIHNob3VsZCBiZSBcIikuY29uY2F0KGVycm9yKSk7IH0sXG4gICAgS2V5OiBmdW5jdGlvbiAoa2V5LCBraW5kLCBlcnJvcnMpIHsgcmV0dXJuIG1ha2UoXCJcIi5jb25jYXQoa2luZCwgXCIgcHJvcGVydHkgXCIpLmNvbmNhdChKU09OLnN0cmluZ2lmeShrZXkpKSwgdG9Gb3Jlc3QoZXJyb3JzKSk7IH0sXG4gICAgSW5kZXg6IGZ1bmN0aW9uIChpbmRleCwga2luZCwgZXJyb3JzKSB7IHJldHVybiBtYWtlKFwiXCIuY29uY2F0KGtpbmQsIFwiIGluZGV4IFwiKS5jb25jYXQoaW5kZXgpLCB0b0ZvcmVzdChlcnJvcnMpKTsgfSxcbiAgICBNZW1iZXI6IGZ1bmN0aW9uIChpbmRleCwgZXJyb3JzKSB7IHJldHVybiBtYWtlKFwibWVtYmVyIFwiLmNvbmNhdChpbmRleCksIHRvRm9yZXN0KGVycm9ycykpOyB9LFxuICAgIExhenk6IGZ1bmN0aW9uIChpZCwgZXJyb3JzKSB7IHJldHVybiBtYWtlKFwibGF6eSB0eXBlIFwiLmNvbmNhdChpZCksIHRvRm9yZXN0KGVycm9ycykpOyB9LFxuICAgIFdyYXA6IGZ1bmN0aW9uIChlcnJvciwgZXJyb3JzKSB7IHJldHVybiBtYWtlKGVycm9yLCB0b0ZvcmVzdChlcnJvcnMpKTsgfVxufSk7XG52YXIgdG9Gb3Jlc3QgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzdGFjayA9IFtdO1xuICAgIHZhciBmb2N1cyA9IGU7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBzd2l0Y2ggKGZvY3VzLl90YWcpIHtcbiAgICAgICAgICAgIGNhc2UgJ09mJzpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHRvVHJlZShmb2N1cy52YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG1wID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0bXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzID0gdG1wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnQ29uY2F0JzpcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGZvY3VzLnJpZ2h0KTtcbiAgICAgICAgICAgICAgICBmb2N1cyA9IGZvY3VzLmxlZnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59O1xuLyoqXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBkcmF3ID0gZnVuY3Rpb24gKGUpIHsgcmV0dXJuIHRvRm9yZXN0KGUpLm1hcChkcmF3VHJlZSkuam9pbignXFxuJyk7IH07XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgdmFyIHN0cmluZ2lmeSA9IFxuLyojX19QVVJFX18qL1xuRS5mb2xkKGRyYXcsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBKU09OLnN0cmluZ2lmeShhLCBudWxsLCAyKTsgfSk7XG4iLCIvKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIG9mID0gZnVuY3Rpb24gKGEpIHsgcmV0dXJuICh7IF90YWc6ICdPZicsIHZhbHVlOiBhIH0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBjb25jYXQgPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuICh7XG4gICAgX3RhZzogJ0NvbmNhdCcsXG4gICAgbGVmdDogbGVmdCxcbiAgICByaWdodDogcmlnaHRcbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVzdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGZvbGQgPSBmdW5jdGlvbiAob25PZiwgb25Db25jYXQpIHsgcmV0dXJuIGZ1bmN0aW9uIChmKSB7XG4gICAgc3dpdGNoIChmLl90YWcpIHtcbiAgICAgICAgY2FzZSAnT2YnOlxuICAgICAgICAgICAgcmV0dXJuIG9uT2YoZi52YWx1ZSk7XG4gICAgICAgIGNhc2UgJ0NvbmNhdCc6XG4gICAgICAgICAgICByZXR1cm4gb25Db25jYXQoZi5sZWZ0LCBmLnJpZ2h0KTtcbiAgICB9XG59OyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbWlncm91cCgpIHtcbiAgICByZXR1cm4geyBjb25jYXQ6IGNvbmNhdCB9O1xufVxuIiwiLyoqXG4gKiAqKlRoaXMgbW9kdWxlIGlzIGV4cGVyaW1lbnRhbCoqXG4gKlxuICogRXhwZXJpbWVudGFsIGZlYXR1cmVzIGFyZSBwdWJsaXNoZWQgaW4gb3JkZXIgdG8gZ2V0IGVhcmx5IGZlZWRiYWNrIGZyb20gdGhlIGNvbW11bml0eSwgc2VlIHRoZXNlIHRyYWNraW5nXG4gKiBbaXNzdWVzXShodHRwczovL2dpdGh1Yi5jb20vZ2NhbnRpL2lvLXRzL2lzc3Vlcz9xPWxhYmVsJTNBdjIuMispIGZvciBmdXJ0aGVyIGRpc2N1c3Npb25zIGFuZCBlbmhhbmNlbWVudHMuXG4gKlxuICogQSBmZWF0dXJlIHRhZ2dlZCBhcyBfRXhwZXJpbWVudGFsXyBpcyBpbiBhIGhpZ2ggc3RhdGUgb2YgZmx1eCwgeW91J3JlIGF0IHJpc2sgb2YgaXQgY2hhbmdpbmcgd2l0aG91dCBub3RpY2UuXG4gKlxuICogQHNpbmNlIDIuMi4wXG4gKi9cbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnZnAtdHMvZXM2L2Z1bmN0aW9uJztcbmltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9lczYvcGlwZWFibGUnO1xuaW1wb3J0ICogYXMgUyBmcm9tICcuL1NjaGVtYWJsZSc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdHJ1Y3RvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgbGl0ZXJhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFsdWVzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiAoe1xuICAgICAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHZhbHVlcy5maW5kSW5kZXgoZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGEgPT09IHU7IH0pICE9PSAtMTsgfVxuICAgIH0pO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHByaW1pdGl2ZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIHN0cmluZyA9IHtcbiAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHR5cGVvZiB1ID09PSAnc3RyaW5nJzsgfVxufTtcbi8qKlxuICogTm90ZTogYE5hTmAgaXMgZXhjbHVkZWQuXG4gKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIG51bWJlciA9IHtcbiAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHR5cGVvZiB1ID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odSk7IH1cbn07XG4vKipcbiAqIEBjYXRlZ29yeSBwcmltaXRpdmVzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciBib29sZWFuID0ge1xuICAgIGlzOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gdHlwZW9mIHUgPT09ICdib29sZWFuJzsgfVxufTtcbi8qKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIFVua25vd25BcnJheSA9IHtcbiAgICBpczogQXJyYXkuaXNBcnJheVxufTtcbi8qKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIFVua25vd25SZWNvcmQgPSB7XG4gICAgaXM6IGZ1bmN0aW9uICh1KSB7IHJldHVybiB1ICE9PSBudWxsICYmIHR5cGVvZiB1ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh1KTsgfVxufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbWJpbmF0b3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgcmVmaW5lID0gZnVuY3Rpb24gKHJlZmluZW1lbnQpIHsgcmV0dXJuIGZ1bmN0aW9uIChmcm9tKSB7IHJldHVybiAoe1xuICAgIGlzOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gZnJvbS5pcyhpKSAmJiByZWZpbmVtZW50KGkpOyB9XG59KTsgfTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciBudWxsYWJsZSA9IGZ1bmN0aW9uIChvcikgeyByZXR1cm4gKHtcbiAgICBpczogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIGkgPT09IG51bGwgfHwgb3IuaXMoaSk7IH1cbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMTVcbiAqL1xuZXhwb3J0IHZhciBzdHJ1Y3QgPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xuICAgIHJldHVybiBwaXBlKFVua25vd25SZWNvcmQsIHJlZmluZShmdW5jdGlvbiAocikge1xuICAgICAgICBmb3IgKHZhciBrIGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmICghKGsgaW4gcikgfHwgIXByb3BlcnRpZXNba10uaXMocltrXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSkpO1xufTtcbi8qKlxuICogVXNlIGBzdHJ1Y3RgIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgdHlwZSA9IHN0cnVjdDtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciBwYXJ0aWFsID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICByZXR1cm4gcGlwZShVbmtub3duUmVjb3JkLCByZWZpbmUoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgZm9yICh2YXIgayBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB2YXIgdiA9IHJba107XG4gICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkICYmICFwcm9wZXJ0aWVzW2tdLmlzKHYpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgYXJyYXkgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBwaXBlKFVua25vd25BcnJheSwgcmVmaW5lKGZ1bmN0aW9uICh1cykgeyByZXR1cm4gdXMuZXZlcnkoaXRlbS5pcyk7IH0pKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgcmVjb3JkID0gZnVuY3Rpb24gKGNvZG9tYWluKSB7XG4gICAgcmV0dXJuIHBpcGUoVW5rbm93blJlY29yZCwgcmVmaW5lKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIGZvciAodmFyIGsgaW4gcikge1xuICAgICAgICAgICAgaWYgKCFjb2RvbWFpbi5pcyhyW2tdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIHR1cGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb21wb25lbnRzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgY29tcG9uZW50c1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICByZXR1cm4gKHtcbiAgICAgICAgaXM6IGZ1bmN0aW9uICh1KSB7IHJldHVybiBBcnJheS5pc0FycmF5KHUpICYmIHUubGVuZ3RoID09PSBjb21wb25lbnRzLmxlbmd0aCAmJiBjb21wb25lbnRzLmV2ZXJ5KGZ1bmN0aW9uIChjLCBpKSB7IHJldHVybiBjLmlzKHVbaV0pOyB9KTsgfVxuICAgIH0pO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciBpbnRlcnNlY3QgPSBmdW5jdGlvbiAocmlnaHQpIHsgcmV0dXJuIGZ1bmN0aW9uIChsZWZ0KSB7IHJldHVybiAoe1xuICAgIGlzOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gbGVmdC5pcyh1KSAmJiByaWdodC5pcyh1KTsgfVxufSk7IH07IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgdW5pb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1lbWJlcnMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBtZW1iZXJzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiAoe1xuICAgICAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIG1lbWJlcnMuc29tZShmdW5jdGlvbiAobSkgeyByZXR1cm4gbS5pcyh1KTsgfSk7IH1cbiAgICB9KTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgc3VtID0gZnVuY3Rpb24gKHRhZykgeyByZXR1cm4gZnVuY3Rpb24gKG1lbWJlcnMpIHtcbiAgICByZXR1cm4gcGlwZShVbmtub3duUmVjb3JkLCByZWZpbmUoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgdmFyIHYgPSByW3RhZ107XG4gICAgICAgIGlmICh2IGluIG1lbWJlcnMpIHtcbiAgICAgICAgICAgIHJldHVybiBtZW1iZXJzW3ZdLmlzKHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KSk7XG59OyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIGxhenkgPSBmdW5jdGlvbiAoZikge1xuICAgIHZhciBnZXQgPSBTLm1lbW9pemUoZik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXM6IGZ1bmN0aW9uICh1KSB7IHJldHVybiBnZXQoKS5pcyh1KTsgfVxuICAgIH07XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMTVcbiAqL1xuZXhwb3J0IHZhciByZWFkb25seSA9IGlkZW50aXR5O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGFsdCA9IGZ1bmN0aW9uICh0aGF0KSB7IHJldHVybiBmdW5jdGlvbiAobWUpIHsgcmV0dXJuICh7XG4gICAgaXM6IGZ1bmN0aW9uIChpKSB7IHJldHVybiBtZS5pcyhpKSB8fCB0aGF0KCkuaXMoaSk7IH1cbn0pOyB9OyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIHplcm8gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgIGlzOiBmdW5jdGlvbiAoXykgeyByZXR1cm4gZmFsc2U7IH1cbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGNvbXBvc2UgPSBmdW5jdGlvbiAodG8pIHsgcmV0dXJuIGZ1bmN0aW9uIChmcm9tKSB7IHJldHVybiAoe1xuICAgIGlzOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gZnJvbS5pcyhpKSAmJiB0by5pcyhpKTsgfVxufSk7IH07IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgaWQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgIGlzOiBmdW5jdGlvbiAoXykgeyByZXR1cm4gdHJ1ZTsgfVxufSk7IH07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBpbnN0YW5jZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgVVJJID0gJ2lvLXRzL0d1YXJkJztcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgU2NoZW1hYmxlID0ge1xuICAgIFVSSTogVVJJLFxuICAgIGxpdGVyYWw6IGxpdGVyYWwsXG4gICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgbnVtYmVyOiBudW1iZXIsXG4gICAgYm9vbGVhbjogYm9vbGVhbixcbiAgICBudWxsYWJsZTogbnVsbGFibGUsXG4gICAgdHlwZTogdHlwZSxcbiAgICBzdHJ1Y3Q6IHN0cnVjdCxcbiAgICBwYXJ0aWFsOiBwYXJ0aWFsLFxuICAgIHJlY29yZDogcmVjb3JkLFxuICAgIGFycmF5OiBhcnJheSxcbiAgICB0dXBsZTogdHVwbGUsXG4gICAgaW50ZXJzZWN0OiBpbnRlcnNlY3QsXG4gICAgc3VtOiBzdW0sXG4gICAgbGF6eTogZnVuY3Rpb24gKF8sIGYpIHsgcmV0dXJuIGxhenkoZik7IH0sXG4gICAgcmVhZG9ubHk6IHJlYWRvbmx5XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBXaXRoVW5rbm93bkNvbnRhaW5lcnMgPSB7XG4gICAgVW5rbm93bkFycmF5OiBVbmtub3duQXJyYXksXG4gICAgVW5rbm93blJlY29yZDogVW5rbm93blJlY29yZFxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgV2l0aFVuaW9uID0ge1xuICAgIHVuaW9uOiB1bmlvblxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgV2l0aFJlZmluZSA9IHtcbiAgICByZWZpbmU6IHJlZmluZVxufTtcbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvZXM2L0VpdGhlcic7XG5pbXBvcnQgKiBhcyBHIGZyb20gJy4vR3VhcmQnO1xuaW1wb3J0ICogYXMgUyBmcm9tICcuL1NjaGVtYWJsZSc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdHJ1Y3RvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUmVmaW5lbWVudChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyZWZpbmVtZW50LCBvbkVycm9yKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpKSB7IHJldHVybiAocmVmaW5lbWVudChpKSA/IE0ub2YoaSkgOiBNLnRocm93RXJyb3Iob25FcnJvcihpKSkpOyB9XG4gICAgfSk7IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGl0ZXJhbChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbkVycm9yKSB7IHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhbHVlc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoe1xuICAgICAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gKEcubGl0ZXJhbC5hcHBseShHLCB2YWx1ZXMpLmlzKGkpID8gTS5vZihpKSA6IE0udGhyb3dFcnJvcihvbkVycm9yKGksIHZhbHVlcykpKTsgfVxuICAgICAgICB9KTtcbiAgICB9OyB9O1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gY29tYmluYXRvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcExlZnRXaXRoSW5wdXQoTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGRlY29kZXIpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIE0ubWFwTGVmdChkZWNvZGVyLmRlY29kZShpKSwgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGYoaSwgZSk7IH0pOyB9XG4gICAgfSk7IH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWZpbmUoTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocmVmaW5lbWVudCwgb25FcnJvcikgeyByZXR1cm4gZnVuY3Rpb24gKGZyb20pIHsgcmV0dXJuIGNvbXBvc2UoTSkoZnJvbVJlZmluZW1lbnQoTSkocmVmaW5lbWVudCwgb25FcnJvcikpKGZyb20pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2UoTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZGVjb2RlKSB7IHJldHVybiBmdW5jdGlvbiAoZnJvbSkgeyByZXR1cm4gY29tcG9zZShNKSh7IGRlY29kZTogZGVjb2RlIH0pKGZyb20pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gbnVsbGFibGUoTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAob25FcnJvcikgeyByZXR1cm4gZnVuY3Rpb24gKG9yKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gaSA9PT0gbnVsbFxuICAgICAgICAgICAgICAgID8gTS5vZihudWxsKVxuICAgICAgICAgICAgICAgIDogTS5iaW1hcChvci5kZWNvZGUoaSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBvbkVycm9yKGksIGUpOyB9LCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gYTsgfSk7XG4gICAgICAgIH1cbiAgICB9KTsgfTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjE1XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tU3RydWN0KE0pIHtcbiAgICB2YXIgdHJhdmVyc2UgPSB0cmF2ZXJzZVJlY29yZFdpdGhJbmRleChNKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uUHJvcGVydHlFcnJvcikgeyByZXR1cm4gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmF2ZXJzZShwcm9wZXJ0aWVzLCBmdW5jdGlvbiAoa2V5LCBkZWNvZGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE0ubWFwTGVmdChkZWNvZGVyLmRlY29kZShpW2tleV0pLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25Qcm9wZXJ0eUVycm9yKGtleSwgZSk7IH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTsgfTsgfTtcbn1cbi8qKlxuICogVXNlIGBmcm9tU3RydWN0YCBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgdmFyIGZyb21UeXBlID0gZnJvbVN0cnVjdDtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21QYXJ0aWFsKE0pIHtcbiAgICB2YXIgdHJhdmVyc2UgPSB0cmF2ZXJzZVJlY29yZFdpdGhJbmRleChNKTtcbiAgICB2YXIgdW5kZWZpbmVkUHJvcGVydHkgPSBNLm9mKEUucmlnaHQodW5kZWZpbmVkKSk7XG4gICAgdmFyIHNraXBQcm9wZXJ0eSA9IE0ub2YoRS5sZWZ0KHVuZGVmaW5lZCkpO1xuICAgIHJldHVybiBmdW5jdGlvbiAob25Qcm9wZXJ0eUVycm9yKSB7IHJldHVybiBmdW5jdGlvbiAocHJvcGVydGllcykgeyByZXR1cm4gKHtcbiAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIE0ubWFwKHRyYXZlcnNlKHByb3BlcnRpZXMsIGZ1bmN0aW9uIChrZXksIGRlY29kZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgaWtleSA9IGlba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoaWtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXkgaW4gaVxuICAgICAgICAgICAgICAgICAgICAgICAgPyAvLyBkb24ndCBzdHJpcCB1bmRlZmluZWQgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZFByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICA6IC8vIGRvbid0IGFkZCBtaXNzaW5nIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBza2lwUHJvcGVydHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBNLmJpbWFwKGRlY29kZXIuZGVjb2RlKGlrZXkpLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25Qcm9wZXJ0eUVycm9yKGtleSwgZSk7IH0sIGZ1bmN0aW9uIChhKSB7IHJldHVybiBFLnJpZ2h0KGEpOyB9KTtcbiAgICAgICAgICAgIH0pLCBjb21wYWN0UmVjb3JkKTtcbiAgICAgICAgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUFycmF5KE0pIHtcbiAgICB2YXIgdHJhdmVyc2UgPSB0cmF2ZXJzZUFycmF5V2l0aEluZGV4KE0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAob25JdGVtRXJyb3IpIHsgcmV0dXJuIGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpcykgeyByZXR1cm4gdHJhdmVyc2UoaXMsIGZ1bmN0aW9uIChpbmRleCwgaSkgeyByZXR1cm4gTS5tYXBMZWZ0KGl0ZW0uZGVjb2RlKGkpLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25JdGVtRXJyb3IoaW5kZXgsIGUpOyB9KTsgfSk7IH1cbiAgICB9KTsgfTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21SZWNvcmQoTSkge1xuICAgIHZhciB0cmF2ZXJzZSA9IHRyYXZlcnNlUmVjb3JkV2l0aEluZGV4KE0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAob25LZXlFcnJvcikgeyByZXR1cm4gZnVuY3Rpb24gKGNvZG9tYWluKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpcikgeyByZXR1cm4gdHJhdmVyc2UoaXIsIGZ1bmN0aW9uIChrZXksIGkpIHsgcmV0dXJuIE0ubWFwTGVmdChjb2RvbWFpbi5kZWNvZGUoaSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBvbktleUVycm9yKGtleSwgZSk7IH0pOyB9KTsgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbVR1cGxlKE0pIHtcbiAgICB2YXIgdHJhdmVyc2UgPSB0cmF2ZXJzZUFycmF5V2l0aEluZGV4KE0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAob25JbmRleEVycm9yKSB7IHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb21wb25lbnRzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBjb21wb25lbnRzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh7XG4gICAgICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmF2ZXJzZShjb21wb25lbnRzLCBmdW5jdGlvbiAoaW5kZXgsIGRlY29kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE0ubWFwTGVmdChkZWNvZGVyLmRlY29kZShpc1tpbmRleF0pLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25JbmRleEVycm9yKGluZGV4LCBlKTsgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlvbihNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbk1lbWJlckVycm9yKSB7IHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBtZW1iZXJzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBtZW1iZXJzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh7XG4gICAgICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG91dCA9IE0ubWFwTGVmdChtZW1iZXJzWzBdLmRlY29kZShpKSwgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIG9uTWVtYmVyRXJyb3IoMCwgZSk7IH0pO1xuICAgICAgICAgICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIG91dCA9IE0uYWx0KG91dCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gTS5tYXBMZWZ0KG1lbWJlcnNbaW5kZXhdLmRlY29kZShpKSwgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIG9uTWVtYmVyRXJyb3IoaW5kZXgsIGUpOyB9KTsgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgbWVtYmVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgX2xvb3BfMShpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnNlY3QoTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocmlnaHQpIHsgcmV0dXJuIGZ1bmN0aW9uIChsZWZ0KSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gTS5hcChNLm1hcChsZWZ0LmRlY29kZShpKSwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBTLmludGVyc2VjdF8oYSwgYik7IH07IH0pLCByaWdodC5kZWNvZGUoaSkpO1xuICAgICAgICB9XG4gICAgfSk7IH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tU3VtKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uVGFnRXJyb3IpIHsgcmV0dXJuIGZ1bmN0aW9uICh0YWcpIHsgcmV0dXJuIGZ1bmN0aW9uIChtZW1iZXJzKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMobWVtYmVycyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpcikge1xuICAgICAgICAgICAgICAgIHZhciB2ID0gaXJbdGFnXTtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1lbWJlcnMsIHYpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZW1iZXJzW3ZdLmRlY29kZShpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBNLnRocm93RXJyb3Iob25UYWdFcnJvcih0YWcsIHYsIGtleXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9OyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGF6eShNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbkVycm9yKSB7IHJldHVybiBmdW5jdGlvbiAoaWQsIGYpIHtcbiAgICAgICAgdmFyIGdldCA9IFMubWVtb2l6ZShmKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRlY29kZTogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIE0ubWFwTGVmdChnZXQoKS5kZWNvZGUodSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBvbkVycm9yKGlkLCBlKTsgfSk7IH1cbiAgICAgICAgfTtcbiAgICB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZShNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhYikgeyByZXR1cm4gZnVuY3Rpb24gKGlhKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpKSB7IHJldHVybiBNLmNoYWluKGlhLmRlY29kZShpKSwgYWIuZGVjb2RlKTsgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgZnVuY3Rpb24gaWQoTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IE0ub2ZcbiAgICB9KTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoaWEpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIEYubWFwKGlhLmRlY29kZShpKSwgZik7IH1cbiAgICB9KTsgfTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFsdChBKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0KSB7IHJldHVybiBmdW5jdGlvbiAobWUpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIEEuYWx0KG1lLmRlY29kZShpKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhhdCgpLmRlY29kZShpKTsgfSk7IH1cbiAgICB9KTsgfTsgfTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgdHJhdmVyc2VBcnJheVdpdGhJbmRleCA9IGZ1bmN0aW9uIChNKSB7IHJldHVybiBmdW5jdGlvbiAoYXMsIGYpIHtcbiAgICByZXR1cm4gYXMucmVkdWNlKGZ1bmN0aW9uIChtYnMsIGEsIGkpIHtcbiAgICAgICAgcmV0dXJuIE0uYXAoTS5tYXAobWJzLCBmdW5jdGlvbiAoYnMpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICBicy5wdXNoKGIpO1xuICAgICAgICAgICAgcmV0dXJuIGJzO1xuICAgICAgICB9OyB9KSwgZihpLCBhKSk7XG4gICAgfSwgTS5vZihbXSkpO1xufTsgfTtcbnZhciB0cmF2ZXJzZVJlY29yZFdpdGhJbmRleCA9IGZ1bmN0aW9uIChNKSB7IHJldHVybiBmdW5jdGlvbiAociwgZikge1xuICAgIHZhciBrcyA9IE9iamVjdC5rZXlzKHIpO1xuICAgIGlmIChrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIE0ub2Yoe30pO1xuICAgIH1cbiAgICB2YXIgZnIgPSBNLm9mKHt9KTtcbiAgICB2YXIgX2xvb3BfMiA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgZnIgPSBNLmFwKE0ubWFwKGZyLCBmdW5jdGlvbiAocikgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgIHJba2V5XSA9IGI7XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfTsgfSksIGYoa2V5LCByW2tleV0pKTtcbiAgICB9O1xuICAgIGZvciAodmFyIF9pID0gMCwga3NfMSA9IGtzOyBfaSA8IGtzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBrc18xW19pXTtcbiAgICAgICAgX2xvb3BfMihrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gZnI7XG59OyB9O1xudmFyIGNvbXBhY3RSZWNvcmQgPSBmdW5jdGlvbiAocikge1xuICAgIHZhciBvdXQgPSB7fTtcbiAgICBmb3IgKHZhciBrIGluIHIpIHtcbiAgICAgICAgdmFyIHJrID0gcltrXTtcbiAgICAgICAgaWYgKEUuaXNSaWdodChyaykpIHtcbiAgICAgICAgICAgIG91dFtrXSA9IHJrLnJpZ2h0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59O1xuIiwiLyoqXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lbW9pemUoZikge1xuICAgIHZhciBjYWNoZSA9IG5ldyBNYXAoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgaWYgKCFjYWNoZS5oYXMoYSkpIHtcbiAgICAgICAgICAgIHZhciBiID0gZihhKTtcbiAgICAgICAgICAgIGNhY2hlLnNldChhLCBiKTtcbiAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWNoZS5nZXQoYSk7XG4gICAgfTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgdHlwZU9mID0gZnVuY3Rpb24gKHgpIHsgcmV0dXJuICh4ID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHgpOyB9O1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IHZhciBpbnRlcnNlY3RfID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICBpZiAoYSAhPT0gdW5kZWZpbmVkICYmIGIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgdHggPSB0eXBlT2YoYSk7XG4gICAgICAgIHZhciB0eSA9IHR5cGVPZihiKTtcbiAgICAgICAgaWYgKHR4ID09PSAnb2JqZWN0JyB8fCB0eSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBhLCBiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYjtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvd1tcIlRoaW5raW5nSG9tZVVpXCJdOyIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93W1widGhSZWFjdFwiXTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3JlYXRlTW9kdWxlLCBMb2dMZXZlbCwgdXNlQXBwQ29udGV4dCwgdXNlTG9nZ2VyLCB1c2VNZXNzYWdlSGFuZGxlciB9IGZyb20gJ0B0aGlua2luZy1ob21lL3VpJztcbmltcG9ydCAqIGFzIGQgZnJvbSAnaW8tdHMvRGVjb2Rlcic7XG5jb25zdCB0bXBQaWdEZWNvZGVyID0gZC5zdHJ1Y3Qoe1xuICAgIG5hbWU6IGQuc3RyaW5nLFxuICAgIHNpemU6IGQubnVtYmVyLFxufSk7XG5jb25zdCBUT1BJQyA9ICdtaC1leGFtcGxlJztcbmNvbnN0IFRtcFBpZ1RvYXN0ID0gKGUpID0+IHtcbiAgICBjb25zdCB7IG1zZzogeyB0b3BpYywgZ3VpZCwgdGltZXN0YW1wLCBkYXRhOiB7IG5hbWUsIHNpemUgfSB9LCBjb3VudGVyIH0gPSBlO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCBcIk5ldyBNZXNzYWdlOlwiKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgICAgIFwiQ1VSUkVOVCBWQUxVRTogXCIsXG4gICAgICAgICAgICBjb3VudGVyKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgICAgICAgXCJ0b3BpYzogXCIsXG4gICAgICAgICAgICB0b3BpYyksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgICAgIFwiZ3VpZDogXCIsXG4gICAgICAgICAgICBndWlkKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgICAgICAgXCJ0aW1lc3RhbXA6IFwiLFxuICAgICAgICAgICAgdGltZXN0YW1wKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgICAgICAgXCJwaWc6IFwiLFxuICAgICAgICAgICAgbmFtZSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgICAgIFwic2l6ZTogXCIsXG4gICAgICAgICAgICBzaXplKSkpO1xufTtcbmNvbnN0IFRtcFNlY3Rpb24gPSAoKSA9PiB7XG4gICAgY29uc3QgeyBtZXNzYWdlSHViOiB7IHNlbmQgfSwgdG9hc3RlcjogeyBzaG93SW5mbyB9IH0gPSB1c2VBcHBDb250ZXh0KCk7XG4gICAgY29uc3QgW3ZhbHVlLCBzZXRWYWx1ZV0gPSB1c2VTdGF0ZSgwKTtcbiAgICBjb25zdCBsb2dnZXIgPSB1c2VMb2dnZXIoKTtcbiAgICB1c2VNZXNzYWdlSGFuZGxlcihUT1BJQywgdG1wUGlnRGVjb2RlciwgKG1zZykgPT4ge1xuICAgICAgICBzaG93SW5mbyhSZWFjdC5jcmVhdGVFbGVtZW50KFRtcFBpZ1RvYXN0LCB7IG1zZzogbXNnLCBjb3VudGVyOiB2YWx1ZSB9KSk7XG4gICAgICAgIGxvZ2dlci5sb2coTG9nTGV2ZWwuSW5mb3JtYXRpb24sICdtZXNzYWdlIHdhcyByZWNlaXZlZCcpO1xuICAgIH0sIFtzaG93SW5mbywgdmFsdWUsIGxvZ2dlcl0pO1xuICAgIGNvbnN0IG9uQ2xpY2sgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBwcm9tcHQoJ0VudGVyIHRoZSBuYW1lIG9mIHRoZSBwaWcnKTtcbiAgICAgICAgc2VuZChUT1BJQywgeyBuYW1lLCBzaXplOiB2YWx1ZSB9KTtcbiAgICAgICAgbG9nZ2VyLmxvZyhMb2dMZXZlbC5JbmZvcm1hdGlvbiwgJ2J1dHRvbiBoYXMgYmVlbiBwcmVzc2VkJyk7XG4gICAgfSwgW3NlbmQsIHZhbHVlLCBsb2dnZXJdKTtcbiAgICBjb25zdCBvbkluY2VtZW50ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBzZXRWYWx1ZSh2YWx1ZSArIDEpO1xuICAgIH0sIFt2YWx1ZSwgc2V0VmFsdWVdKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCxcbiAgICAgICAgICAgIFwiQ3VycmVudCB2YWx1ZTogXCIsXG4gICAgICAgICAgICB2YWx1ZSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgeyBvbkNsaWNrOiBvbkNsaWNrIH0sIFwiU2VuZCBwaWcgbWVzc2FnZVwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7IG9uQ2xpY2s6IG9uSW5jZW1lbnQgfSwgXCJJbmNlbWVudFwiKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZU1vZHVsZShUbXBTZWN0aW9uKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==