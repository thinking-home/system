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
/* harmony export */   chainFirst: () => (/* binding */ chainFirst),
/* harmony export */   tap: () => (/* binding */ tap)
/* harmony export */ });
function chainFirst(M) {
    var tapM = tap(M);
    return function (f) { return function (first) { return tapM(first, f); }; };
}
/** @internal */
function tap(M) {
    return function (first, f) { return M.chain(first, function (a) { return M.map(f(a), function () { return a; }); }); };
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
/* harmony export */   as: () => (/* binding */ as),
/* harmony export */   asUnit: () => (/* binding */ asUnit),
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
/* harmony export */   flatMapNullable: () => (/* binding */ flatMapNullable),
/* harmony export */   flatMapOption: () => (/* binding */ flatMapOption),
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
/* harmony export */   liftNullable: () => (/* binding */ liftNullable),
/* harmony export */   liftOption: () => (/* binding */ liftOption),
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
/* harmony export */   tap: () => (/* binding */ tap),
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
/* harmony import */ var _FromEither__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./FromEither */ "./node_modules/fp-ts/es6/FromEither.js");
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./function */ "./node_modules/fp-ts/es6/function.js");
/* harmony import */ var _Functor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Functor */ "./node_modules/fp-ts/es6/Functor.js");
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
 * Maps the `Right` value of this `Either` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
var as = (0,_function__WEBPACK_IMPORTED_MODULE_1__.dual)(2, (0,_Functor__WEBPACK_IMPORTED_MODULE_5__.as)(Functor));
/**
 * Maps the `Right` value of this `Either` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
var asUnit = (0,_Functor__WEBPACK_IMPORTED_MODULE_5__.asUnit)(Functor);
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
var fromPredicate = /*#__PURE__*/ (0,_FromEither__WEBPACK_IMPORTED_MODULE_6__.fromPredicate)(FromEither);
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
/*#__PURE__*/ (0,_FromEither__WEBPACK_IMPORTED_MODULE_6__.fromOption)(FromEither);
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
var flap = /*#__PURE__*/ (0,_Functor__WEBPACK_IMPORTED_MODULE_5__.flap)(Functor);
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
 * @category combinators
 * @since 2.15.0
 */
var tap = /*#__PURE__*/ (0,_function__WEBPACK_IMPORTED_MODULE_1__.dual)(2, _Chain__WEBPACK_IMPORTED_MODULE_8__.tap(Chain));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
var flattenW = 
/*#__PURE__*/ flatMap(_function__WEBPACK_IMPORTED_MODULE_1__.identity);
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
 * Use `liftOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
var fromOptionK = 
/*#__PURE__*/ (0,_FromEither__WEBPACK_IMPORTED_MODULE_6__.fromOptionK)(FromEither);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.11.0
 */
var chainOptionK = /*#__PURE__*/ (0,_FromEither__WEBPACK_IMPORTED_MODULE_6__.chainOptionK)(FromEither, Chain);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.13.2
 */
var chainOptionKW = chainOptionK;
/** @internal */
var _FromEither = {
    fromEither: FromEither.fromEither
};
/**
 * @category lifting
 * @since 2.15.0
 */
var liftNullable = /*#__PURE__*/ _internal__WEBPACK_IMPORTED_MODULE_0__.liftNullable(_FromEither);
/**
 * @category lifting
 * @since 2.15.0
 */
var liftOption = /*#__PURE__*/ _internal__WEBPACK_IMPORTED_MODULE_0__.liftOption(_FromEither);
/** @internal */
var _FlatMap = {
    flatMap: flatMap
};
/**
 * @category sequencing
 * @since 2.15.0
 */
var flatMapNullable = /*#__PURE__*/ _internal__WEBPACK_IMPORTED_MODULE_0__.flatMapNullable(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.15.0
 */
var flatMapOption = /*#__PURE__*/ _internal__WEBPACK_IMPORTED_MODULE_0__.flatMapOption(_FromEither, _FlatMap);
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
var filterOrElse = /*#__PURE__*/ (0,_FromEither__WEBPACK_IMPORTED_MODULE_6__.filterOrElse)(FromEither, Chain);
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
 * Use `liftNullable`.
 *
 * @category legacy
 * @since 2.9.0
 */
var fromNullableK = function (e) {
    var from = fromNullable(e);
    return function (f) { return (0,_function__WEBPACK_IMPORTED_MODULE_1__.flow)(f, from); };
};
/**
 * Use `flatMapNullable`.
 *
 * @category legacy
 * @since 2.9.0
 */
var chainNullableK = function (e) {
    var from = fromNullableK(e);
    return function (f) { return flatMap(from(f)); };
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
    try {
        return e instanceof Error ? e : new Error(String(e));
    }
    catch (error) {
        return new Error();
    }
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
var bindTo = /*#__PURE__*/ (0,_Functor__WEBPACK_IMPORTED_MODULE_5__.bindTo)(Functor);
var let_ = /*#__PURE__*/ (0,_Functor__WEBPACK_IMPORTED_MODULE_5__["let"])(Functor);

/**
 * @category do notation
 * @since 2.8.0
 */
var bind = /*#__PURE__*/ _Chain__WEBPACK_IMPORTED_MODULE_8__.bind(Chain);
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
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
var chainW = flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
var chain = flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
var chainFirst = tap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.8.0
 */
var chainFirstW = tap;
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
/* harmony export */   fromPredicate: () => (/* binding */ fromPredicate),
/* harmony export */   tapEither: () => (/* binding */ tapEither)
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
    var tapEitherM = tapEither(F, M);
    return function (f) { return function (ma) { return tapEitherM(ma, f); }; };
}
function filterOrElse(F, M) {
    return function (predicate, onFalse) {
        return function (ma) {
            return M.chain(ma, function (a) { return F.fromEither(predicate(a) ? _internal__WEBPACK_IMPORTED_MODULE_0__.right(a) : _internal__WEBPACK_IMPORTED_MODULE_0__.left(onFalse(a))); });
        };
    };
}
/** @internal */
function tapEither(F, M) {
    var fromEither = fromEitherK(F);
    var tapM = (0,_Chain__WEBPACK_IMPORTED_MODULE_2__.tap)(M);
    return function (self, f) { return tapM(self, fromEither(f)); };
}


/***/ }),

/***/ "./node_modules/fp-ts/es6/Functor.js":
/*!*******************************************!*\
  !*** ./node_modules/fp-ts/es6/Functor.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   as: () => (/* binding */ as),
/* harmony export */   asUnit: () => (/* binding */ asUnit),
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
/** @internal */
function as(F) {
    return function (self, b) { return F.map(self, function () { return b; }); };
}
/** @internal */
function asUnit(F) {
    var asM = as(F);
    return function (self) { return asM(self, undefined); };
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
/* harmony export */   flatMapEither: () => (/* binding */ flatMapEither),
/* harmony export */   flatMapIO: () => (/* binding */ flatMapIO),
/* harmony export */   flatMapNullable: () => (/* binding */ flatMapNullable),
/* harmony export */   flatMapOption: () => (/* binding */ flatMapOption),
/* harmony export */   flatMapReader: () => (/* binding */ flatMapReader),
/* harmony export */   flatMapTask: () => (/* binding */ flatMapTask),
/* harmony export */   fromReadonlyNonEmptyArray: () => (/* binding */ fromReadonlyNonEmptyArray),
/* harmony export */   has: () => (/* binding */ has),
/* harmony export */   head: () => (/* binding */ head),
/* harmony export */   isLeft: () => (/* binding */ isLeft),
/* harmony export */   isNonEmpty: () => (/* binding */ isNonEmpty),
/* harmony export */   isNone: () => (/* binding */ isNone),
/* harmony export */   isRight: () => (/* binding */ isRight),
/* harmony export */   isSome: () => (/* binding */ isSome),
/* harmony export */   left: () => (/* binding */ left),
/* harmony export */   liftNullable: () => (/* binding */ liftNullable),
/* harmony export */   liftOption: () => (/* binding */ liftOption),
/* harmony export */   none: () => (/* binding */ none),
/* harmony export */   right: () => (/* binding */ right),
/* harmony export */   singleton: () => (/* binding */ singleton),
/* harmony export */   some: () => (/* binding */ some),
/* harmony export */   tail: () => (/* binding */ tail)
/* harmony export */ });
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./function */ "./node_modules/fp-ts/es6/function.js");
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
/** @internal */
var liftNullable = function (F) {
    return function (f, onNullable) {
        return function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            var o = f.apply(void 0, a);
            return F.fromEither(o == null ? left(onNullable.apply(void 0, a)) : right(o));
        };
    };
};
/** @internal */
var liftOption = function (F) {
    return function (f, onNone) {
        return function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            var o = f.apply(void 0, a);
            return F.fromEither(isNone(o) ? left(onNone.apply(void 0, a)) : right(o.value));
        };
    };
};
/** @internal */
var flatMapNullable = function (F, M) {
    return /*#__PURE__*/ (0,_function__WEBPACK_IMPORTED_MODULE_0__.dual)(3, function (self, f, onNullable) {
        return M.flatMap(self, liftNullable(F)(f, onNullable));
    });
};
/** @internal */
var flatMapOption = function (F, M) {
    return /*#__PURE__*/ (0,_function__WEBPACK_IMPORTED_MODULE_0__.dual)(3, function (self, f, onNone) { return M.flatMap(self, liftOption(F)(f, onNone)); });
};
/** @internal */
var flatMapEither = function (F, M) {
    return /*#__PURE__*/ (0,_function__WEBPACK_IMPORTED_MODULE_0__.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromEither(f(a)); });
    });
};
/** @internal */
var flatMapIO = function (F, M) {
    return /*#__PURE__*/ (0,_function__WEBPACK_IMPORTED_MODULE_0__.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromIO(f(a)); });
    });
};
/** @internal */
var flatMapTask = function (F, M) {
    return /*#__PURE__*/ (0,_function__WEBPACK_IMPORTED_MODULE_0__.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromTask(f(a)); });
    });
};
/** @internal */
var flatMapReader = function (F, M) {
    return /*#__PURE__*/ (0,_function__WEBPACK_IMPORTED_MODULE_0__.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromReader(f(a)); });
    });
};


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
var fromSum = function (tag) {
    return function (members) {
        return _Kleisli__WEBPACK_IMPORTED_MODULE_4__.fromSum(M)(function (tag, value, keys) {
            return _FreeSemigroup__WEBPACK_IMPORTED_MODULE_3__.of(_DecodeError__WEBPACK_IMPORTED_MODULE_0__.key(tag, _DecodeError__WEBPACK_IMPORTED_MODULE_0__.required, error(value, keys.length === 0 ? 'never' : keys.map(function (k) { return JSON.stringify(k); }).join(' | '))));
        })(tag)(members);
    };
};
/**
 * @category combinators
 * @since 2.2.7
 */
var sum = function (tag) {
    return function (members) {
        return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_2__.pipe)(UnknownRecord, compose(fromSum(tag)(members)));
    };
};
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
var fold = function (onOf, onConcat) {
    return function (f) {
        switch (f._tag) {
            case 'Of':
                return onOf(f.value);
            case 'Concat':
                return onConcat(f.left, f.right);
        }
    };
};
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
var refine = function (refinement) {
    return function (from) { return ({
        is: function (i) { return from.is(i) && refinement(i); }
    }); };
};
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
var intersect = function (right) {
    return function (left) { return ({
        is: function (u) { return left.is(u) && right.is(u); }
    }); };
};
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
var sum = function (tag) {
    return function (members) {
        return (0,fp_ts_es6_pipeable__WEBPACK_IMPORTED_MODULE_0__.pipe)(UnknownRecord, refine(function (r) {
            var v = r[tag];
            if (v in members) {
                return members[v].is(r);
            }
            return false;
        }));
    };
};
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
var alt = function (that) {
    return function (me) { return ({
        is: function (i) { return me.is(i) || that().is(i); }
    }); };
};
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
var compose = function (to) {
    return function (from) { return ({
        is: function (i) { return from.is(i) && to.is(i); }
    }); };
};
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
    return function (onError) {
        return function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            return ({
                decode: function (i) { return (_Guard__WEBPACK_IMPORTED_MODULE_0__.literal.apply(_Guard__WEBPACK_IMPORTED_MODULE_0__, values).is(i) ? M.of(i) : M.throwError(onError(i, values))); }
            });
        };
    };
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
    return function (onError) {
        return function (or) { return ({
            decode: function (i) {
                return i === null
                    ? M.of(null)
                    : M.bimap(or.decode(i), function (e) { return onError(i, e); }, function (a) { return a; });
            }
        }); };
    };
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
    return function (onIndexError) {
        return function () {
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
        };
    };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function union(M) {
    return function (onMemberError) {
        return function () {
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
        };
    };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function intersect(M) {
    return function (right) {
        return function (left) { return ({
            decode: function (i) {
                return M.ap(M.map(left.decode(i), function (a) { return function (b) { return _Schemable__WEBPACK_IMPORTED_MODULE_2__.intersect_(a, b); }; }), right.decode(i));
            }
        }); };
    };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function fromSum(M) {
    return function (onTagError) {
        return function (tag) {
            return function (members) {
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
            };
        };
    };
}
/**
 * @category combinators
 * @since 2.2.7
 */
function lazy(M) {
    return function (onError) {
        return function (id, f) {
            var get = _Schemable__WEBPACK_IMPORTED_MODULE_2__.memoize(f);
            return {
                decode: function (u) { return M.mapLeft(get().decode(u), function (e) { return onError(id, e); }); }
            };
        };
    };
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
var traverseArrayWithIndex = function (M) {
    return function (as, f) {
        return as.reduce(function (mbs, a, i) {
            return M.ap(M.map(mbs, function (bs) { return function (b) {
                bs.push(b);
                return bs;
            }; }), f(i, a));
        }, M.of([]));
    };
};
var traverseRecordWithIndex = function (M) {
    return function (r, f) {
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
    };
};
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./frontend/page2.tsx ***!
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




const url = '/api/tmp/pigs';
const tmpPigDecoder = io_ts_Decoder__WEBPACK_IMPORTED_MODULE_2__.struct({
    id: io_ts_Decoder__WEBPACK_IMPORTED_MODULE_2__.string,
    name: io_ts_Decoder__WEBPACK_IMPORTED_MODULE_2__.string,
    size: io_ts_Decoder__WEBPACK_IMPORTED_MODULE_2__.number,
});
const tmpResponseDecoder = io_ts_Decoder__WEBPACK_IMPORTED_MODULE_2__.array(tmpPigDecoder);
const TmpSection = () => {
    const [list, setList] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const { api } = (0,_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__.useAppContext)();
    const controller = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => new AbortController(), []);
    const logger = (0,_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__.useLogger)();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        api.get(tmpResponseDecoder, { url, signal: controller.signal })
            .then(setList, (e) => logger.log(_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, e instanceof Error ? e.message : 'error'));
        return () => controller.abort();
    }, [controller, logger]);
    const cancel = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => controller.abort(), [controller]);
    const content = list.length ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", null, list.map(pig => react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", null,
        pig.name,
        " (",
        pig.size,
        ")")))) : react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, "LOADING...");
    const cancelButton = list.length ? undefined : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { onClick: cancel }, "Cancel request")));
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null,
            "This is the ",
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Test page 2"),
            " (from ",
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("code", null, "Tmp plugin"),
            ")"),
        cancelButton,
        content));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_thinking_home_ui__WEBPACK_IMPORTED_MODULE_1__.createModule)(TmpSection));

})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sOEJBQThCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyw2QkFBNkI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyw2QkFBNkI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLDRCQUE0QjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztB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QjtBQUNBLFlBQVksZ0RBQW1CO0FBQy9CO0FBQ0EsWUFBWSxnREFBbUI7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSwrREFBWSxZQUFZLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvQXBwbGljYXRpdmUuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L0FwcGx5LmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2ZwLXRzL2VzNi9DaGFpbi5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvQ2hhaW5SZWMuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L0VpdGhlci5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvRnJvbUVpdGhlci5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvRnVuY3Rvci5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvU2VwYXJhdGVkLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2ZwLXRzL2VzNi9XaXRoZXJhYmxlLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2ZwLXRzL2VzNi9mdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvaW50ZXJuYWwuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L3BpcGVhYmxlLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2lvLXRzL2VzNi9EZWNvZGVFcnJvci5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9pby10cy9lczYvRGVjb2Rlci5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9pby10cy9lczYvRnJlZVNlbWlncm91cC5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9pby10cy9lczYvR3VhcmQuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvaW8tdHMvZXM2L0tsZWlzbGkuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvaW8tdHMvZXM2L1NjaGVtYWJsZS5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC9leHRlcm5hbCB3aW5kb3cgXCJUaGlua2luZ0hvbWVVaVwiIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wL2V4dGVybmFsIHdpbmRvdyBcInRoUmVhY3RcIiIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vZnJvbnRlbmQvcGFnZTIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGBBcHBsaWNhdGl2ZWAgdHlwZSBjbGFzcyBleHRlbmRzIHRoZSBgQXBwbHlgIHR5cGUgY2xhc3Mgd2l0aCBhIGBvZmAgZnVuY3Rpb24sIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSB2YWx1ZXNcbiAqIG9mIHR5cGUgYGYgYWAgZnJvbSB2YWx1ZXMgb2YgdHlwZSBgYWAuXG4gKlxuICogV2hlcmUgYEFwcGx5YCBwcm92aWRlcyB0aGUgYWJpbGl0eSB0byBsaWZ0IGZ1bmN0aW9ucyBvZiB0d28gb3IgbW9yZSBhcmd1bWVudHMgdG8gZnVuY3Rpb25zIHdob3NlIGFyZ3VtZW50cyBhcmVcbiAqIHdyYXBwZWQgdXNpbmcgYGZgLCBhbmQgYEZ1bmN0b3JgIHByb3ZpZGVzIHRoZSBhYmlsaXR5IHRvIGxpZnQgZnVuY3Rpb25zIG9mIG9uZSBhcmd1bWVudCwgYHB1cmVgIGNhbiBiZSBzZWVuIGFzIHRoZVxuICogZnVuY3Rpb24gd2hpY2ggbGlmdHMgZnVuY3Rpb25zIG9mIF96ZXJvXyBhcmd1bWVudHMuIFRoYXQgaXMsIGBBcHBsaWNhdGl2ZWAgZnVuY3RvcnMgc3VwcG9ydCBhIGxpZnRpbmcgb3BlcmF0aW9uIGZvclxuICogYW55IG51bWJlciBvZiBmdW5jdGlvbiBhcmd1bWVudHMuXG4gKlxuICogSW5zdGFuY2VzIG11c3Qgc2F0aXNmeSB0aGUgZm9sbG93aW5nIGxhd3MgaW4gYWRkaXRpb24gdG8gdGhlIGBBcHBseWAgbGF3czpcbiAqXG4gKiAxLiBJZGVudGl0eTogYEEuYXAoQS5vZihhID0+IGEpLCBmYSkgPC0+IGZhYFxuICogMi4gSG9tb21vcnBoaXNtOiBgQS5hcChBLm9mKGFiKSwgQS5vZihhKSkgPC0+IEEub2YoYWIoYSkpYFxuICogMy4gSW50ZXJjaGFuZ2U6IGBBLmFwKGZhYiwgQS5vZihhKSkgPC0+IEEuYXAoQS5vZihhYiA9PiBhYihhKSksIGZhYilgXG4gKlxuICogTm90ZS4gYEZ1bmN0b3JgJ3MgYG1hcGAgY2FuIGJlIGRlcml2ZWQ6IGBBLm1hcCh4LCBmKSA9IEEuYXAoQS5vZihmKSwgeClgXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmltcG9ydCB7IGFwLCBnZXRBcHBseVNlbWlncm91cCB9IGZyb20gJy4vQXBwbHknO1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJy4vZnVuY3Rpb24nO1xuaW1wb3J0IHsgZ2V0RnVuY3RvckNvbXBvc2l0aW9uIH0gZnJvbSAnLi9GdW5jdG9yJztcbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGl2ZU1vbm9pZChGKSB7XG4gICAgdmFyIGYgPSBnZXRBcHBseVNlbWlncm91cChGKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKE0pIHsgcmV0dXJuICh7XG4gICAgICAgIGNvbmNhdDogZihNKS5jb25jYXQsXG4gICAgICAgIGVtcHR5OiBGLm9mKE0uZW1wdHkpXG4gICAgfSk7IH07XG59XG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGl2ZUNvbXBvc2l0aW9uKEYsIEcpIHtcbiAgICB2YXIgbWFwID0gZ2V0RnVuY3RvckNvbXBvc2l0aW9uKEYsIEcpLm1hcDtcbiAgICB2YXIgX2FwID0gYXAoRiwgRyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIG9mOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gRi5vZihHLm9mKGEpKTsgfSxcbiAgICAgICAgYXA6IGZ1bmN0aW9uIChmZ2FiLCBmZ2EpIHsgcmV0dXJuIHBpcGUoZmdhYiwgX2FwKGZnYSkpOyB9XG4gICAgfTtcbn1cbiIsIi8qKlxuICogVGhlIGBBcHBseWAgY2xhc3MgcHJvdmlkZXMgdGhlIGBhcGAgd2hpY2ggaXMgdXNlZCB0byBhcHBseSBhIGZ1bmN0aW9uIHRvIGFuIGFyZ3VtZW50IHVuZGVyIGEgdHlwZSBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBgQXBwbHlgIGNhbiBiZSB1c2VkIHRvIGxpZnQgZnVuY3Rpb25zIG9mIHR3byBvciBtb3JlIGFyZ3VtZW50cyB0byB3b3JrIG9uIHZhbHVlcyB3cmFwcGVkIHdpdGggdGhlIHR5cGUgY29uc3RydWN0b3JcbiAqIGBmYC5cbiAqXG4gKiBJbnN0YW5jZXMgbXVzdCBzYXRpc2Z5IHRoZSBmb2xsb3dpbmcgbGF3IGluIGFkZGl0aW9uIHRvIHRoZSBgRnVuY3RvcmAgbGF3czpcbiAqXG4gKiAxLiBBc3NvY2lhdGl2ZSBjb21wb3NpdGlvbjogYEYuYXAoRi5hcChGLm1hcChmYmMsIGJjID0+IGFiID0+IGEgPT4gYmMoYWIoYSkpKSwgZmFiKSwgZmEpIDwtPiBGLmFwKGZiYywgRi5hcChmYWIsIGZhKSlgXG4gKlxuICogRm9ybWFsbHksIGBBcHBseWAgcmVwcmVzZW50cyBhIHN0cm9uZyBsYXggc2VtaS1tb25vaWRhbCBlbmRvZnVuY3Rvci5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgTyBmcm9tICdmcC10cy9PcHRpb24nXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogY29uc3QgZiA9IChhOiBzdHJpbmcpID0+IChiOiBudW1iZXIpID0+IChjOiBib29sZWFuKSA9PiBhICsgU3RyaW5nKGIpICsgU3RyaW5nKGMpXG4gKiBjb25zdCBmYTogTy5PcHRpb248c3RyaW5nPiA9IE8uc29tZSgncycpXG4gKiBjb25zdCBmYjogTy5PcHRpb248bnVtYmVyPiA9IE8uc29tZSgxKVxuICogY29uc3QgZmM6IE8uT3B0aW9uPGJvb2xlYW4+ID0gTy5zb21lKHRydWUpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICAvLyBsaWZ0IGEgZnVuY3Rpb25cbiAqICAgICBPLnNvbWUoZiksXG4gKiAgICAgLy8gYXBwbHkgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiAgICAgTy5hcChmYSksXG4gKiAgICAgLy8gYXBwbHkgdGhlIHNlY29uZCBhcmd1bWVudFxuICogICAgIE8uYXAoZmIpLFxuICogICAgIC8vIGFwcGx5IHRoZSB0aGlyZCBhcmd1bWVudFxuICogICAgIE8uYXAoZmMpXG4gKiAgICksXG4gKiAgIE8uc29tZSgnczF0cnVlJylcbiAqIClcbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuaW1wb3J0IHsgdHVwbGUgfSBmcm9tICcuL2Z1bmN0aW9uJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnLi9pbnRlcm5hbCc7XG5leHBvcnQgZnVuY3Rpb24gYXAoRiwgRykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmYWIpIHtcbiAgICAgICAgICAgIHJldHVybiBGLmFwKEYubWFwKGZhYiwgZnVuY3Rpb24gKGdhYikgeyByZXR1cm4gZnVuY3Rpb24gKGdhKSB7IHJldHVybiBHLmFwKGdhYiwgZ2EpOyB9OyB9KSwgZmEpO1xuICAgICAgICB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYXBGaXJzdChBKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWNvbmQpIHsgcmV0dXJuIGZ1bmN0aW9uIChmaXJzdCkge1xuICAgICAgICByZXR1cm4gQS5hcChBLm1hcChmaXJzdCwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGE7IH07IH0pLCBzZWNvbmQpO1xuICAgIH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gYXBTZWNvbmQoQSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2Vjb25kKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZmlyc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBBLmFwKEEubWFwKGZpcnN0LCBmdW5jdGlvbiAoKSB7IHJldHVybiBmdW5jdGlvbiAoYikgeyByZXR1cm4gYjsgfTsgfSksIHNlY29uZCk7XG4gICAgICAgIH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhcFMoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSwgZmIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgICAgICAgICAgcmV0dXJuIEYuYXAoRi5tYXAoZmEsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYSwgKF9hID0ge30sIF9hW25hbWVdID0gYiwgX2EpKTtcbiAgICAgICAgICAgIH07IH0pLCBmYik7XG4gICAgICAgIH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBseVNlbWlncm91cChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChTKSB7IHJldHVybiAoe1xuICAgICAgICBjb25jYXQ6IGZ1bmN0aW9uIChmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgICAgICByZXR1cm4gRi5hcChGLm1hcChmaXJzdCwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIGZ1bmN0aW9uICh5KSB7IHJldHVybiBTLmNvbmNhdCh4LCB5KTsgfTsgfSksIHNlY29uZCk7XG4gICAgICAgIH1cbiAgICB9KTsgfTtcbn1cbmZ1bmN0aW9uIGN1cnJpZWQoZiwgbiwgYWNjKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHZhciBjb21iaW5lZCA9IEFycmF5KGFjYy5sZW5ndGggKyAxKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY2MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbWJpbmVkW2ldID0gYWNjW2ldO1xuICAgICAgICB9XG4gICAgICAgIGNvbWJpbmVkW2FjYy5sZW5ndGhdID0geDtcbiAgICAgICAgcmV0dXJuIG4gPT09IDAgPyBmLmFwcGx5KG51bGwsIGNvbWJpbmVkKSA6IGN1cnJpZWQoZiwgbiAtIDEsIGNvbWJpbmVkKTtcbiAgICB9O1xufVxudmFyIHR1cGxlQ29uc3RydWN0b3JzID0ge1xuICAgIDE6IGZ1bmN0aW9uIChhKSB7IHJldHVybiBbYV07IH0sXG4gICAgMjogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBbYSwgYl07IH07IH0sXG4gICAgMzogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBmdW5jdGlvbiAoYykgeyByZXR1cm4gW2EsIGIsIGNdOyB9OyB9OyB9LFxuICAgIDQ6IGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoYikgeyByZXR1cm4gZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGZ1bmN0aW9uIChkKSB7IHJldHVybiBbYSwgYiwgYywgZF07IH07IH07IH07IH0sXG4gICAgNTogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBmdW5jdGlvbiAoYykgeyByZXR1cm4gZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGZ1bmN0aW9uIChlKSB7IHJldHVybiBbYSwgYiwgYywgZCwgZV07IH07IH07IH07IH07IH1cbn07XG5mdW5jdGlvbiBnZXRUdXBsZUNvbnN0cnVjdG9yKGxlbikge1xuICAgIGlmICghXy5oYXMuY2FsbCh0dXBsZUNvbnN0cnVjdG9ycywgbGVuKSkge1xuICAgICAgICB0dXBsZUNvbnN0cnVjdG9yc1tsZW5dID0gY3VycmllZCh0dXBsZSwgbGVuIC0gMSwgW10pO1xuICAgIH1cbiAgICByZXR1cm4gdHVwbGVDb25zdHJ1Y3RvcnNbbGVuXTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZVQoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICAgICAgICB2YXIgZiA9IGdldFR1cGxlQ29uc3RydWN0b3IobGVuKTtcbiAgICAgICAgdmFyIGZhcyA9IEYubWFwKGFyZ3NbMF0sIGYpO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBmYXMgPSBGLmFwKGZhcywgYXJnc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhcztcbiAgICB9O1xufVxuZnVuY3Rpb24gZ2V0UmVjb3JkQ29uc3RydWN0b3Ioa2V5cykge1xuICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LCBfYVtrZXlzWzBdXSA9IGEsIF9hKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LCBfYVtrZXlzWzBdXSA9IGEsIF9hW2tleXNbMV1dID0gYiwgX2EpO1xuICAgICAgICAgICAgfTsgfTtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoYikgeyByZXR1cm4gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LCBfYVtrZXlzWzBdXSA9IGEsIF9hW2tleXNbMV1dID0gYiwgX2Fba2V5c1syXV0gPSBjLCBfYSk7XG4gICAgICAgICAgICB9OyB9OyB9O1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBmdW5jdGlvbiAoYykgeyByZXR1cm4gZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzBdXSA9IGEsXG4gICAgICAgICAgICAgICAgICAgIF9hW2tleXNbMV1dID0gYixcbiAgICAgICAgICAgICAgICAgICAgX2Fba2V5c1syXV0gPSBjLFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzNdXSA9IGQsXG4gICAgICAgICAgICAgICAgICAgIF9hKTtcbiAgICAgICAgICAgIH07IH07IH07IH07XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHsgcmV0dXJuIGZ1bmN0aW9uIChjKSB7IHJldHVybiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzBdXSA9IGEsXG4gICAgICAgICAgICAgICAgICAgIF9hW2tleXNbMV1dID0gYixcbiAgICAgICAgICAgICAgICAgICAgX2Fba2V5c1syXV0gPSBjLFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzNdXSA9IGQsXG4gICAgICAgICAgICAgICAgICAgIF9hW2tleXNbNF1dID0gZSxcbiAgICAgICAgICAgICAgICAgICAgX2EpO1xuICAgICAgICAgICAgfTsgfTsgfTsgfTsgfTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBjdXJyaWVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHIgPSB7fTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJba2V5c1tpXV0gPSBhcmdzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH0sIGxlbiAtIDEsIFtdKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gc2VxdWVuY2VTKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhyKTtcbiAgICAgICAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgICAgICB2YXIgZiA9IGdldFJlY29yZENvbnN0cnVjdG9yKGtleXMpO1xuICAgICAgICB2YXIgZnIgPSBGLm1hcChyW2tleXNbMF1dLCBmKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgZnIgPSBGLmFwKGZyLCByW2tleXNbaV1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnI7XG4gICAgfTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjaGFpbkZpcnN0KE0pIHtcbiAgICB2YXIgdGFwTSA9IHRhcChNKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmaXJzdCkgeyByZXR1cm4gdGFwTShmaXJzdCwgZik7IH07IH07XG59XG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gdGFwKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGZpcnN0LCBmKSB7IHJldHVybiBNLmNoYWluKGZpcnN0LCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gTS5tYXAoZihhKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gYTsgfSk7IH0pOyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGJpbmQoTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSwgZikgeyByZXR1cm4gZnVuY3Rpb24gKG1hKSB7IHJldHVybiBNLmNoYWluKG1hLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gTS5tYXAoZihhKSwgZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYSwgKF9hID0ge30sIF9hW25hbWVdID0gYiwgX2EpKTtcbiAgICB9KTsgfSk7IH07IH07XG59XG4iLCIvKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIHRhaWxSZWMgPSBmdW5jdGlvbiAoc3RhcnRXaXRoLCBmKSB7XG4gICAgdmFyIGFiID0gZihzdGFydFdpdGgpO1xuICAgIHdoaWxlIChhYi5fdGFnID09PSAnTGVmdCcpIHtcbiAgICAgICAgYWIgPSBmKGFiLmxlZnQpO1xuICAgIH1cbiAgICByZXR1cm4gYWIucmlnaHQ7XG59O1xuIiwiaW1wb3J0IHsgZ2V0QXBwbGljYXRpdmVNb25vaWQgfSBmcm9tICcuL0FwcGxpY2F0aXZlJztcbmltcG9ydCB7IGFwRmlyc3QgYXMgYXBGaXJzdF8sIGFwUyBhcyBhcFNfLCBhcFNlY29uZCBhcyBhcFNlY29uZF8sIGdldEFwcGx5U2VtaWdyb3VwIGFzIGdldEFwcGx5U2VtaWdyb3VwXyB9IGZyb20gJy4vQXBwbHknO1xuaW1wb3J0ICogYXMgY2hhaW5hYmxlIGZyb20gJy4vQ2hhaW4nO1xuaW1wb3J0IHsgdGFpbFJlYyB9IGZyb20gJy4vQ2hhaW5SZWMnO1xuaW1wb3J0IHsgY2hhaW5PcHRpb25LIGFzIGNoYWluT3B0aW9uS18sIGZpbHRlck9yRWxzZSBhcyBmaWx0ZXJPckVsc2VfLCBmcm9tT3B0aW9uIGFzIGZyb21PcHRpb25fLCBmcm9tT3B0aW9uSyBhcyBmcm9tT3B0aW9uS18sIGZyb21QcmVkaWNhdGUgYXMgZnJvbVByZWRpY2F0ZV8gfSBmcm9tICcuL0Zyb21FaXRoZXInO1xuaW1wb3J0IHsgZHVhbCwgZmxvdywgaWRlbnRpdHksIHBpcGUgfSBmcm9tICcuL2Z1bmN0aW9uJztcbmltcG9ydCB7IGFzIGFzIGFzXywgYXNVbml0IGFzIGFzVW5pdF8sIGJpbmRUbyBhcyBiaW5kVG9fLCBmbGFwIGFzIGZsYXBfLCBsZXQgYXMgbGV0X18gfSBmcm9tICcuL0Z1bmN0b3InO1xuaW1wb3J0ICogYXMgXyBmcm9tICcuL2ludGVybmFsJztcbmltcG9ydCB7IHNlcGFyYXRlZCB9IGZyb20gJy4vU2VwYXJhdGVkJztcbmltcG9ydCB7IHdpbHREZWZhdWx0LCB3aXRoZXJEZWZhdWx0IH0gZnJvbSAnLi9XaXRoZXJhYmxlJztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbnN0cnVjdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBFaXRoZXJgIGhvbGRpbmcgYSBgTGVmdGAgdmFsdWUuIFRoaXMgdXN1YWxseSByZXByZXNlbnRzIGEgZmFpbHVyZSwgZHVlIHRvIHRoZSByaWdodC1iaWFzIG9mIHRoaXNcbiAqIHN0cnVjdHVyZS5cbiAqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBsZWZ0ID0gXy5sZWZ0O1xuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBFaXRoZXJgIGhvbGRpbmcgYSBgUmlnaHRgIHZhbHVlLiBUaGlzIHVzdWFsbHkgcmVwcmVzZW50cyBhIHN1Y2Nlc3NmdWwgdmFsdWUgZHVlIHRvIHRoZSByaWdodCBiaWFzXG4gKiBvZiB0aGlzIHN0cnVjdHVyZS5cbiAqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciByaWdodCA9IF8ucmlnaHQ7XG4vKipcbiAqIEBjYXRlZ29yeSBzZXF1ZW5jaW5nXG4gKiBAc2luY2UgMi4xNC4wXG4gKi9cbmV4cG9ydCB2YXIgZmxhdE1hcCA9IC8qI19fUFVSRV9fKi8gZHVhbCgyLCBmdW5jdGlvbiAobWEsIGYpIHsgcmV0dXJuIChpc0xlZnQobWEpID8gbWEgOiBmKG1hLnJpZ2h0KSk7IH0pO1xudmFyIF9tYXAgPSBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIG1hcChmKSk7IH07XG52YXIgX2FwID0gZnVuY3Rpb24gKGZhYiwgZmEpIHsgcmV0dXJuIHBpcGUoZmFiLCBhcChmYSkpOyB9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciBfcmVkdWNlID0gZnVuY3Rpb24gKGZhLCBiLCBmKSB7IHJldHVybiBwaXBlKGZhLCByZWR1Y2UoYiwgZikpOyB9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciBfZm9sZE1hcCA9IGZ1bmN0aW9uIChNKSB7IHJldHVybiBmdW5jdGlvbiAoZmEsIGYpIHtcbiAgICB2YXIgZm9sZE1hcE0gPSBmb2xkTWFwKE0pO1xuICAgIHJldHVybiBwaXBlKGZhLCBmb2xkTWFwTShmKSk7XG59OyB9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciBfcmVkdWNlUmlnaHQgPSBmdW5jdGlvbiAoZmEsIGIsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIHJlZHVjZVJpZ2h0KGIsIGYpKTsgfTtcbnZhciBfdHJhdmVyc2UgPSBmdW5jdGlvbiAoRikge1xuICAgIHZhciB0cmF2ZXJzZUYgPSB0cmF2ZXJzZShGKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhLCBmKSB7IHJldHVybiBwaXBlKHRhLCB0cmF2ZXJzZUYoZikpOyB9O1xufTtcbnZhciBfYmltYXAgPSBmdW5jdGlvbiAoZmEsIGYsIGcpIHsgcmV0dXJuIHBpcGUoZmEsIGJpbWFwKGYsIGcpKTsgfTtcbnZhciBfbWFwTGVmdCA9IGZ1bmN0aW9uIChmYSwgZikgeyByZXR1cm4gcGlwZShmYSwgbWFwTGVmdChmKSk7IH07XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIF9hbHQgPSBmdW5jdGlvbiAoZmEsIHRoYXQpIHsgcmV0dXJuIHBpcGUoZmEsIGFsdCh0aGF0KSk7IH07XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIF9leHRlbmQgPSBmdW5jdGlvbiAod2EsIGYpIHsgcmV0dXJuIHBpcGUod2EsIGV4dGVuZChmKSk7IH07XG52YXIgX2NoYWluUmVjID0gZnVuY3Rpb24gKGEsIGYpIHtcbiAgICByZXR1cm4gdGFpbFJlYyhmKGEpLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KGUpID8gcmlnaHQobGVmdChlLmxlZnQpKSA6IGlzTGVmdChlLnJpZ2h0KSA/IGxlZnQoZihlLnJpZ2h0LmxlZnQpKSA6IHJpZ2h0KHJpZ2h0KGUucmlnaHQucmlnaHQpKTtcbiAgICB9KTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSB0eXBlIGxhbWJkYXNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIFVSSSA9ICdFaXRoZXInO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRTaG93ID0gZnVuY3Rpb24gKFNFLCBTQSkgeyByZXR1cm4gKHtcbiAgICBzaG93OiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIChpc0xlZnQobWEpID8gXCJsZWZ0KFwiLmNvbmNhdChTRS5zaG93KG1hLmxlZnQpLCBcIilcIikgOiBcInJpZ2h0KFwiLmNvbmNhdChTQS5zaG93KG1hLnJpZ2h0KSwgXCIpXCIpKTsgfVxufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGdldEVxID0gZnVuY3Rpb24gKEVMLCBFQSkgeyByZXR1cm4gKHtcbiAgICBlcXVhbHM6IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiB4ID09PSB5IHx8IChpc0xlZnQoeCkgPyBpc0xlZnQoeSkgJiYgRUwuZXF1YWxzKHgubGVmdCwgeS5sZWZ0KSA6IGlzUmlnaHQoeSkgJiYgRUEuZXF1YWxzKHgucmlnaHQsIHkucmlnaHQpKTtcbiAgICB9XG59KTsgfTtcbi8qKlxuICogU2VtaWdyb3VwIHJldHVybmluZyB0aGUgbGVmdC1tb3N0IG5vbi1gTGVmdGAgdmFsdWUuIElmIGJvdGggb3BlcmFuZHMgYXJlIGBSaWdodGBzIHRoZW4gdGhlIGlubmVyIHZhbHVlcyBhcmVcbiAqIGNvbmNhdGVuYXRlZCB1c2luZyB0aGUgcHJvdmlkZWQgYFNlbWlncm91cGBcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZ2V0U2VtaWdyb3VwLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IFNlbWlncm91cFN1bSB9IGZyb20gJ2ZwLXRzL251bWJlcidcbiAqXG4gKiBjb25zdCBTID0gZ2V0U2VtaWdyb3VwPHN0cmluZywgbnVtYmVyPihTZW1pZ3JvdXBTdW0pXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMuY29uY2F0KGxlZnQoJ2EnKSwgbGVmdCgnYicpKSwgbGVmdCgnYScpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChsZWZ0KCdhJyksIHJpZ2h0KDIpKSwgcmlnaHQoMikpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMuY29uY2F0KHJpZ2h0KDEpLCBsZWZ0KCdiJykpLCByaWdodCgxKSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoUy5jb25jYXQocmlnaHQoMSksIHJpZ2h0KDIpKSwgcmlnaHQoMykpXG4gKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0U2VtaWdyb3VwID0gZnVuY3Rpb24gKFMpIHsgcmV0dXJuICh7XG4gICAgY29uY2F0OiBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4gKGlzTGVmdCh5KSA/IHggOiBpc0xlZnQoeCkgPyB5IDogcmlnaHQoUy5jb25jYXQoeC5yaWdodCwgeS5yaWdodCkpKTsgfVxufSk7IH07XG4vKipcbiAqIEJ1aWxkcyBhIGBDb21wYWN0YWJsZWAgaW5zdGFuY2UgZm9yIGBFaXRoZXJgIGdpdmVuIGBNb25vaWRgIGZvciB0aGUgbGVmdCBzaWRlLlxuICpcbiAqIEBjYXRlZ29yeSBmaWx0ZXJpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRDb21wYWN0YWJsZSA9IGZ1bmN0aW9uIChNKSB7XG4gICAgdmFyIGVtcHR5ID0gbGVmdChNLmVtcHR5KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBVUkk6IFVSSSxcbiAgICAgICAgX0U6IHVuZGVmaW5lZCxcbiAgICAgICAgY29tcGFjdDogZnVuY3Rpb24gKG1hKSB7IHJldHVybiAoaXNMZWZ0KG1hKSA/IG1hIDogbWEucmlnaHQuX3RhZyA9PT0gJ05vbmUnID8gZW1wdHkgOiByaWdodChtYS5yaWdodC52YWx1ZSkpOyB9LFxuICAgICAgICBzZXBhcmF0ZTogZnVuY3Rpb24gKG1hKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKVxuICAgICAgICAgICAgICAgID8gc2VwYXJhdGVkKG1hLCBtYSlcbiAgICAgICAgICAgICAgICA6IGlzTGVmdChtYS5yaWdodClcbiAgICAgICAgICAgICAgICAgICAgPyBzZXBhcmF0ZWQocmlnaHQobWEucmlnaHQubGVmdCksIGVtcHR5KVxuICAgICAgICAgICAgICAgICAgICA6IHNlcGFyYXRlZChlbXB0eSwgcmlnaHQobWEucmlnaHQucmlnaHQpKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuLyoqXG4gKiBCdWlsZHMgYSBgRmlsdGVyYWJsZWAgaW5zdGFuY2UgZm9yIGBFaXRoZXJgIGdpdmVuIGBNb25vaWRgIGZvciB0aGUgbGVmdCBzaWRlXG4gKlxuICogQGNhdGVnb3J5IGZpbHRlcmluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIGdldEZpbHRlcmFibGUgPSBmdW5jdGlvbiAoTSkge1xuICAgIHZhciBlbXB0eSA9IGxlZnQoTS5lbXB0eSk7XG4gICAgdmFyIF9hID0gZ2V0Q29tcGFjdGFibGUoTSksIGNvbXBhY3QgPSBfYS5jb21wYWN0LCBzZXBhcmF0ZSA9IF9hLnNlcGFyYXRlO1xuICAgIHZhciBmaWx0ZXIgPSBmdW5jdGlvbiAobWEsIHByZWRpY2F0ZSkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKSA/IG1hIDogcHJlZGljYXRlKG1hLnJpZ2h0KSA/IG1hIDogZW1wdHk7XG4gICAgfTtcbiAgICB2YXIgcGFydGl0aW9uID0gZnVuY3Rpb24gKG1hLCBwKSB7XG4gICAgICAgIHJldHVybiBpc0xlZnQobWEpXG4gICAgICAgICAgICA/IHNlcGFyYXRlZChtYSwgbWEpXG4gICAgICAgICAgICA6IHAobWEucmlnaHQpXG4gICAgICAgICAgICAgICAgPyBzZXBhcmF0ZWQoZW1wdHksIHJpZ2h0KG1hLnJpZ2h0KSlcbiAgICAgICAgICAgICAgICA6IHNlcGFyYXRlZChyaWdodChtYS5yaWdodCksIGVtcHR5KTtcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIFVSSTogVVJJLFxuICAgICAgICBfRTogdW5kZWZpbmVkLFxuICAgICAgICBtYXA6IF9tYXAsXG4gICAgICAgIGNvbXBhY3Q6IGNvbXBhY3QsXG4gICAgICAgIHNlcGFyYXRlOiBzZXBhcmF0ZSxcbiAgICAgICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgICAgIGZpbHRlck1hcDogZnVuY3Rpb24gKG1hLCBmKSB7XG4gICAgICAgICAgICBpZiAoaXNMZWZ0KG1hKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBvYiA9IGYobWEucmlnaHQpO1xuICAgICAgICAgICAgcmV0dXJuIG9iLl90YWcgPT09ICdOb25lJyA/IGVtcHR5IDogcmlnaHQob2IudmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBwYXJ0aXRpb246IHBhcnRpdGlvbixcbiAgICAgICAgcGFydGl0aW9uTWFwOiBmdW5jdGlvbiAobWEsIGYpIHtcbiAgICAgICAgICAgIGlmIChpc0xlZnQobWEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcGFyYXRlZChtYSwgbWEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGUgPSBmKG1hLnJpZ2h0KTtcbiAgICAgICAgICAgIHJldHVybiBpc0xlZnQoZSkgPyBzZXBhcmF0ZWQocmlnaHQoZS5sZWZ0KSwgZW1wdHkpIDogc2VwYXJhdGVkKGVtcHR5LCByaWdodChlLnJpZ2h0KSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbi8qKlxuICogQnVpbGRzIGBXaXRoZXJhYmxlYCBpbnN0YW5jZSBmb3IgYEVpdGhlcmAgZ2l2ZW4gYE1vbm9pZGAgZm9yIHRoZSBsZWZ0IHNpZGVcbiAqXG4gKiBAY2F0ZWdvcnkgZmlsdGVyaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRXaXRoZXJhYmxlID0gZnVuY3Rpb24gKE0pIHtcbiAgICB2YXIgRl8gPSBnZXRGaWx0ZXJhYmxlKE0pO1xuICAgIHZhciBDID0gZ2V0Q29tcGFjdGFibGUoTSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVVJJOiBVUkksXG4gICAgICAgIF9FOiB1bmRlZmluZWQsXG4gICAgICAgIG1hcDogX21hcCxcbiAgICAgICAgY29tcGFjdDogRl8uY29tcGFjdCxcbiAgICAgICAgc2VwYXJhdGU6IEZfLnNlcGFyYXRlLFxuICAgICAgICBmaWx0ZXI6IEZfLmZpbHRlcixcbiAgICAgICAgZmlsdGVyTWFwOiBGXy5maWx0ZXJNYXAsXG4gICAgICAgIHBhcnRpdGlvbjogRl8ucGFydGl0aW9uLFxuICAgICAgICBwYXJ0aXRpb25NYXA6IEZfLnBhcnRpdGlvbk1hcCxcbiAgICAgICAgdHJhdmVyc2U6IF90cmF2ZXJzZSxcbiAgICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlLFxuICAgICAgICByZWR1Y2U6IF9yZWR1Y2UsXG4gICAgICAgIGZvbGRNYXA6IF9mb2xkTWFwLFxuICAgICAgICByZWR1Y2VSaWdodDogX3JlZHVjZVJpZ2h0LFxuICAgICAgICB3aXRoZXI6IHdpdGhlckRlZmF1bHQoVHJhdmVyc2FibGUsIEMpLFxuICAgICAgICB3aWx0OiB3aWx0RGVmYXVsdChUcmF2ZXJzYWJsZSwgQylcbiAgICB9O1xufTtcbi8qKlxuICogVGhlIGRlZmF1bHQgW2BBcHBsaWNhdGl2ZWBdKCNhcHBsaWNhdGl2ZSkgaW5zdGFuY2UgcmV0dXJucyB0aGUgZmlyc3QgZXJyb3IsIGlmIHlvdSB3YW50IHRvXG4gKiBnZXQgYWxsIGVycm9ycyB5b3UgbmVlZCB0byBwcm92aWRlIGEgd2F5IHRvIGNvbmNhdGVuYXRlIHRoZW0gdmlhIGEgYFNlbWlncm91cGAuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIEEgZnJvbSAnZnAtdHMvQXBwbHknXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIFMgZnJvbSAnZnAtdHMvU2VtaWdyb3VwJ1xuICogaW1wb3J0ICogYXMgc3RyaW5nIGZyb20gJ2ZwLXRzL3N0cmluZydcbiAqXG4gKiBjb25zdCBwYXJzZVN0cmluZyA9ICh1OiB1bmtub3duKTogRS5FaXRoZXI8c3RyaW5nLCBzdHJpbmc+ID0+XG4gKiAgIHR5cGVvZiB1ID09PSAnc3RyaW5nJyA/IEUucmlnaHQodSkgOiBFLmxlZnQoJ25vdCBhIHN0cmluZycpXG4gKlxuICogY29uc3QgcGFyc2VOdW1iZXIgPSAodTogdW5rbm93bik6IEUuRWl0aGVyPHN0cmluZywgbnVtYmVyPiA9PlxuICogICB0eXBlb2YgdSA9PT0gJ251bWJlcicgPyBFLnJpZ2h0KHUpIDogRS5sZWZ0KCdub3QgYSBudW1iZXInKVxuICpcbiAqIGludGVyZmFjZSBQZXJzb24ge1xuICogICByZWFkb25seSBuYW1lOiBzdHJpbmdcbiAqICAgcmVhZG9ubHkgYWdlOiBudW1iZXJcbiAqIH1cbiAqXG4gKiBjb25zdCBwYXJzZVBlcnNvbiA9IChcbiAqICAgaW5wdXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gKiApOiBFLkVpdGhlcjxzdHJpbmcsIFBlcnNvbj4gPT5cbiAqICAgcGlwZShcbiAqICAgICBFLkRvLFxuICogICAgIEUuYXBTKCduYW1lJywgcGFyc2VTdHJpbmcoaW5wdXQubmFtZSkpLFxuICogICAgIEUuYXBTKCdhZ2UnLCBwYXJzZU51bWJlcihpbnB1dC5hZ2UpKVxuICogICApXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwYXJzZVBlcnNvbih7fSksIEUubGVmdCgnbm90IGEgc3RyaW5nJykpIC8vIDw9IGZpcnN0IGVycm9yXG4gKlxuICogY29uc3QgQXBwbGljYXRpdmUgPSBFLmdldEFwcGxpY2F0aXZlVmFsaWRhdGlvbihcbiAqICAgcGlwZShzdHJpbmcuU2VtaWdyb3VwLCBTLmludGVyY2FsYXRlKCcsICcpKVxuICogKVxuICpcbiAqIGNvbnN0IGFwUyA9IEEuYXBTKEFwcGxpY2F0aXZlKVxuICpcbiAqIGNvbnN0IHBhcnNlUGVyc29uQWxsID0gKFxuICogICBpbnB1dDogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAqICk6IEUuRWl0aGVyPHN0cmluZywgUGVyc29uPiA9PlxuICogICBwaXBlKFxuICogICAgIEUuRG8sXG4gKiAgICAgYXBTKCduYW1lJywgcGFyc2VTdHJpbmcoaW5wdXQubmFtZSkpLFxuICogICAgIGFwUygnYWdlJywgcGFyc2VOdW1iZXIoaW5wdXQuYWdlKSlcbiAqICAgKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwocGFyc2VQZXJzb25BbGwoe30pLCBFLmxlZnQoJ25vdCBhIHN0cmluZywgbm90IGEgbnVtYmVyJykpIC8vIDw9IGFsbCBlcnJvcnNcbiAqXG4gKiBAY2F0ZWdvcnkgZXJyb3IgaGFuZGxpbmdcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIGdldEFwcGxpY2F0aXZlVmFsaWRhdGlvbiA9IGZ1bmN0aW9uIChTRSkgeyByZXR1cm4gKHtcbiAgICBVUkk6IFVSSSxcbiAgICBfRTogdW5kZWZpbmVkLFxuICAgIG1hcDogX21hcCxcbiAgICBhcDogZnVuY3Rpb24gKGZhYiwgZmEpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVmdChmYWIpXG4gICAgICAgICAgICA/IGlzTGVmdChmYSlcbiAgICAgICAgICAgICAgICA/IGxlZnQoU0UuY29uY2F0KGZhYi5sZWZ0LCBmYS5sZWZ0KSlcbiAgICAgICAgICAgICAgICA6IGZhYlxuICAgICAgICAgICAgOiBpc0xlZnQoZmEpXG4gICAgICAgICAgICAgICAgPyBmYVxuICAgICAgICAgICAgICAgIDogcmlnaHQoZmFiLnJpZ2h0KGZhLnJpZ2h0KSk7XG4gICAgfSxcbiAgICBvZjogb2Zcbn0pOyB9O1xuLyoqXG4gKiBUaGUgZGVmYXVsdCBbYEFsdGBdKCNhbHQpIGluc3RhbmNlIHJldHVybnMgdGhlIGxhc3QgZXJyb3IsIGlmIHlvdSB3YW50IHRvXG4gKiBnZXQgYWxsIGVycm9ycyB5b3UgbmVlZCB0byBwcm92aWRlIGEgd2F5IHRvIGNvbmNhdGVuYXRlIHRoZW0gdmlhIGEgYFNlbWlncm91cGAuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgUyBmcm9tICdmcC10cy9TZW1pZ3JvdXAnXG4gKiBpbXBvcnQgKiBhcyBzdHJpbmcgZnJvbSAnZnAtdHMvc3RyaW5nJ1xuICpcbiAqIGNvbnN0IHBhcnNlU3RyaW5nID0gKHU6IHVua25vd24pOiBFLkVpdGhlcjxzdHJpbmcsIHN0cmluZz4gPT5cbiAqICAgdHlwZW9mIHUgPT09ICdzdHJpbmcnID8gRS5yaWdodCh1KSA6IEUubGVmdCgnbm90IGEgc3RyaW5nJylcbiAqXG4gKiBjb25zdCBwYXJzZU51bWJlciA9ICh1OiB1bmtub3duKTogRS5FaXRoZXI8c3RyaW5nLCBudW1iZXI+ID0+XG4gKiAgIHR5cGVvZiB1ID09PSAnbnVtYmVyJyA/IEUucmlnaHQodSkgOiBFLmxlZnQoJ25vdCBhIG51bWJlcicpXG4gKlxuICogY29uc3QgcGFyc2UgPSAodTogdW5rbm93bik6IEUuRWl0aGVyPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPiA9PlxuICogICBwaXBlKFxuICogICAgIHBhcnNlU3RyaW5nKHUpLFxuICogICAgIEUuYWx0PHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPigoKSA9PiBwYXJzZU51bWJlcih1KSlcbiAqICAgKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwocGFyc2UodHJ1ZSksIEUubGVmdCgnbm90IGEgbnVtYmVyJykpIC8vIDw9IGxhc3QgZXJyb3JcbiAqXG4gKiBjb25zdCBBbHQgPSBFLmdldEFsdFZhbGlkYXRpb24ocGlwZShzdHJpbmcuU2VtaWdyb3VwLCBTLmludGVyY2FsYXRlKCcsICcpKSlcbiAqXG4gKiBjb25zdCBwYXJzZUFsbCA9ICh1OiB1bmtub3duKTogRS5FaXRoZXI8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXI+ID0+XG4gKiAgIEFsdC5hbHQ8c3RyaW5nIHwgbnVtYmVyPihwYXJzZVN0cmluZyh1KSwgKCkgPT4gcGFyc2VOdW1iZXIodSkpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwYXJzZUFsbCh0cnVlKSwgRS5sZWZ0KCdub3QgYSBzdHJpbmcsIG5vdCBhIG51bWJlcicpKSAvLyA8PSBhbGwgZXJyb3JzXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBnZXRBbHRWYWxpZGF0aW9uID0gZnVuY3Rpb24gKFNFKSB7IHJldHVybiAoe1xuICAgIFVSSTogVVJJLFxuICAgIF9FOiB1bmRlZmluZWQsXG4gICAgbWFwOiBfbWFwLFxuICAgIGFsdDogZnVuY3Rpb24gKG1lLCB0aGF0KSB7XG4gICAgICAgIGlmIChpc1JpZ2h0KG1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1lO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlYSA9IHRoYXQoKTtcbiAgICAgICAgcmV0dXJuIGlzTGVmdChlYSkgPyBsZWZ0KFNFLmNvbmNhdChtZS5sZWZ0LCBlYS5sZWZ0KSkgOiBlYTtcbiAgICB9XG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IG1hcHBpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIG1hcCA9IGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICByZXR1cm4gaXNMZWZ0KGZhKSA/IGZhIDogcmlnaHQoZihmYS5yaWdodCkpO1xufTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgRnVuY3RvciA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXBcbn07XG4vKipcbiAqIE1hcHMgdGhlIGBSaWdodGAgdmFsdWUgb2YgdGhpcyBgRWl0aGVyYCB0byB0aGUgc3BlY2lmaWVkIGNvbnN0YW50IHZhbHVlLlxuICpcbiAqIEBjYXRlZ29yeSBtYXBwaW5nXG4gKiBAc2luY2UgMi4xNi4wXG4gKi9cbmV4cG9ydCB2YXIgYXMgPSBkdWFsKDIsIGFzXyhGdW5jdG9yKSk7XG4vKipcbiAqIE1hcHMgdGhlIGBSaWdodGAgdmFsdWUgb2YgdGhpcyBgRWl0aGVyYCB0byB0aGUgdm9pZCBjb25zdGFudCB2YWx1ZS5cbiAqXG4gKiBAY2F0ZWdvcnkgbWFwcGluZ1xuICogQHNpbmNlIDIuMTYuMFxuICovXG5leHBvcnQgdmFyIGFzVW5pdCA9IGFzVW5pdF8oRnVuY3Rvcik7XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIG9mID0gcmlnaHQ7XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBQb2ludGVkID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG9mOiBvZlxufTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGFwYF0oI2FwKS5cbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgZXJyb3IgdHlwZXMgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQHNpbmNlIDIuOC4wXG4gKi9cbmV4cG9ydCB2YXIgYXBXID0gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBmdW5jdGlvbiAoZmFiKSB7XG4gICAgcmV0dXJuIGlzTGVmdChmYWIpID8gZmFiIDogaXNMZWZ0KGZhKSA/IGZhIDogcmlnaHQoZmFiLnJpZ2h0KGZhLnJpZ2h0KSk7XG59OyB9O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBhcCA9IGFwVztcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIEFwcGx5ID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcCxcbiAgICBhcDogX2FwXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBBcHBsaWNhdGl2ZSA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgYXA6IF9hcCxcbiAgICBvZjogb2Zcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBDaGFpbiA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgYXA6IF9hcCxcbiAgICBjaGFpbjogZmxhdE1hcFxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgTW9uYWQgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBfbWFwLFxuICAgIGFwOiBfYXAsXG4gICAgb2Y6IG9mLFxuICAgIGNoYWluOiBmbGF0TWFwXG59O1xuLyoqXG4gKiBMZWZ0LWFzc29jaWF0aXZlIGZvbGQgb2YgYSBzdHJ1Y3R1cmUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICpcbiAqIGNvbnN0IHN0YXJ0V2l0aCA9ICdwcmVmaXgnXG4gKiBjb25zdCBjb25jYXQgPSAoYTogc3RyaW5nLCBiOiBzdHJpbmcpID0+IGAke2F9OiR7Yn1gXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KCdhJyksIEUucmVkdWNlKHN0YXJ0V2l0aCwgY29uY2F0KSksXG4gKiAgICdwcmVmaXg6YSdcbiAqIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUubGVmdCgnZScpLCBFLnJlZHVjZShzdGFydFdpdGgsIGNvbmNhdCkpLFxuICogICAncHJlZml4J1xuICogKVxuICpcbiAqIEBjYXRlZ29yeSBmb2xkaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciByZWR1Y2UgPSBmdW5jdGlvbiAoYiwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGlzTGVmdChmYSkgPyBiIDogZihiLCBmYS5yaWdodCk7XG59OyB9O1xuLyoqXG4gKiBNYXAgZWFjaCBlbGVtZW50IG9mIHRoZSBzdHJ1Y3R1cmUgdG8gYSBtb25vaWQsIGFuZCBjb21iaW5lIHRoZSByZXN1bHRzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCAqIGFzIFMgZnJvbSAnZnAtdHMvc3RyaW5nJ1xuICpcbiAqIGNvbnN0IHllbGwgPSAoYTogc3RyaW5nKSA9PiBgJHthfSFgXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KCdhJyksIEUuZm9sZE1hcChTLk1vbm9pZCkoeWVsbCkpLFxuICogICAnYSEnXG4gKiApXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLmxlZnQoJ2UnKSwgRS5mb2xkTWFwKFMuTW9ub2lkKSh5ZWxsKSksXG4gKiAgIFMuTW9ub2lkLmVtcHR5XG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGZvbGRpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGZvbGRNYXAgPSBmdW5jdGlvbiAoTSkgeyByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgIHJldHVybiBpc0xlZnQoZmEpID8gTS5lbXB0eSA6IGYoZmEucmlnaHQpO1xufTsgfTsgfTtcbi8qKlxuICogUmlnaHQtYXNzb2NpYXRpdmUgZm9sZCBvZiBhIHN0cnVjdHVyZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKlxuICogY29uc3Qgc3RhcnRXaXRoID0gJ3Bvc3RmaXgnXG4gKiBjb25zdCBjb25jYXQgPSAoYTogc3RyaW5nLCBiOiBzdHJpbmcpID0+IGAke2F9OiR7Yn1gXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KCdhJyksIEUucmVkdWNlUmlnaHQoc3RhcnRXaXRoLCBjb25jYXQpKSxcbiAqICAgJ2E6cG9zdGZpeCdcbiAqIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUubGVmdCgnZScpLCBFLnJlZHVjZVJpZ2h0KHN0YXJ0V2l0aCwgY29uY2F0KSksXG4gKiAgICdwb3N0Zml4J1xuICogKVxuICpcbiAqIEBjYXRlZ29yeSBmb2xkaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciByZWR1Y2VSaWdodCA9IGZ1bmN0aW9uIChiLCBmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICByZXR1cm4gaXNMZWZ0KGZhKSA/IGIgOiBmKGZhLnJpZ2h0LCBiKTtcbn07IH07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIEZvbGRhYmxlID0ge1xuICAgIFVSSTogVVJJLFxuICAgIHJlZHVjZTogX3JlZHVjZSxcbiAgICBmb2xkTWFwOiBfZm9sZE1hcCxcbiAgICByZWR1Y2VSaWdodDogX3JlZHVjZVJpZ2h0XG59O1xuLyoqXG4gKiBNYXAgZWFjaCBlbGVtZW50IG9mIGEgc3RydWN0dXJlIHRvIGFuIGFjdGlvbiwgZXZhbHVhdGUgdGhlc2UgYWN0aW9ucyBmcm9tIGxlZnQgdG8gcmlnaHQsIGFuZCBjb2xsZWN0IHRoZSByZXN1bHRzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBSQSBmcm9tICdmcC10cy9SZWFkb25seUFycmF5J1xuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgKiBhcyBPIGZyb20gJ2ZwLXRzL09wdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUucmlnaHQoWydhJ10pLCBFLnRyYXZlcnNlKE8uQXBwbGljYXRpdmUpKFJBLmhlYWQpKSxcbiAqICAgTy5zb21lKEUucmlnaHQoJ2EnKSlcbiAqICApXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KFtdKSwgRS50cmF2ZXJzZShPLkFwcGxpY2F0aXZlKShSQS5oZWFkKSksXG4gKiAgIE8ubm9uZVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSB0cmF2ZXJzaW5nXG4gKiBAc2luY2UgMi42LjNcbiAqL1xuZXhwb3J0IHZhciB0cmF2ZXJzZSA9IGZ1bmN0aW9uIChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodGEpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xlZnQodGEpID8gRi5vZihsZWZ0KHRhLmxlZnQpKSA6IEYubWFwKGYodGEucmlnaHQpLCByaWdodCk7XG4gICAgICAgIH07XG4gICAgfTtcbn07XG4vKipcbiAqIEV2YWx1YXRlIGVhY2ggbW9uYWRpYyBhY3Rpb24gaW4gdGhlIHN0cnVjdHVyZSBmcm9tIGxlZnQgdG8gcmlnaHQsIGFuZCBjb2xsZWN0IHRoZSByZXN1bHRzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCAqIGFzIE8gZnJvbSAnZnAtdHMvT3B0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodChPLnNvbWUoJ2EnKSksIEUuc2VxdWVuY2UoTy5BcHBsaWNhdGl2ZSkpLFxuICogICBPLnNvbWUoRS5yaWdodCgnYScpKVxuICogIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUucmlnaHQoTy5ub25lKSwgRS5zZXF1ZW5jZShPLkFwcGxpY2F0aXZlKSksXG4gKiAgIE8ubm9uZVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSB0cmF2ZXJzaW5nXG4gKiBAc2luY2UgMi42LjNcbiAqL1xuZXhwb3J0IHZhciBzZXF1ZW5jZSA9IGZ1bmN0aW9uIChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKSA/IEYub2YobGVmdChtYS5sZWZ0KSkgOiBGLm1hcChtYS5yaWdodCwgcmlnaHQpO1xuICAgIH07XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBUcmF2ZXJzYWJsZSA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgcmVkdWNlOiBfcmVkdWNlLFxuICAgIGZvbGRNYXA6IF9mb2xkTWFwLFxuICAgIHJlZHVjZVJpZ2h0OiBfcmVkdWNlUmlnaHQsXG4gICAgdHJhdmVyc2U6IF90cmF2ZXJzZSxcbiAgICBzZXF1ZW5jZTogc2VxdWVuY2Vcbn07XG4vKipcbiAqIE1hcCBhIHBhaXIgb2YgZnVuY3Rpb25zIG92ZXIgdGhlIHR3byB0eXBlIGFyZ3VtZW50cyBvZiB0aGUgYmlmdW5jdG9yLlxuICpcbiAqIEBjYXRlZ29yeSBtYXBwaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBiaW1hcCA9IGZ1bmN0aW9uIChmLCBnKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICByZXR1cm4gaXNMZWZ0KGZhKSA/IGxlZnQoZihmYS5sZWZ0KSkgOiByaWdodChnKGZhLnJpZ2h0KSk7XG59OyB9O1xuLyoqXG4gKiBNYXAgYSBmdW5jdGlvbiBvdmVyIHRoZSBmaXJzdCB0eXBlIGFyZ3VtZW50IG9mIGEgYmlmdW5jdG9yLlxuICpcbiAqIEBjYXRlZ29yeSBlcnJvciBoYW5kbGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgbWFwTGVmdCA9IGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICByZXR1cm4gaXNMZWZ0KGZhKSA/IGxlZnQoZihmYS5sZWZ0KSkgOiBmYTtcbn07IH07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIEJpZnVuY3RvciA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBiaW1hcDogX2JpbWFwLFxuICAgIG1hcExlZnQ6IF9tYXBMZWZ0XG59O1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgYWx0YF0oI2FsdCkuXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIGVycm9yIGFuZCB0aGUgcmV0dXJuIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBjYXRlZ29yeSBlcnJvciBoYW5kbGluZ1xuICogQHNpbmNlIDIuOS4wXG4gKi9cbmV4cG9ydCB2YXIgYWx0VyA9IGZ1bmN0aW9uICh0aGF0KSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICByZXR1cm4gaXNMZWZ0KGZhKSA/IHRoYXQoKSA6IGZhO1xufTsgfTtcbi8qKlxuICogSWRlbnRpZmllcyBhbiBhc3NvY2lhdGl2ZSBvcGVyYXRpb24gb24gYSB0eXBlIGNvbnN0cnVjdG9yLiBJdCBpcyBzaW1pbGFyIHRvIGBTZW1pZ3JvdXBgLCBleGNlcHQgdGhhdCBpdCBhcHBsaWVzIHRvXG4gKiB0eXBlcyBvZiBraW5kIGAqIC0+ICpgLlxuICpcbiAqIEluIGNhc2Ugb2YgYEVpdGhlcmAgcmV0dXJucyB0aGUgbGVmdC1tb3N0IG5vbi1gTGVmdGAgdmFsdWUgKG9yIHRoZSByaWdodC1tb3N0IGBMZWZ0YCB2YWx1ZSBpZiBib3RoIHZhbHVlcyBhcmUgYExlZnRgKS5cbiAqXG4gKiB8IHggICAgICAgIHwgeSAgICAgICAgfCBwaXBlKHgsIGFsdCgoKSA9PiB5KSB8XG4gKiB8IC0tLS0tLS0tIHwgLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tLS0tLSB8XG4gKiB8IGxlZnQoYSkgIHwgbGVmdChiKSAgfCBsZWZ0KGIpICAgICAgICAgICAgICB8XG4gKiB8IGxlZnQoYSkgIHwgcmlnaHQoMikgfCByaWdodCgyKSAgICAgICAgICAgICB8XG4gKiB8IHJpZ2h0KDEpIHwgbGVmdChiKSAgfCByaWdodCgxKSAgICAgICAgICAgICB8XG4gKiB8IHJpZ2h0KDEpIHwgcmlnaHQoMikgfCByaWdodCgxKSAgICAgICAgICAgICB8XG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgRS5sZWZ0KCdhJyksXG4gKiAgICAgRS5hbHQoKCkgPT4gRS5sZWZ0KCdiJykpXG4gKiAgICksXG4gKiAgIEUubGVmdCgnYicpXG4gKiApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIEUubGVmdCgnYScpLFxuICogICAgIEUuYWx0KCgpID0+IEUucmlnaHQoMikpXG4gKiAgICksXG4gKiAgIEUucmlnaHQoMilcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgRS5yaWdodCgxKSxcbiAqICAgICBFLmFsdCgoKSA9PiBFLmxlZnQoJ2InKSlcbiAqICAgKSxcbiAqICAgRS5yaWdodCgxKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBFLnJpZ2h0KDEpLFxuICogICAgIEUuYWx0KCgpID0+IEUucmlnaHQoMikpXG4gKiAgICksXG4gKiAgIEUucmlnaHQoMSlcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgZXJyb3IgaGFuZGxpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGFsdCA9IGFsdFc7XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIEFsdCA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgYWx0OiBfYWx0XG59O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBleHRlbmQgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKHdhKSB7XG4gICAgcmV0dXJuIGlzTGVmdCh3YSkgPyB3YSA6IHJpZ2h0KGYod2EpKTtcbn07IH07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIEV4dGVuZCA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgZXh0ZW5kOiBfZXh0ZW5kXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBDaGFpblJlYyA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgYXA6IF9hcCxcbiAgICBjaGFpbjogZmxhdE1hcCxcbiAgICBjaGFpblJlYzogX2NoYWluUmVjXG59O1xuLyoqXG4gKiBAc2luY2UgMi42LjNcbiAqL1xuZXhwb3J0IHZhciB0aHJvd0Vycm9yID0gbGVmdDtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgTW9uYWRUaHJvdyA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgYXA6IF9hcCxcbiAgICBvZjogb2YsXG4gICAgY2hhaW46IGZsYXRNYXAsXG4gICAgdGhyb3dFcnJvcjogdGhyb3dFcnJvclxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIEZyb21FaXRoZXIgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgZnJvbUVpdGhlcjogaWRlbnRpdHlcbn07XG4vKipcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBmcm9tUHJlZGljYXRlLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIDEsXG4gKiAgICAgZnJvbVByZWRpY2F0ZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIHJpZ2h0KDEpXG4gKiApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIC0xLFxuICogICAgIGZyb21QcmVkaWNhdGUoXG4gKiAgICAgICAobikgPT4gbiA+IDAsXG4gKiAgICAgICAoKSA9PiAnZXJyb3InXG4gKiAgICAgKVxuICogICApLFxuICogICBsZWZ0KCdlcnJvcicpXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGxpZnRpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGZyb21QcmVkaWNhdGUgPSAvKiNfX1BVUkVfXyovIGZyb21QcmVkaWNhdGVfKEZyb21FaXRoZXIpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gY29udmVyc2lvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgTyBmcm9tICdmcC10cy9PcHRpb24nXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBPLnNvbWUoMSksXG4gKiAgICAgRS5mcm9tT3B0aW9uKCgpID0+ICdlcnJvcicpXG4gKiAgICksXG4gKiAgIEUucmlnaHQoMSlcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgTy5ub25lLFxuICogICAgIEUuZnJvbU9wdGlvbigoKSA9PiAnZXJyb3InKVxuICogICApLFxuICogICBFLmxlZnQoJ2Vycm9yJylcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgY29udmVyc2lvbnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGZyb21PcHRpb24gPSBcbi8qI19fUFVSRV9fKi8gZnJvbU9wdGlvbl8oRnJvbUVpdGhlcik7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyByZWZpbmVtZW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZWl0aGVyIGlzIGFuIGluc3RhbmNlIG9mIGBMZWZ0YCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKlxuICogQGNhdGVnb3J5IHJlZmluZW1lbnRzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBpc0xlZnQgPSBfLmlzTGVmdDtcbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVpdGhlciBpcyBhbiBpbnN0YW5jZSBvZiBgUmlnaHRgLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqXG4gKiBAY2F0ZWdvcnkgcmVmaW5lbWVudHNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGlzUmlnaHQgPSBfLmlzUmlnaHQ7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BtYXRjaGBdKCNtYXRjaCkuXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIGhhbmRsZXIgcmV0dXJuIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBjYXRlZ29yeSBwYXR0ZXJuIG1hdGNoaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgbWF0Y2hXID0gZnVuY3Rpb24gKG9uTGVmdCwgb25SaWdodCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVmdChtYSkgPyBvbkxlZnQobWEubGVmdCkgOiBvblJpZ2h0KG1hLnJpZ2h0KTtcbiAgICB9O1xufTtcbi8qKlxuICogQWxpYXMgb2YgW2BtYXRjaFdgXSgjbWF0Y2h3KS5cbiAqXG4gKiBAY2F0ZWdvcnkgcGF0dGVybiBtYXRjaGluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIGZvbGRXID0gbWF0Y2hXO1xuLyoqXG4gKiBUYWtlcyB0d28gZnVuY3Rpb25zIGFuZCBhbiBgRWl0aGVyYCB2YWx1ZSwgaWYgdGhlIHZhbHVlIGlzIGEgYExlZnRgIHRoZSBpbm5lciB2YWx1ZSBpcyBhcHBsaWVkIHRvIHRoZSBmaXJzdCBmdW5jdGlvbixcbiAqIGlmIHRoZSB2YWx1ZSBpcyBhIGBSaWdodGAgdGhlIGlubmVyIHZhbHVlIGlzIGFwcGxpZWQgdG8gdGhlIHNlY29uZCBmdW5jdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgbWF0Y2gsIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICpcbiAqIGZ1bmN0aW9uIG9uTGVmdChlcnJvcnM6IEFycmF5PHN0cmluZz4pOiBzdHJpbmcge1xuICogICByZXR1cm4gYEVycm9yczogJHtlcnJvcnMuam9pbignLCAnKX1gXG4gKiB9XG4gKlxuICogZnVuY3Rpb24gb25SaWdodCh2YWx1ZTogbnVtYmVyKTogc3RyaW5nIHtcbiAqICAgcmV0dXJuIGBPazogJHt2YWx1ZX1gXG4gKiB9XG4gKlxuICogYXNzZXJ0LnN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIHJpZ2h0KDEpLFxuICogICAgIG1hdGNoKG9uTGVmdCwgb25SaWdodClcbiAqICAgKSxcbiAqICAgJ09rOiAxJ1xuICogKVxuICogYXNzZXJ0LnN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIGxlZnQoWydlcnJvciAxJywgJ2Vycm9yIDInXSksXG4gKiAgICAgbWF0Y2gob25MZWZ0LCBvblJpZ2h0KVxuICogICApLFxuICogICAnRXJyb3JzOiBlcnJvciAxLCBlcnJvciAyJ1xuICogKVxuICpcbiAqIEBjYXRlZ29yeSBwYXR0ZXJuIG1hdGNoaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgbWF0Y2ggPSBtYXRjaFc7XG4vKipcbiAqIEFsaWFzIG9mIFtgbWF0Y2hgXSgjbWF0Y2gpLlxuICpcbiAqIEBjYXRlZ29yeSBwYXR0ZXJuIG1hdGNoaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBmb2xkID0gbWF0Y2g7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BnZXRPckVsc2VgXSgjZ2V0b3JlbHNlKS5cbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgaGFuZGxlciByZXR1cm4gdHlwZSB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgZXJyb3IgaGFuZGxpbmdcbiAqIEBzaW5jZSAyLjYuMFxuICovXG5leHBvcnQgdmFyIGdldE9yRWxzZVcgPSBmdW5jdGlvbiAob25MZWZ0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKSA/IG9uTGVmdChtYS5sZWZ0KSA6IG1hLnJpZ2h0O1xuICAgIH07XG59O1xuLyoqXG4gKiBSZXR1cm5zIHRoZSB3cmFwcGVkIHZhbHVlIGlmIGl0J3MgYSBgUmlnaHRgIG9yIGEgZGVmYXVsdCB2YWx1ZSBpZiBpcyBhIGBMZWZ0YC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZ2V0T3JFbHNlLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIHJpZ2h0KDEpLFxuICogICAgIGdldE9yRWxzZSgoKSA9PiAwKVxuICogICApLFxuICogICAxXG4gKiApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIGxlZnQoJ2Vycm9yJyksXG4gKiAgICAgZ2V0T3JFbHNlKCgpID0+IDApXG4gKiAgICksXG4gKiAgIDBcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgZXJyb3IgaGFuZGxpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGdldE9yRWxzZSA9IGdldE9yRWxzZVc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb21iaW5hdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgbWFwcGluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIGZsYXAgPSAvKiNfX1BVUkVfXyovIGZsYXBfKEZ1bmN0b3IpO1xuLyoqXG4gKiBDb21iaW5lIHR3byBlZmZlY3RmdWwgYWN0aW9ucywga2VlcGluZyBvbmx5IHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0LlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGFwRmlyc3QgPSAvKiNfX1BVUkVfXyovIGFwRmlyc3RfKEFwcGx5KTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGFwRmlyc3RgXSgjYXBmaXJzdClcbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgZXJyb3IgdHlwZXMgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQHNpbmNlIDIuMTIuMFxuICovXG5leHBvcnQgdmFyIGFwRmlyc3RXID0gYXBGaXJzdDtcbi8qKlxuICogQ29tYmluZSB0d28gZWZmZWN0ZnVsIGFjdGlvbnMsIGtlZXBpbmcgb25seSB0aGUgcmVzdWx0IG9mIHRoZSBzZWNvbmQuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgYXBTZWNvbmQgPSAvKiNfX1BVUkVfXyovIGFwU2Vjb25kXyhBcHBseSk7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BhcFNlY29uZGBdKCNhcHNlY29uZClcbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgZXJyb3IgdHlwZXMgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQHNpbmNlIDIuMTIuMFxuICovXG5leHBvcnQgdmFyIGFwU2Vjb25kVyA9IGFwU2Vjb25kO1xuLyoqXG4gKiBDb21wb3NlcyBjb21wdXRhdGlvbnMgaW4gc2VxdWVuY2UsIHVzaW5nIHRoZSByZXR1cm4gdmFsdWUgb2Ygb25lIGNvbXB1dGF0aW9uIHRvIGRldGVybWluZSB0aGUgbmV4dCBjb21wdXRhdGlvbiBhbmRcbiAqIGtlZXBpbmcgb25seSB0aGUgcmVzdWx0IG9mIHRoZSBmaXJzdC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjE1LjBcbiAqL1xuZXhwb3J0IHZhciB0YXAgPSAvKiNfX1BVUkVfXyovIGR1YWwoMiwgY2hhaW5hYmxlLnRhcChDaGFpbikpO1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgZmxhdHRlbmBdKCNmbGF0dGVuKS5cbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgZXJyb3IgdHlwZXMgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQGNhdGVnb3J5IHNlcXVlbmNpbmdcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciBmbGF0dGVuVyA9IFxuLyojX19QVVJFX18qLyBmbGF0TWFwKGlkZW50aXR5KTtcbi8qKlxuICogVGhlIGBmbGF0dGVuYCBmdW5jdGlvbiBpcyB0aGUgY29udmVudGlvbmFsIG1vbmFkIGpvaW4gb3BlcmF0b3IuIEl0IGlzIHVzZWQgdG8gcmVtb3ZlIG9uZSBsZXZlbCBvZiBtb25hZGljIHN0cnVjdHVyZSwgcHJvamVjdGluZyBpdHMgYm91bmQgYXJndW1lbnQgaW50byB0aGUgb3V0ZXIgbGV2ZWwuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoRS5mbGF0dGVuKEUucmlnaHQoRS5yaWdodCgnYScpKSksIEUucmlnaHQoJ2EnKSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoRS5mbGF0dGVuKEUucmlnaHQoRS5sZWZ0KCdlJykpKSwgRS5sZWZ0KCdlJykpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKEUuZmxhdHRlbihFLmxlZnQoJ2UnKSksIEUubGVmdCgnZScpKVxuICpcbiAqIEBjYXRlZ29yeSBzZXF1ZW5jaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBmbGF0dGVuID0gZmxhdHRlblc7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGR1cGxpY2F0ZSA9IC8qI19fUFVSRV9fKi8gZXh0ZW5kKGlkZW50aXR5KTtcbi8qKlxuICogVXNlIGBsaWZ0T3B0aW9uYC5cbiAqXG4gKiBAY2F0ZWdvcnkgbGVnYWN5XG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZnJvbU9wdGlvbksgPSBcbi8qI19fUFVSRV9fKi8gZnJvbU9wdGlvbktfKEZyb21FaXRoZXIpO1xuLyoqXG4gKiBVc2UgYGZsYXRNYXBPcHRpb25gLlxuICpcbiAqIEBjYXRlZ29yeSBsZWdhY3lcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciBjaGFpbk9wdGlvbksgPSAvKiNfX1BVUkVfXyovIGNoYWluT3B0aW9uS18oRnJvbUVpdGhlciwgQ2hhaW4pO1xuLyoqXG4gKiBVc2UgYGZsYXRNYXBPcHRpb25gLlxuICpcbiAqIEBjYXRlZ29yeSBsZWdhY3lcbiAqIEBzaW5jZSAyLjEzLjJcbiAqL1xuZXhwb3J0IHZhciBjaGFpbk9wdGlvbktXID0gY2hhaW5PcHRpb25LO1xuLyoqIEBpbnRlcm5hbCAqL1xudmFyIF9Gcm9tRWl0aGVyID0ge1xuICAgIGZyb21FaXRoZXI6IEZyb21FaXRoZXIuZnJvbUVpdGhlclxufTtcbi8qKlxuICogQGNhdGVnb3J5IGxpZnRpbmdcbiAqIEBzaW5jZSAyLjE1LjBcbiAqL1xuZXhwb3J0IHZhciBsaWZ0TnVsbGFibGUgPSAvKiNfX1BVUkVfXyovIF8ubGlmdE51bGxhYmxlKF9Gcm9tRWl0aGVyKTtcbi8qKlxuICogQGNhdGVnb3J5IGxpZnRpbmdcbiAqIEBzaW5jZSAyLjE1LjBcbiAqL1xuZXhwb3J0IHZhciBsaWZ0T3B0aW9uID0gLyojX19QVVJFX18qLyBfLmxpZnRPcHRpb24oX0Zyb21FaXRoZXIpO1xuLyoqIEBpbnRlcm5hbCAqL1xudmFyIF9GbGF0TWFwID0ge1xuICAgIGZsYXRNYXA6IGZsYXRNYXBcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBzZXF1ZW5jaW5nXG4gKiBAc2luY2UgMi4xNS4wXG4gKi9cbmV4cG9ydCB2YXIgZmxhdE1hcE51bGxhYmxlID0gLyojX19QVVJFX18qLyBfLmZsYXRNYXBOdWxsYWJsZShfRnJvbUVpdGhlciwgX0ZsYXRNYXApO1xuLyoqXG4gKiBAY2F0ZWdvcnkgc2VxdWVuY2luZ1xuICogQHNpbmNlIDIuMTUuMFxuICovXG5leHBvcnQgdmFyIGZsYXRNYXBPcHRpb24gPSAvKiNfX1BVUkVfXyovIF8uZmxhdE1hcE9wdGlvbihfRnJvbUVpdGhlciwgX0ZsYXRNYXApO1xuLyoqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBFLnJpZ2h0KDEpLFxuICogICAgIEUuZmlsdGVyT3JFbHNlKFxuICogICAgICAgKG4pID0+IG4gPiAwLFxuICogICAgICAgKCkgPT4gJ2Vycm9yJ1xuICogICAgIClcbiAqICAgKSxcbiAqICAgRS5yaWdodCgxKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBFLnJpZ2h0KC0xKSxcbiAqICAgICBFLmZpbHRlck9yRWxzZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIEUubGVmdCgnZXJyb3InKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBFLmxlZnQoJ2EnKSxcbiAqICAgICBFLmZpbHRlck9yRWxzZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIEUubGVmdCgnYScpXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGZpbHRlcmluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZmlsdGVyT3JFbHNlID0gLyojX19QVVJFX18qLyBmaWx0ZXJPckVsc2VfKEZyb21FaXRoZXIsIENoYWluKTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGZpbHRlck9yRWxzZWBdKCNmaWx0ZXJvcmVsc2UpLlxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgZmlsdGVyaW5nXG4gKiBAc2luY2UgMi45LjBcbiAqL1xuZXhwb3J0IHZhciBmaWx0ZXJPckVsc2VXID0gZmlsdGVyT3JFbHNlO1xuLyoqXG4gKiBSZXR1cm5zIGEgYFJpZ2h0YCBpZiBpcyBhIGBMZWZ0YCAoYW5kIHZpY2UgdmVyc2EpLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIHN3YXAgPSBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIChpc0xlZnQobWEpID8gcmlnaHQobWEubGVmdCkgOiBsZWZ0KG1hLnJpZ2h0KSk7IH07XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BvckVsc2VgXSgjb3JlbHNlKS5cbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgcmV0dXJuIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBjYXRlZ29yeSBlcnJvciBoYW5kbGluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIG9yRWxzZVcgPSBmdW5jdGlvbiAob25MZWZ0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKSA/IG9uTGVmdChtYS5sZWZ0KSA6IG1hO1xuICAgIH07XG59O1xuLyoqXG4gKiBVc2VmdWwgZm9yIHJlY292ZXJpbmcgZnJvbSBlcnJvcnMuXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBvckVsc2UgPSBvckVsc2VXO1xuLyoqXG4gKiBUYWtlcyBhIGRlZmF1bHQgYW5kIGEgbnVsbGFibGUgdmFsdWUsIGlmIHRoZSB2YWx1ZSBpcyBub3QgbnVsbHksIHR1cm4gaXQgaW50byBhIGBSaWdodGAsIGlmIHRoZSB2YWx1ZSBpcyBudWxseSB1c2VcbiAqIHRoZSBwcm92aWRlZCBkZWZhdWx0IGFzIGEgYExlZnRgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBmcm9tTnVsbGFibGUsIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICpcbiAqIGNvbnN0IHBhcnNlID0gZnJvbU51bGxhYmxlKCdudWxseScpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwYXJzZSgxKSwgcmlnaHQoMSkpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKHBhcnNlKG51bGwpLCBsZWZ0KCdudWxseScpKVxuICpcbiAqIEBjYXRlZ29yeSBjb252ZXJzaW9uc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZnJvbU51bGxhYmxlID0gZnVuY3Rpb24gKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIGEgPT0gbnVsbCA/IGxlZnQoZSkgOiByaWdodChhKTtcbiAgICB9O1xufTtcbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgRWl0aGVyYCBmcm9tIGEgZnVuY3Rpb24gdGhhdCBtaWdodCB0aHJvdy5cbiAqXG4gKiBTZWUgYWxzbyBbYHRyeUNhdGNoS2BdKCN0cnljYXRjaGspLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCB1bnNhZmVIZWFkID0gPEE+KGFzOiBSZWFkb25seUFycmF5PEE+KTogQSA9PiB7XG4gKiAgIGlmIChhcy5sZW5ndGggPiAwKSB7XG4gKiAgICAgcmV0dXJuIGFzWzBdXG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgdGhyb3cgbmV3IEVycm9yKCdlbXB0eSBhcnJheScpXG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBoZWFkID0gPEE+KGFzOiBSZWFkb25seUFycmF5PEE+KTogRS5FaXRoZXI8RXJyb3IsIEE+ID0+XG4gKiAgIEUudHJ5Q2F0Y2goKCkgPT4gdW5zYWZlSGVhZChhcyksIGUgPT4gKGUgaW5zdGFuY2VvZiBFcnJvciA/IGUgOiBuZXcgRXJyb3IoJ3Vua25vd24gZXJyb3InKSkpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChoZWFkKFtdKSwgRS5sZWZ0KG5ldyBFcnJvcignZW1wdHkgYXJyYXknKSkpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKGhlYWQoWzEsIDIsIDNdKSwgRS5yaWdodCgxKSlcbiAqXG4gKiBAY2F0ZWdvcnkgaW50ZXJvcFxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgdHJ5Q2F0Y2ggPSBmdW5jdGlvbiAoZiwgb25UaHJvdykge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiByaWdodChmKCkpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gbGVmdChvblRocm93KGUpKTtcbiAgICB9XG59O1xuLyoqXG4gKiBDb252ZXJ0cyBhIGZ1bmN0aW9uIHRoYXQgbWF5IHRocm93IHRvIG9uZSByZXR1cm5pbmcgYSBgRWl0aGVyYC5cbiAqXG4gKiBAY2F0ZWdvcnkgaW50ZXJvcFxuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIHRyeUNhdGNoSyA9IGZ1bmN0aW9uIChmLCBvblRocm93KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ5Q2F0Y2goZnVuY3Rpb24gKCkgeyByZXR1cm4gZi5hcHBseSh2b2lkIDAsIGEpOyB9LCBvblRocm93KTtcbiAgICB9O1xufTtcbi8qKlxuICogVXNlIGBsaWZ0TnVsbGFibGVgLlxuICpcbiAqIEBjYXRlZ29yeSBsZWdhY3lcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnQgdmFyIGZyb21OdWxsYWJsZUsgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBmcm9tID0gZnJvbU51bGxhYmxlKGUpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZmxvdyhmLCBmcm9tKTsgfTtcbn07XG4vKipcbiAqIFVzZSBgZmxhdE1hcE51bGxhYmxlYC5cbiAqXG4gKiBAY2F0ZWdvcnkgbGVnYWN5XG4gKiBAc2luY2UgMi45LjBcbiAqL1xuZXhwb3J0IHZhciBjaGFpbk51bGxhYmxlSyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGZyb20gPSBmcm9tTnVsbGFibGVLKGUpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZmxhdE1hcChmcm9tKGYpKTsgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb252ZXJzaW9uc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIHRvVW5pb24gPSAvKiNfX1BVUkVfXyovIGZvbGRXKGlkZW50aXR5LCBpZGVudGl0eSk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB1dGlsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBEZWZhdWx0IHZhbHVlIGZvciB0aGUgYG9uRXJyb3JgIGFyZ3VtZW50IG9mIGB0cnlDYXRjaGBcbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvRXJyb3IoZSkge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBlIGluc3RhbmNlb2YgRXJyb3IgPyBlIDogbmV3IEVycm9yKFN0cmluZyhlKSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGVsZW0oRSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSwgbWEpIHtcbiAgICAgICAgaWYgKG1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBlbGVtRV8xID0gZWxlbShFKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIGVsZW1FXzEoYSwgbWEpOyB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0xlZnQobWEpID8gZmFsc2UgOiBFLmVxdWFscyhhLCBtYS5yaWdodCk7XG4gICAgfTtcbn1cbi8qKlxuICogUmV0dXJucyBgZmFsc2VgIGlmIGBMZWZ0YCBvciByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGFwcGxpY2F0aW9uIG9mIHRoZSBnaXZlbiBwcmVkaWNhdGUgdG8gdGhlIGBSaWdodGAgdmFsdWUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IGV4aXN0cywgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKlxuICogY29uc3QgZ3QyID0gZXhpc3RzKChuOiBudW1iZXIpID0+IG4gPiAyKVxuICpcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChndDIobGVmdCgnYScpKSwgZmFsc2UpXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoZ3QyKHJpZ2h0KDEpKSwgZmFsc2UpXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoZ3QyKHJpZ2h0KDMpKSwgdHJ1ZSlcbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBleGlzdHMgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKSA/IGZhbHNlIDogcHJlZGljYXRlKG1hLnJpZ2h0KTtcbiAgICB9O1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGRvIG5vdGF0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBkbyBub3RhdGlvblxuICogQHNpbmNlIDIuOS4wXG4gKi9cbmV4cG9ydCB2YXIgRG8gPSAvKiNfX1BVUkVfXyovIG9mKF8uZW1wdHlSZWNvcmQpO1xuLyoqXG4gKiBAY2F0ZWdvcnkgZG8gbm90YXRpb25cbiAqIEBzaW5jZSAyLjguMFxuICovXG5leHBvcnQgdmFyIGJpbmRUbyA9IC8qI19fUFVSRV9fKi8gYmluZFRvXyhGdW5jdG9yKTtcbnZhciBsZXRfID0gLyojX19QVVJFX18qLyBsZXRfXyhGdW5jdG9yKTtcbmV4cG9ydCB7IFxuLyoqXG4gKiBAY2F0ZWdvcnkgZG8gbm90YXRpb25cbiAqIEBzaW5jZSAyLjEzLjBcbiAqL1xubGV0XyBhcyBsZXQgfTtcbi8qKlxuICogQGNhdGVnb3J5IGRvIG5vdGF0aW9uXG4gKiBAc2luY2UgMi44LjBcbiAqL1xuZXhwb3J0IHZhciBiaW5kID0gLyojX19QVVJFX18qLyBjaGFpbmFibGUuYmluZChDaGFpbik7XG4vKipcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgZG8gbm90YXRpb25cbiAqIEBzaW5jZSAyLjguMFxuICovXG5leHBvcnQgdmFyIGJpbmRXID0gYmluZDtcbi8qKlxuICogQGNhdGVnb3J5IGRvIG5vdGF0aW9uXG4gKiBAc2luY2UgMi44LjBcbiAqL1xuZXhwb3J0IHZhciBhcFMgPSAvKiNfX1BVUkVfXyovIGFwU18oQXBwbHkpO1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgYXBTYF0oI2FwcykuXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIGVycm9yIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBjYXRlZ29yeSBkbyBub3RhdGlvblxuICogQHNpbmNlIDIuOC4wXG4gKi9cbmV4cG9ydCB2YXIgYXBTVyA9IGFwUztcbi8qKlxuICogQHNpbmNlIDIuMTEuMFxuICovXG5leHBvcnQgdmFyIEFwVCA9IC8qI19fUFVSRV9fKi8gb2YoXy5lbXB0eVJlYWRvbmx5QXJyYXkpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gYXJyYXkgdXRpbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogRXF1aXZhbGVudCB0byBgUmVhZG9ubHlOb25FbXB0eUFycmF5I3RyYXZlcnNlV2l0aEluZGV4KEFwcGxpY2F0aXZlKWAuXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciB0cmF2ZXJzZVJlYWRvbmx5Tm9uRW1wdHlBcnJheVdpdGhJbmRleCA9IGZ1bmN0aW9uIChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcykge1xuICAgICAgICB2YXIgZSA9IGYoMCwgXy5oZWFkKGFzKSk7XG4gICAgICAgIGlmIChpc0xlZnQoZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvdXQgPSBbZS5yaWdodF07XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlXzEgPSBmKGksIGFzW2ldKTtcbiAgICAgICAgICAgIGlmIChpc0xlZnQoZV8xKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlXzE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQucHVzaChlXzEucmlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByaWdodChvdXQpO1xuICAgIH07XG59O1xuLyoqXG4gKiBFcXVpdmFsZW50IHRvIGBSZWFkb25seUFycmF5I3RyYXZlcnNlV2l0aEluZGV4KEFwcGxpY2F0aXZlKWAuXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciB0cmF2ZXJzZVJlYWRvbmx5QXJyYXlXaXRoSW5kZXggPSBmdW5jdGlvbiAoZikge1xuICAgIHZhciBnID0gdHJhdmVyc2VSZWFkb25seU5vbkVtcHR5QXJyYXlXaXRoSW5kZXgoZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcykgeyByZXR1cm4gKF8uaXNOb25FbXB0eShhcykgPyBnKGFzKSA6IEFwVCk7IH07XG59O1xuLyoqXG4gKiBFcXVpdmFsZW50IHRvIGBSZWFkb25seUFycmF5I3RyYXZlcnNlV2l0aEluZGV4KEFwcGxpY2F0aXZlKWAuXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnQgdmFyIHRyYXZlcnNlQXJyYXlXaXRoSW5kZXggPSB0cmF2ZXJzZVJlYWRvbmx5QXJyYXlXaXRoSW5kZXg7XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gYFJlYWRvbmx5QXJyYXkjdHJhdmVyc2UoQXBwbGljYXRpdmUpYC5cbiAqXG4gKiBAY2F0ZWdvcnkgdHJhdmVyc2luZ1xuICogQHNpbmNlIDIuOS4wXG4gKi9cbmV4cG9ydCB2YXIgdHJhdmVyc2VBcnJheSA9IGZ1bmN0aW9uIChmKSB7IHJldHVybiB0cmF2ZXJzZVJlYWRvbmx5QXJyYXlXaXRoSW5kZXgoZnVuY3Rpb24gKF8sIGEpIHsgcmV0dXJuIGYoYSk7IH0pOyB9O1xuLyoqXG4gKiBFcXVpdmFsZW50IHRvIGBSZWFkb25seUFycmF5I3NlcXVlbmNlKEFwcGxpY2F0aXZlKWAuXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnQgdmFyIHNlcXVlbmNlQXJyYXkgPSBcbi8qI19fUFVSRV9fKi8gdHJhdmVyc2VBcnJheShpZGVudGl0eSk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBsZWdhY3lcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQWxpYXMgb2YgYGZsYXRNYXBgLlxuICpcbiAqIEBjYXRlZ29yeSBsZWdhY3lcbiAqIEBzaW5jZSAyLjYuMFxuICovXG5leHBvcnQgdmFyIGNoYWluVyA9IGZsYXRNYXA7XG4vKipcbiAqIEFsaWFzIG9mIGBmbGF0TWFwYC5cbiAqXG4gKiBAY2F0ZWdvcnkgbGVnYWN5XG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBjaGFpbiA9IGZsYXRNYXA7XG4vKipcbiAqIEFsaWFzIG9mIGB0YXBgLlxuICpcbiAqIEBjYXRlZ29yeSBsZWdhY3lcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGNoYWluRmlyc3QgPSB0YXA7XG4vKipcbiAqIEFsaWFzIG9mIGB0YXBgLlxuICpcbiAqIEBjYXRlZ29yeSBsZWdhY3lcbiAqIEBzaW5jZSAyLjguMFxuICovXG5leHBvcnQgdmFyIGNoYWluRmlyc3RXID0gdGFwO1xuLyoqXG4gKiBVc2UgW2BwYXJzZWBdKC4vSnNvbi50cy5odG1sI3BhcnNlKSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUpTT04ocywgb25FcnJvcikge1xuICAgIHJldHVybiB0cnlDYXRjaChmdW5jdGlvbiAoKSB7IHJldHVybiBKU09OLnBhcnNlKHMpOyB9LCBvbkVycm9yKTtcbn1cbi8qKlxuICogVXNlIFtgc3RyaW5naWZ5YF0oLi9Kc29uLnRzLmh0bWwjc3RyaW5naWZ5KSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgc3RyaW5naWZ5SlNPTiA9IGZ1bmN0aW9uICh1LCBvbkVycm9yKSB7XG4gICAgcmV0dXJuIHRyeUNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHMgPSBKU09OLnN0cmluZ2lmeSh1KTtcbiAgICAgICAgaWYgKHR5cGVvZiBzICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb252ZXJ0aW5nIHVuc3VwcG9ydGVkIHN0cnVjdHVyZSB0byBKU09OJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfSwgb25FcnJvcik7XG59O1xuLyoqXG4gKiBUaGlzIGluc3RhbmNlIGlzIGRlcHJlY2F0ZWQsIHVzZSBzbWFsbCwgc3BlY2lmaWMgaW5zdGFuY2VzIGluc3RlYWQuXG4gKiBGb3IgZXhhbXBsZSBpZiBhIGZ1bmN0aW9uIG5lZWRzIGEgYEZ1bmN0b3JgIGluc3RhbmNlLCBwYXNzIGBFLkZ1bmN0b3JgIGluc3RlYWQgb2YgYEUuZWl0aGVyYFxuICogKHdoZXJlIGBFYCBpcyBmcm9tIGBpbXBvcnQgRSBmcm9tICdmcC10cy9FaXRoZXInYClcbiAqXG4gKiBAY2F0ZWdvcnkgem9uZSBvZiBkZWF0aFxuICogQHNpbmNlIDIuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgdmFyIGVpdGhlciA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgb2Y6IG9mLFxuICAgIGFwOiBfYXAsXG4gICAgY2hhaW46IGZsYXRNYXAsXG4gICAgcmVkdWNlOiBfcmVkdWNlLFxuICAgIGZvbGRNYXA6IF9mb2xkTWFwLFxuICAgIHJlZHVjZVJpZ2h0OiBfcmVkdWNlUmlnaHQsXG4gICAgdHJhdmVyc2U6IF90cmF2ZXJzZSxcbiAgICBzZXF1ZW5jZTogc2VxdWVuY2UsXG4gICAgYmltYXA6IF9iaW1hcCxcbiAgICBtYXBMZWZ0OiBfbWFwTGVmdCxcbiAgICBhbHQ6IF9hbHQsXG4gICAgZXh0ZW5kOiBfZXh0ZW5kLFxuICAgIGNoYWluUmVjOiBfY2hhaW5SZWMsXG4gICAgdGhyb3dFcnJvcjogdGhyb3dFcnJvclxufTtcbi8qKlxuICogVXNlIFtgZ2V0QXBwbHlTZW1pZ3JvdXBgXSguL0FwcGx5LnRzLmh0bWwjZ2V0YXBwbHlzZW1pZ3JvdXApIGluc3RlYWQuXG4gKlxuICogU2VtaWdyb3VwIHJldHVybmluZyB0aGUgbGVmdC1tb3N0IGBMZWZ0YCB2YWx1ZS4gSWYgYm90aCBvcGVyYW5kcyBhcmUgYFJpZ2h0YHMgdGhlbiB0aGUgaW5uZXIgdmFsdWVzXG4gKiBhcmUgY29uY2F0ZW5hdGVkIHVzaW5nIHRoZSBwcm92aWRlZCBgU2VtaWdyb3VwYFxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZ2V0QXBwbHlTZW1pZ3JvdXAgPSBcbi8qI19fUFVSRV9fKi8gZ2V0QXBwbHlTZW1pZ3JvdXBfKEFwcGx5KTtcbi8qKlxuICogVXNlIFtgZ2V0QXBwbGljYXRpdmVNb25vaWRgXSguL0FwcGxpY2F0aXZlLnRzLmh0bWwjZ2V0YXBwbGljYXRpdmVtb25vaWQpIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciBnZXRBcHBseU1vbm9pZCA9IFxuLyojX19QVVJFX18qLyBnZXRBcHBsaWNhdGl2ZU1vbm9pZChBcHBsaWNhdGl2ZSk7XG4vKipcbiAqIFVzZSBbYGdldEFwcGx5U2VtaWdyb3VwYF0oLi9BcHBseS50cy5odG1sI2dldGFwcGx5c2VtaWdyb3VwKSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZ2V0VmFsaWRhdGlvblNlbWlncm91cCA9IGZ1bmN0aW9uIChTRSwgU0EpIHtcbiAgICByZXR1cm4gZ2V0QXBwbHlTZW1pZ3JvdXBfKGdldEFwcGxpY2F0aXZlVmFsaWRhdGlvbihTRSkpKFNBKTtcbn07XG4vKipcbiAqIFVzZSBbYGdldEFwcGxpY2F0aXZlTW9ub2lkYF0oLi9BcHBsaWNhdGl2ZS50cy5odG1sI2dldGFwcGxpY2F0aXZlbW9ub2lkKSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZ2V0VmFsaWRhdGlvbk1vbm9pZCA9IGZ1bmN0aW9uIChTRSwgTUEpIHtcbiAgICByZXR1cm4gZ2V0QXBwbGljYXRpdmVNb25vaWQoZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uKFNFKSkoTUEpO1xufTtcbi8qKlxuICogVXNlIFtgZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uYF0oI2dldGFwcGxpY2F0aXZldmFsaWRhdGlvbikgYW5kIFtgZ2V0QWx0VmFsaWRhdGlvbmBdKCNnZXRhbHR2YWxpZGF0aW9uKSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZGF0aW9uKFNFKSB7XG4gICAgdmFyIGFwID0gZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uKFNFKS5hcDtcbiAgICB2YXIgYWx0ID0gZ2V0QWx0VmFsaWRhdGlvbihTRSkuYWx0O1xuICAgIHJldHVybiB7XG4gICAgICAgIFVSSTogVVJJLFxuICAgICAgICBfRTogdW5kZWZpbmVkLFxuICAgICAgICBtYXA6IF9tYXAsXG4gICAgICAgIG9mOiBvZixcbiAgICAgICAgY2hhaW46IGZsYXRNYXAsXG4gICAgICAgIGJpbWFwOiBfYmltYXAsXG4gICAgICAgIG1hcExlZnQ6IF9tYXBMZWZ0LFxuICAgICAgICByZWR1Y2U6IF9yZWR1Y2UsXG4gICAgICAgIGZvbGRNYXA6IF9mb2xkTWFwLFxuICAgICAgICByZWR1Y2VSaWdodDogX3JlZHVjZVJpZ2h0LFxuICAgICAgICBleHRlbmQ6IF9leHRlbmQsXG4gICAgICAgIHRyYXZlcnNlOiBfdHJhdmVyc2UsXG4gICAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSxcbiAgICAgICAgY2hhaW5SZWM6IF9jaGFpblJlYyxcbiAgICAgICAgdGhyb3dFcnJvcjogdGhyb3dFcnJvcixcbiAgICAgICAgYXA6IGFwLFxuICAgICAgICBhbHQ6IGFsdFxuICAgIH07XG59XG4iLCIvKipcbiAqIFRoZSBgRnJvbUVpdGhlcmAgdHlwZSBjbGFzcyByZXByZXNlbnRzIHRob3NlIGRhdGEgdHlwZXMgd2hpY2ggc3VwcG9ydCBlcnJvcnMuXG4gKlxuICogQHNpbmNlIDIuMTAuMFxuICovXG5pbXBvcnQgeyB0YXAgfSBmcm9tICcuL0NoYWluJztcbmltcG9ydCB7IGZsb3cgfSBmcm9tICcuL2Z1bmN0aW9uJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnLi9pbnRlcm5hbCc7XG5leHBvcnQgZnVuY3Rpb24gZnJvbU9wdGlvbihGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbk5vbmUpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gRi5mcm9tRWl0aGVyKF8uaXNOb25lKG1hKSA/IF8ubGVmdChvbk5vbmUoKSkgOiBfLnJpZ2h0KG1hLnZhbHVlKSk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbVByZWRpY2F0ZShGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwcmVkaWNhdGUsIG9uRmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gRi5mcm9tRWl0aGVyKHByZWRpY2F0ZShhKSA/IF8ucmlnaHQoYSkgOiBfLmxlZnQob25GYWxzZShhKSkpO1xuICAgICAgICB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbU9wdGlvbksoRikge1xuICAgIHZhciBmcm9tT3B0aW9uRiA9IGZyb21PcHRpb24oRik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbk5vbmUpIHtcbiAgICAgICAgdmFyIGZyb20gPSBmcm9tT3B0aW9uRihvbk5vbmUpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZsb3coZiwgZnJvbSk7IH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjaGFpbk9wdGlvbksoRiwgTSkge1xuICAgIHZhciBmcm9tT3B0aW9uS0YgPSBmcm9tT3B0aW9uSyhGKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uTm9uZSkge1xuICAgICAgICB2YXIgZnJvbSA9IGZyb21PcHRpb25LRihvbk5vbmUpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gTS5jaGFpbihtYSwgZnJvbShmKSk7IH07IH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRWl0aGVySyhGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmbG93KGYsIEYuZnJvbUVpdGhlcik7IH07XG59XG5leHBvcnQgZnVuY3Rpb24gY2hhaW5FaXRoZXJLKEYsIE0pIHtcbiAgICB2YXIgZnJvbUVpdGhlcktGID0gZnJvbUVpdGhlcksoRik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIE0uY2hhaW4obWEsIGZyb21FaXRoZXJLRihmKSk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gY2hhaW5GaXJzdEVpdGhlcksoRiwgTSkge1xuICAgIHZhciB0YXBFaXRoZXJNID0gdGFwRWl0aGVyKEYsIE0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKG1hKSB7IHJldHVybiB0YXBFaXRoZXJNKG1hLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJPckVsc2UoRiwgTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocHJlZGljYXRlLCBvbkZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgICAgIHJldHVybiBNLmNoYWluKG1hLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gRi5mcm9tRWl0aGVyKHByZWRpY2F0ZShhKSA/IF8ucmlnaHQoYSkgOiBfLmxlZnQob25GYWxzZShhKSkpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9O1xufVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRhcEVpdGhlcihGLCBNKSB7XG4gICAgdmFyIGZyb21FaXRoZXIgPSBmcm9tRWl0aGVySyhGKTtcbiAgICB2YXIgdGFwTSA9IHRhcChNKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGYsIGYpIHsgcmV0dXJuIHRhcE0oc2VsZiwgZnJvbUVpdGhlcihmKSk7IH07XG59XG4iLCIvKipcbiAqIEEgYEZ1bmN0b3JgIGlzIGEgdHlwZSBjb25zdHJ1Y3RvciB3aGljaCBzdXBwb3J0cyBhIG1hcHBpbmcgb3BlcmF0aW9uIGBtYXBgLlxuICpcbiAqIGBtYXBgIGNhbiBiZSB1c2VkIHRvIHR1cm4gZnVuY3Rpb25zIGBhIC0+IGJgIGludG8gZnVuY3Rpb25zIGBmIGEgLT4gZiBiYCB3aG9zZSBhcmd1bWVudCBhbmQgcmV0dXJuIHR5cGVzIHVzZSB0aGUgdHlwZVxuICogY29uc3RydWN0b3IgYGZgIHRvIHJlcHJlc2VudCBzb21lIGNvbXB1dGF0aW9uYWwgY29udGV4dC5cbiAqXG4gKiBJbnN0YW5jZXMgbXVzdCBzYXRpc2Z5IHRoZSBmb2xsb3dpbmcgbGF3czpcbiAqXG4gKiAxLiBJZGVudGl0eTogYEYubWFwKGZhLCBhID0+IGEpIDwtPiBmYWBcbiAqIDIuIENvbXBvc2l0aW9uOiBgRi5tYXAoZmEsIGEgPT4gYmMoYWIoYSkpKSA8LT4gRi5tYXAoRi5tYXAoZmEsIGFiKSwgYmMpYFxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5pbXBvcnQgeyBwaXBlIH0gZnJvbSAnLi9mdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gbWFwKEYsIEcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5tYXAoZmEsIGZ1bmN0aW9uIChnYSkgeyByZXR1cm4gRy5tYXAoZ2EsIGYpOyB9KTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmbGFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYWIpIHsgcmV0dXJuIEYubWFwKGZhYiwgZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGYoYSk7IH0pOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRUbyhGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYubWFwKGZhLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB7fSwgX2FbbmFtZV0gPSBhLCBfYSk7XG4gICAgfSk7IH07IH07XG59XG5mdW5jdGlvbiBsZXRfKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5hbWUsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5tYXAoZmEsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGEsIChfYSA9IHt9LCBfYVtuYW1lXSA9IGYoYSksIF9hKSk7XG4gICAgfSk7IH07IH07XG59XG5leHBvcnQgeyBcbi8qKlxuICogQHNpbmNlIDIuMTMuMFxuICovXG5sZXRfIGFzIGxldCB9O1xuLyoqIEBkZXByZWNhdGVkICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVuY3RvckNvbXBvc2l0aW9uKEYsIEcpIHtcbiAgICB2YXIgX21hcCA9IG1hcChGLCBHKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBtYXA6IGZ1bmN0aW9uIChmZ2EsIGYpIHsgcmV0dXJuIHBpcGUoZmdhLCBfbWFwKGYpKTsgfVxuICAgIH07XG59XG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gYXMoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2VsZiwgYikgeyByZXR1cm4gRi5tYXAoc2VsZiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gYjsgfSk7IH07XG59XG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gYXNVbml0KEYpIHtcbiAgICB2YXIgYXNNID0gYXMoRik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmKSB7IHJldHVybiBhc00oc2VsZiwgdW5kZWZpbmVkKTsgfTtcbn1cbiIsIi8qKlxuICogYGBgdHNcbiAqIGludGVyZmFjZSBTZXBhcmF0ZWQ8RSwgQT4ge1xuICogICAgcmVhZG9ubHkgbGVmdDogRVxuICogICAgcmVhZG9ubHkgcmlnaHQ6IEFcbiAqIH1cbiAqIGBgYFxuICpcbiAqIFJlcHJlc2VudHMgYSByZXN1bHQgb2Ygc2VwYXJhdGluZyBhIHdob2xlIGludG8gdHdvIHBhcnRzLlxuICpcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJy4vZnVuY3Rpb24nO1xuaW1wb3J0IHsgZmxhcCBhcyBmbGFwXyB9IGZyb20gJy4vRnVuY3Rvcic7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdHJ1Y3RvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIHNlcGFyYXRlZCA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gKHsgbGVmdDogbGVmdCwgcmlnaHQ6IHJpZ2h0IH0pOyB9O1xudmFyIF9tYXAgPSBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIG1hcChmKSk7IH07XG52YXIgX21hcExlZnQgPSBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIG1hcExlZnQoZikpOyB9O1xudmFyIF9iaW1hcCA9IGZ1bmN0aW9uIChmYSwgZywgZikgeyByZXR1cm4gcGlwZShmYSwgYmltYXAoZywgZikpOyB9O1xuLyoqXG4gKiBgbWFwYCBjYW4gYmUgdXNlZCB0byB0dXJuIGZ1bmN0aW9ucyBgKGE6IEEpID0+IEJgIGludG8gZnVuY3Rpb25zIGAoZmE6IEY8QT4pID0+IEY8Qj5gIHdob3NlIGFyZ3VtZW50IGFuZCByZXR1cm4gdHlwZXNcbiAqIHVzZSB0aGUgdHlwZSBjb25zdHJ1Y3RvciBgRmAgdG8gcmVwcmVzZW50IHNvbWUgY29tcHV0YXRpb25hbCBjb250ZXh0LlxuICpcbiAqIEBjYXRlZ29yeSBtYXBwaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgbWFwID0gZnVuY3Rpb24gKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgICAgIHJldHVybiBzZXBhcmF0ZWQobGVmdChmYSksIGYocmlnaHQoZmEpKSk7XG4gICAgfTtcbn07XG4vKipcbiAqIE1hcCBhIGZ1bmN0aW9uIG92ZXIgdGhlIGZpcnN0IHR5cGUgYXJndW1lbnQgb2YgYSBiaWZ1bmN0b3IuXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgbWFwTGVmdCA9IGZ1bmN0aW9uIChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgICAgICByZXR1cm4gc2VwYXJhdGVkKGYobGVmdChmYSkpLCByaWdodChmYSkpO1xuICAgIH07XG59O1xuLyoqXG4gKiBNYXAgYSBwYWlyIG9mIGZ1bmN0aW9ucyBvdmVyIHRoZSB0d28gdHlwZSBhcmd1bWVudHMgb2YgdGhlIGJpZnVuY3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgbWFwcGluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIGJpbWFwID0gZnVuY3Rpb24gKGYsIGcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgICAgIHJldHVybiBzZXBhcmF0ZWQoZihsZWZ0KGZhKSksIGcocmlnaHQoZmEpKSk7XG4gICAgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSB0eXBlIGxhbWJkYXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBVUkkgPSAnU2VwYXJhdGVkJztcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIEJpZnVuY3RvciA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXBMZWZ0OiBfbWFwTGVmdCxcbiAgICBiaW1hcDogX2JpbWFwXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgRnVuY3RvciA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXBcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBtYXBwaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZmxhcCA9IC8qI19fUFVSRV9fKi8gZmxhcF8oRnVuY3Rvcik7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB1dGlsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgbGVmdCA9IGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLmxlZnQ7IH07XG4vKipcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciByaWdodCA9IGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLnJpZ2h0OyB9O1xuIiwiaW1wb3J0ICogYXMgXyBmcm9tICcuL2ludGVybmFsJztcbmV4cG9ydCBmdW5jdGlvbiB3aWx0RGVmYXVsdChULCBDKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChGKSB7XG4gICAgICAgIHZhciB0cmF2ZXJzZUYgPSBULnRyYXZlcnNlKEYpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHdhLCBmKSB7IHJldHVybiBGLm1hcCh0cmF2ZXJzZUYod2EsIGYpLCBDLnNlcGFyYXRlKTsgfTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhlckRlZmF1bHQoVCwgQykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoRikge1xuICAgICAgICB2YXIgdHJhdmVyc2VGID0gVC50cmF2ZXJzZShGKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh3YSwgZikgeyByZXR1cm4gRi5tYXAodHJhdmVyc2VGKHdhLCBmKSwgQy5jb21wYWN0KTsgfTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckUoVykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoRikge1xuICAgICAgICB2YXIgd2l0aGVyRiA9IFcud2l0aGVyKEYpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHByZWRpY2F0ZSkgeyByZXR1cm4gZnVuY3Rpb24gKGdhKSB7IHJldHVybiB3aXRoZXJGKGdhLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gRi5tYXAocHJlZGljYXRlKGEpLCBmdW5jdGlvbiAoYikgeyByZXR1cm4gKGIgPyBfLnNvbWUoYSkgOiBfLm5vbmUpOyB9KTsgfSk7IH07IH07XG4gICAgfTtcbn1cbiIsInZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGluc3RhbmNlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0Qm9vbGVhbkFsZ2VicmEgPSBmdW5jdGlvbiAoQikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgICAgICBtZWV0OiBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIEIubWVldCh4KGEpLCB5KGEpKTsgfTsgfSxcbiAgICAgICAgam9pbjogZnVuY3Rpb24gKHgsIHkpIHsgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBCLmpvaW4oeChhKSwgeShhKSk7IH07IH0sXG4gICAgICAgIHplcm86IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEIuemVybzsgfSxcbiAgICAgICAgb25lOiBmdW5jdGlvbiAoKSB7IHJldHVybiBCLm9uZTsgfSxcbiAgICAgICAgaW1wbGllczogZnVuY3Rpb24gKHgsIHkpIHsgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBCLmltcGxpZXMoeChhKSwgeShhKSk7IH07IH0sXG4gICAgICAgIG5vdDogZnVuY3Rpb24gKHgpIHsgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBCLm5vdCh4KGEpKTsgfTsgfVxuICAgIH0pOyB9O1xufTtcbi8qKlxuICogVW5hcnkgZnVuY3Rpb25zIGZvcm0gYSBzZW1pZ3JvdXAgYXMgbG9uZyBhcyB5b3UgY2FuIHByb3ZpZGUgYSBzZW1pZ3JvdXAgZm9yIHRoZSBjb2RvbWFpbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgUHJlZGljYXRlLCBnZXRTZW1pZ3JvdXAgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIEIgZnJvbSAnZnAtdHMvYm9vbGVhbidcbiAqXG4gKiBjb25zdCBmOiBQcmVkaWNhdGU8bnVtYmVyPiA9IChuKSA9PiBuIDw9IDJcbiAqIGNvbnN0IGc6IFByZWRpY2F0ZTxudW1iZXI+ID0gKG4pID0+IG4gPj0gMFxuICpcbiAqIGNvbnN0IFMxID0gZ2V0U2VtaWdyb3VwKEIuU2VtaWdyb3VwQWxsKTxudW1iZXI+KClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMxLmNvbmNhdChmLCBnKSgxKSwgdHJ1ZSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoUzEuY29uY2F0KGYsIGcpKDMpLCBmYWxzZSlcbiAqXG4gKiBjb25zdCBTMiA9IGdldFNlbWlncm91cChCLlNlbWlncm91cEFueSk8bnVtYmVyPigpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTMi5jb25jYXQoZiwgZykoMSksIHRydWUpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMyLmNvbmNhdChmLCBnKSgzKSwgdHJ1ZSlcbiAqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0U2VtaWdyb3VwID0gZnVuY3Rpb24gKFMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICAgICAgY29uY2F0OiBmdW5jdGlvbiAoZiwgZykgeyByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIFMuY29uY2F0KGYoYSksIGcoYSkpOyB9OyB9XG4gICAgfSk7IH07XG59O1xuLyoqXG4gKiBVbmFyeSBmdW5jdGlvbnMgZm9ybSBhIG1vbm9pZCBhcyBsb25nIGFzIHlvdSBjYW4gcHJvdmlkZSBhIG1vbm9pZCBmb3IgdGhlIGNvZG9tYWluLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBQcmVkaWNhdGUgfSBmcm9tICdmcC10cy9QcmVkaWNhdGUnXG4gKiBpbXBvcnQgeyBnZXRNb25vaWQgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIEIgZnJvbSAnZnAtdHMvYm9vbGVhbidcbiAqXG4gKiBjb25zdCBmOiBQcmVkaWNhdGU8bnVtYmVyPiA9IChuKSA9PiBuIDw9IDJcbiAqIGNvbnN0IGc6IFByZWRpY2F0ZTxudW1iZXI+ID0gKG4pID0+IG4gPj0gMFxuICpcbiAqIGNvbnN0IE0xID0gZ2V0TW9ub2lkKEIuTW9ub2lkQWxsKTxudW1iZXI+KClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKE0xLmNvbmNhdChmLCBnKSgxKSwgdHJ1ZSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoTTEuY29uY2F0KGYsIGcpKDMpLCBmYWxzZSlcbiAqXG4gKiBjb25zdCBNMiA9IGdldE1vbm9pZChCLk1vbm9pZEFueSk8bnVtYmVyPigpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChNMi5jb25jYXQoZiwgZykoMSksIHRydWUpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKE0yLmNvbmNhdChmLCBnKSgzKSwgdHJ1ZSlcbiAqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0TW9ub2lkID0gZnVuY3Rpb24gKE0pIHtcbiAgICB2YXIgZ2V0U2VtaWdyb3VwTSA9IGdldFNlbWlncm91cChNKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICAgICAgY29uY2F0OiBnZXRTZW1pZ3JvdXBNKCkuY29uY2F0LFxuICAgICAgICBlbXB0eTogZnVuY3Rpb24gKCkgeyByZXR1cm4gTS5lbXB0eTsgfVxuICAgIH0pOyB9O1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIGdldFNlbWlyaW5nID0gZnVuY3Rpb24gKFMpIHsgcmV0dXJuICh7XG4gICAgYWRkOiBmdW5jdGlvbiAoZiwgZykgeyByZXR1cm4gZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFMuYWRkKGYoeCksIGcoeCkpOyB9OyB9LFxuICAgIHplcm86IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFMuemVybzsgfSxcbiAgICBtdWw6IGZ1bmN0aW9uIChmLCBnKSB7IHJldHVybiBmdW5jdGlvbiAoeCkgeyByZXR1cm4gUy5tdWwoZih4KSwgZyh4KSk7IH07IH0sXG4gICAgb25lOiBmdW5jdGlvbiAoKSB7IHJldHVybiBTLm9uZTsgfVxufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRSaW5nID0gZnVuY3Rpb24gKFIpIHtcbiAgICB2YXIgUyA9IGdldFNlbWlyaW5nKFIpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGFkZDogUy5hZGQsXG4gICAgICAgIG11bDogUy5tdWwsXG4gICAgICAgIG9uZTogUy5vbmUsXG4gICAgICAgIHplcm86IFMuemVybyxcbiAgICAgICAgc3ViOiBmdW5jdGlvbiAoZiwgZykgeyByZXR1cm4gZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFIuc3ViKGYoeCksIGcoeCkpOyB9OyB9XG4gICAgfTtcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB1dGlsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAc2luY2UgMi4xMS4wXG4gKi9cbmV4cG9ydCB2YXIgYXBwbHkgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikge1xuICAgICAgICByZXR1cm4gZihhKTtcbiAgICB9O1xufTtcbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eShhKSB7XG4gICAgcmV0dXJuIGE7XG59XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIHVuc2FmZUNvZXJjZSA9IGlkZW50aXR5O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0YW50KGEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gYTsgfTtcbn1cbi8qKlxuICogQSB0aHVuayB0aGF0IHJldHVybnMgYWx3YXlzIGB0cnVlYC5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBjb25zdFRydWUgPSAvKiNfX1BVUkVfXyovIGNvbnN0YW50KHRydWUpO1xuLyoqXG4gKiBBIHRodW5rIHRoYXQgcmV0dXJucyBhbHdheXMgYGZhbHNlYC5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBjb25zdEZhbHNlID0gLyojX19QVVJFX18qLyBjb25zdGFudChmYWxzZSk7XG4vKipcbiAqIEEgdGh1bmsgdGhhdCByZXR1cm5zIGFsd2F5cyBgbnVsbGAuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgY29uc3ROdWxsID0gLyojX19QVVJFX18qLyBjb25zdGFudChudWxsKTtcbi8qKlxuICogQSB0aHVuayB0aGF0IHJldHVybnMgYWx3YXlzIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGNvbnN0VW5kZWZpbmVkID0gLyojX19QVVJFX18qLyBjb25zdGFudCh1bmRlZmluZWQpO1xuLyoqXG4gKiBBIHRodW5rIHRoYXQgcmV0dXJucyBhbHdheXMgYHZvaWRgLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGNvbnN0Vm9pZCA9IGNvbnN0VW5kZWZpbmVkO1xuZXhwb3J0IGZ1bmN0aW9uIGZsaXAoZikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGYoYXJnc1sxXSwgYXJnc1swXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBmKGEpKGFyZ3NbMF0pOyB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmxvdyhhYiwgYmMsIGNkLCBkZSwgZWYsIGZnLCBnaCwgaGksIGlqKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBhYjtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmMoYWIuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWYoZGUoY2QoYmMoYWIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmZyhlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnaChmZyhlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKSkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGkoZ2goZmcoZWYoZGUoY2QoYmMoYWIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkpKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpaihoaShnaChmZyhlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm47XG59XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgZnVuY3Rpb24gdHVwbGUoKSB7XG4gICAgdmFyIHQgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICB0W19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiB0O1xufVxuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluY3JlbWVudChuKSB7XG4gICAgcmV0dXJuIG4gKyAxO1xufVxuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY3JlbWVudChuKSB7XG4gICAgcmV0dXJuIG4gLSAxO1xufVxuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFic3VyZChfKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsZWQgYGFic3VyZGAgZnVuY3Rpb24gd2hpY2ggc2hvdWxkIGJlIHVuY2FsbGFibGUnKTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIHR1cGxlZCB2ZXJzaW9uIG9mIHRoaXMgZnVuY3Rpb246IGluc3RlYWQgb2YgYG5gIGFyZ3VtZW50cywgaXQgYWNjZXB0cyBhIHNpbmdsZSB0dXBsZSBhcmd1bWVudC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgdHVwbGVkIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogY29uc3QgYWRkID0gdHVwbGVkKCh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciA9PiB4ICsgeSlcbiAqXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoYWRkKFsxLCAyXSksIDMpXG4gKlxuICogQHNpbmNlIDIuNC4wXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0dXBsZWQoZikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZi5hcHBseSh2b2lkIDAsIGEpOyB9O1xufVxuLyoqXG4gKiBJbnZlcnNlIGZ1bmN0aW9uIG9mIGB0dXBsZWRgXG4gKlxuICogQHNpbmNlIDIuNC4wXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bnR1cGxlZChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZihhKTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBpcGUoYSwgYWIsIGJjLCBjZCwgZGUsIGVmLCBmZywgZ2gsIGhpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gYWIoYSk7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBiYyhhYihhKSk7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBjZChiYyhhYihhKSkpO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gZGUoY2QoYmMoYWIoYSkpKSk7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiBlZihkZShjZChiYyhhYihhKSkpKSk7XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiBmZyhlZihkZShjZChiYyhhYihhKSkpKSkpO1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSk7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSk7XG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIHZhciByZXQgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJldCA9IGFyZ3VtZW50c1tpXShyZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogVHlwZSBob2xlIHNpbXVsYXRpb25cbiAqXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBob2xlID0gYWJzdXJkO1xuLyoqXG4gKiBAc2luY2UgMi4xMS4wXG4gKi9cbmV4cG9ydCB2YXIgU0sgPSBmdW5jdGlvbiAoXywgYikgeyByZXR1cm4gYjsgfTtcbi8qKlxuICogVXNlIGBQcmVkaWNhdGVgIG1vZHVsZSBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3QocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiAhcHJlZGljYXRlKGEpOyB9O1xufVxuLyoqXG4gKiBVc2UgYEVuZG9tb3JwaGlzbWAgbW9kdWxlIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjEwLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZ2V0RW5kb21vcnBoaXNtTW9ub2lkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICBjb25jYXQ6IGZ1bmN0aW9uIChmaXJzdCwgc2Vjb25kKSB7IHJldHVybiBmbG93KGZpcnN0LCBzZWNvbmQpOyB9LFxuICAgIGVtcHR5OiBpZGVudGl0eVxufSk7IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGR1YWwgPSBmdW5jdGlvbiAoYXJpdHksIGJvZHkpIHtcbiAgICB2YXIgaXNEYXRhRmlyc3QgPSB0eXBlb2YgYXJpdHkgPT09ICdudW1iZXInID8gZnVuY3Rpb24gKGFyZ3MpIHsgcmV0dXJuIGFyZ3MubGVuZ3RoID49IGFyaXR5OyB9IDogYXJpdHk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgICAgIGlmIChpc0RhdGFGaXJzdChhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gYm9keS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGYpIHsgcmV0dXJuIGJvZHkuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtzZWxmXSwgYXJncywgZmFsc2UpKTsgfTtcbiAgICB9O1xufTtcbiIsInZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbmltcG9ydCB7IGR1YWwgfSBmcm9tICcuL2Z1bmN0aW9uJztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wdGlvblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBpc05vbmUgPSBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIGZhLl90YWcgPT09ICdOb25lJzsgfTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgaXNTb21lID0gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBmYS5fdGFnID09PSAnU29tZSc7IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIG5vbmUgPSB7IF90YWc6ICdOb25lJyB9O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBzb21lID0gZnVuY3Rpb24gKGEpIHsgcmV0dXJuICh7IF90YWc6ICdTb21lJywgdmFsdWU6IGEgfSk7IH07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFaXRoZXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgaXNMZWZ0ID0gZnVuY3Rpb24gKG1hKSB7IHJldHVybiBtYS5fdGFnID09PSAnTGVmdCc7IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGlzUmlnaHQgPSBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIG1hLl90YWcgPT09ICdSaWdodCc7IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGxlZnQgPSBmdW5jdGlvbiAoZSkgeyByZXR1cm4gKHsgX3RhZzogJ0xlZnQnLCBsZWZ0OiBlIH0pOyB9O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciByaWdodCA9IGZ1bmN0aW9uIChhKSB7IHJldHVybiAoeyBfdGFnOiAnUmlnaHQnLCByaWdodDogYSB9KTsgfTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJlYWRvbmx5Tm9uRW1wdHlBcnJheVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBzaW5nbGV0b24gPSBmdW5jdGlvbiAoYSkgeyByZXR1cm4gW2FdOyB9O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBpc05vbkVtcHR5ID0gZnVuY3Rpb24gKGFzKSB7IHJldHVybiBhcy5sZW5ndGggPiAwOyB9O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBoZWFkID0gZnVuY3Rpb24gKGFzKSB7IHJldHVybiBhc1swXTsgfTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgdGFpbCA9IGZ1bmN0aW9uIChhcykgeyByZXR1cm4gYXMuc2xpY2UoMSk7IH07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBlbXB0eVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBlbXB0eVJlYWRvbmx5QXJyYXkgPSBbXTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgZW1wdHlSZWNvcmQgPSB7fTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJlY29yZFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTm9uRW1wdHlBcnJheVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBmcm9tUmVhZG9ubHlOb25FbXB0eUFycmF5ID0gZnVuY3Rpb24gKGFzKSB7IHJldHVybiBfX3NwcmVhZEFycmF5KFthc1swXV0sIGFzLnNsaWNlKDEpLCB0cnVlKTsgfTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgbGlmdE51bGxhYmxlID0gZnVuY3Rpb24gKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYsIG9uTnVsbGFibGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIGFbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBvID0gZi5hcHBseSh2b2lkIDAsIGEpO1xuICAgICAgICAgICAgcmV0dXJuIEYuZnJvbUVpdGhlcihvID09IG51bGwgPyBsZWZ0KG9uTnVsbGFibGUuYXBwbHkodm9pZCAwLCBhKSkgOiByaWdodChvKSk7XG4gICAgICAgIH07XG4gICAgfTtcbn07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGxpZnRPcHRpb24gPSBmdW5jdGlvbiAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZiwgb25Ob25lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBhW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbyA9IGYuYXBwbHkodm9pZCAwLCBhKTtcbiAgICAgICAgICAgIHJldHVybiBGLmZyb21FaXRoZXIoaXNOb25lKG8pID8gbGVmdChvbk5vbmUuYXBwbHkodm9pZCAwLCBhKSkgOiByaWdodChvLnZhbHVlKSk7XG4gICAgICAgIH07XG4gICAgfTtcbn07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGZsYXRNYXBOdWxsYWJsZSA9IGZ1bmN0aW9uIChGLCBNKSB7XG4gICAgcmV0dXJuIC8qI19fUFVSRV9fKi8gZHVhbCgzLCBmdW5jdGlvbiAoc2VsZiwgZiwgb25OdWxsYWJsZSkge1xuICAgICAgICByZXR1cm4gTS5mbGF0TWFwKHNlbGYsIGxpZnROdWxsYWJsZShGKShmLCBvbk51bGxhYmxlKSk7XG4gICAgfSk7XG59O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBmbGF0TWFwT3B0aW9uID0gZnVuY3Rpb24gKEYsIE0pIHtcbiAgICByZXR1cm4gLyojX19QVVJFX18qLyBkdWFsKDMsIGZ1bmN0aW9uIChzZWxmLCBmLCBvbk5vbmUpIHsgcmV0dXJuIE0uZmxhdE1hcChzZWxmLCBsaWZ0T3B0aW9uKEYpKGYsIG9uTm9uZSkpOyB9KTtcbn07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGZsYXRNYXBFaXRoZXIgPSBmdW5jdGlvbiAoRiwgTSkge1xuICAgIHJldHVybiAvKiNfX1BVUkVfXyovIGR1YWwoMiwgZnVuY3Rpb24gKHNlbGYsIGYpIHtcbiAgICAgICAgcmV0dXJuIE0uZmxhdE1hcChzZWxmLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gRi5mcm9tRWl0aGVyKGYoYSkpOyB9KTtcbiAgICB9KTtcbn07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGZsYXRNYXBJTyA9IGZ1bmN0aW9uIChGLCBNKSB7XG4gICAgcmV0dXJuIC8qI19fUFVSRV9fKi8gZHVhbCgyLCBmdW5jdGlvbiAoc2VsZiwgZikge1xuICAgICAgICByZXR1cm4gTS5mbGF0TWFwKHNlbGYsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBGLmZyb21JTyhmKGEpKTsgfSk7XG4gICAgfSk7XG59O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBmbGF0TWFwVGFzayA9IGZ1bmN0aW9uIChGLCBNKSB7XG4gICAgcmV0dXJuIC8qI19fUFVSRV9fKi8gZHVhbCgyLCBmdW5jdGlvbiAoc2VsZiwgZikge1xuICAgICAgICByZXR1cm4gTS5mbGF0TWFwKHNlbGYsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBGLmZyb21UYXNrKGYoYSkpOyB9KTtcbiAgICB9KTtcbn07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGZsYXRNYXBSZWFkZXIgPSBmdW5jdGlvbiAoRiwgTSkge1xuICAgIHJldHVybiAvKiNfX1BVUkVfXyovIGR1YWwoMiwgZnVuY3Rpb24gKHNlbGYsIGYpIHtcbiAgICAgICAgcmV0dXJuIE0uZmxhdE1hcChzZWxmLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gRi5mcm9tUmVhZGVyKGYoYSkpOyB9KTtcbiAgICB9KTtcbn07XG4iLCJpbXBvcnQgeyBhcEZpcnN0IGFzIGFwRmlyc3RfLCBhcFNlY29uZCBhcyBhcFNlY29uZF8gfSBmcm9tICcuL0FwcGx5JztcbmltcG9ydCB7IGNoYWluRmlyc3QgYXMgY2hhaW5GaXJzdF8gfSBmcm9tICcuL0NoYWluJztcbmltcG9ydCB7IGlkZW50aXR5LCBwaXBlIGFzIHBpcGVGcm9tRnVuY3Rpb25Nb2R1bGUgfSBmcm9tICcuL2Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBtYXAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLm1hcChmYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gY29udHJhbWFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5jb250cmFtYXAoZmEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIG1hcFdpdGhJbmRleChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYubWFwV2l0aEluZGV4KGZhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhcChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gZnVuY3Rpb24gKGZhYikgeyByZXR1cm4gRi5hcChmYWIsIGZhKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjaGFpbihGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYuY2hhaW4oZmEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGJpbWFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYsIGcpIHsgcmV0dXJuIGZ1bmN0aW9uIChmZWEpIHsgcmV0dXJuIEYuYmltYXAoZmVhLCBmLCBnKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtYXBMZWZ0KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmZWEpIHsgcmV0dXJuIEYubWFwTGVmdChmZWEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAod2EpIHsgcmV0dXJuIEYuZXh0ZW5kKHdhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2UoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYiwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLnJlZHVjZShmYSwgYiwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZm9sZE1hcChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChNKSB7XG4gICAgICAgIHZhciBmb2xkTWFwTSA9IEYuZm9sZE1hcChNKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIGZvbGRNYXBNKGZhLCBmKTsgfTsgfTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGIsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5yZWR1Y2VSaWdodChmYSwgYiwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlV2l0aEluZGV4KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGIsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5yZWR1Y2VXaXRoSW5kZXgoZmEsIGIsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvbGRNYXBXaXRoSW5kZXgoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoTSkge1xuICAgICAgICB2YXIgZm9sZE1hcFdpdGhJbmRleE0gPSBGLmZvbGRNYXBXaXRoSW5kZXgoTSk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBmb2xkTWFwV2l0aEluZGV4TShmYSwgZik7IH07IH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VSaWdodFdpdGhJbmRleChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChiLCBmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYucmVkdWNlUmlnaHRXaXRoSW5kZXgoZmEsIGIsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFsdChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0KSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYuYWx0KGZhLCB0aGF0KTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXIoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAocHJlZGljYXRlKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYuZmlsdGVyKGZhLCBwcmVkaWNhdGUpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlck1hcChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYuZmlsdGVyTWFwKGZhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aXRpb24oRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLnBhcnRpdGlvbihmYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gcGFydGl0aW9uTWFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5wYXJ0aXRpb25NYXAoZmEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlcldpdGhJbmRleChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwcmVkaWNhdGUpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5maWx0ZXJXaXRoSW5kZXgoZmEsIHByZWRpY2F0ZSk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyTWFwV2l0aEluZGV4KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5maWx0ZXJNYXBXaXRoSW5kZXgoZmEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpdGlvbldpdGhJbmRleChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYucGFydGl0aW9uV2l0aEluZGV4KGZhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aXRpb25NYXBXaXRoSW5kZXgoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLnBhcnRpdGlvbk1hcFdpdGhJbmRleChmYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gcHJvbWFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYsIGcpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYmMpIHsgcmV0dXJuIEYucHJvbWFwKGZiYywgZiwgZyk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZShGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlYSkgeyByZXR1cm4gZnVuY3Rpb24gKGFiKSB7IHJldHVybiBGLmNvbXBvc2UoYWIsIGVhKTsgfTsgfTtcbn1cbnZhciBpc0Z1bmN0b3IgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkubWFwID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzQ29udHJhdmFyaWFudCA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5jb250cmFtYXAgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNGdW5jdG9yV2l0aEluZGV4ID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLm1hcFdpdGhJbmRleCA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0FwcGx5ID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLmFwID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzQ2hhaW4gPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkuY2hhaW4gPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNCaWZ1bmN0b3IgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkuYmltYXAgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNFeHRlbmQgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkuZXh0ZW5kID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzRm9sZGFibGUgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkucmVkdWNlID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzRm9sZGFibGVXaXRoSW5kZXggPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkucmVkdWNlV2l0aEluZGV4ID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzQWx0ID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLmFsdCA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0NvbXBhY3RhYmxlID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLmNvbXBhY3QgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNGaWx0ZXJhYmxlID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLmZpbHRlciA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0ZpbHRlcmFibGVXaXRoSW5kZXggPSBmdW5jdGlvbiAoSSkge1xuICAgIHJldHVybiB0eXBlb2YgSS5maWx0ZXJXaXRoSW5kZXggPT09ICdmdW5jdGlvbic7XG59O1xudmFyIGlzUHJvZnVuY3RvciA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5wcm9tYXAgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNTZW1pZ3JvdXBvaWQgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkuY29tcG9zZSA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc01vbmFkVGhyb3cgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkudGhyb3dFcnJvciA9PT0gJ2Z1bmN0aW9uJzsgfTtcbi8qKiBAZGVwcmVjYXRlZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGVhYmxlKEkpIHtcbiAgICB2YXIgciA9IHt9O1xuICAgIGlmIChpc0Z1bmN0b3IoSSkpIHtcbiAgICAgICAgci5tYXAgPSBtYXAoSSk7XG4gICAgfVxuICAgIGlmIChpc0NvbnRyYXZhcmlhbnQoSSkpIHtcbiAgICAgICAgci5jb250cmFtYXAgPSBjb250cmFtYXAoSSk7XG4gICAgfVxuICAgIGlmIChpc0Z1bmN0b3JXaXRoSW5kZXgoSSkpIHtcbiAgICAgICAgci5tYXBXaXRoSW5kZXggPSBtYXBXaXRoSW5kZXgoSSk7XG4gICAgfVxuICAgIGlmIChpc0FwcGx5KEkpKSB7XG4gICAgICAgIHIuYXAgPSBhcChJKTtcbiAgICAgICAgci5hcEZpcnN0ID0gYXBGaXJzdF8oSSk7XG4gICAgICAgIHIuYXBTZWNvbmQgPSBhcFNlY29uZF8oSSk7XG4gICAgfVxuICAgIGlmIChpc0NoYWluKEkpKSB7XG4gICAgICAgIHIuY2hhaW4gPSBjaGFpbihJKTtcbiAgICAgICAgci5jaGFpbkZpcnN0ID0gY2hhaW5GaXJzdF8oSSk7XG4gICAgICAgIHIuZmxhdHRlbiA9IHIuY2hhaW4oaWRlbnRpdHkpO1xuICAgIH1cbiAgICBpZiAoaXNCaWZ1bmN0b3IoSSkpIHtcbiAgICAgICAgci5iaW1hcCA9IGJpbWFwKEkpO1xuICAgICAgICByLm1hcExlZnQgPSBtYXBMZWZ0KEkpO1xuICAgIH1cbiAgICBpZiAoaXNFeHRlbmQoSSkpIHtcbiAgICAgICAgci5leHRlbmQgPSBleHRlbmQoSSk7XG4gICAgICAgIHIuZHVwbGljYXRlID0gci5leHRlbmQoaWRlbnRpdHkpO1xuICAgIH1cbiAgICBpZiAoaXNGb2xkYWJsZShJKSkge1xuICAgICAgICByLnJlZHVjZSA9IHJlZHVjZShJKTtcbiAgICAgICAgci5mb2xkTWFwID0gZm9sZE1hcChJKTtcbiAgICAgICAgci5yZWR1Y2VSaWdodCA9IHJlZHVjZVJpZ2h0KEkpO1xuICAgIH1cbiAgICBpZiAoaXNGb2xkYWJsZVdpdGhJbmRleChJKSkge1xuICAgICAgICByLnJlZHVjZVdpdGhJbmRleCA9IHJlZHVjZVdpdGhJbmRleChJKTtcbiAgICAgICAgci5mb2xkTWFwV2l0aEluZGV4ID0gZm9sZE1hcFdpdGhJbmRleChJKTtcbiAgICAgICAgci5yZWR1Y2VSaWdodFdpdGhJbmRleCA9IHJlZHVjZVJpZ2h0V2l0aEluZGV4KEkpO1xuICAgIH1cbiAgICBpZiAoaXNBbHQoSSkpIHtcbiAgICAgICAgci5hbHQgPSBhbHQoSSk7XG4gICAgfVxuICAgIGlmIChpc0NvbXBhY3RhYmxlKEkpKSB7XG4gICAgICAgIHIuY29tcGFjdCA9IEkuY29tcGFjdDtcbiAgICAgICAgci5zZXBhcmF0ZSA9IEkuc2VwYXJhdGU7XG4gICAgfVxuICAgIGlmIChpc0ZpbHRlcmFibGUoSSkpIHtcbiAgICAgICAgci5maWx0ZXIgPSBmaWx0ZXIoSSk7XG4gICAgICAgIHIuZmlsdGVyTWFwID0gZmlsdGVyTWFwKEkpO1xuICAgICAgICByLnBhcnRpdGlvbiA9IHBhcnRpdGlvbihJKTtcbiAgICAgICAgci5wYXJ0aXRpb25NYXAgPSBwYXJ0aXRpb25NYXAoSSk7XG4gICAgfVxuICAgIGlmIChpc0ZpbHRlcmFibGVXaXRoSW5kZXgoSSkpIHtcbiAgICAgICAgci5maWx0ZXJXaXRoSW5kZXggPSBmaWx0ZXJXaXRoSW5kZXgoSSk7XG4gICAgICAgIHIuZmlsdGVyTWFwV2l0aEluZGV4ID0gZmlsdGVyTWFwV2l0aEluZGV4KEkpO1xuICAgICAgICByLnBhcnRpdGlvbldpdGhJbmRleCA9IHBhcnRpdGlvbldpdGhJbmRleChJKTtcbiAgICAgICAgci5wYXJ0aXRpb25NYXBXaXRoSW5kZXggPSBwYXJ0aXRpb25NYXBXaXRoSW5kZXgoSSk7XG4gICAgfVxuICAgIGlmIChpc1Byb2Z1bmN0b3IoSSkpIHtcbiAgICAgICAgci5wcm9tYXAgPSBwcm9tYXAoSSk7XG4gICAgfVxuICAgIGlmIChpc1NlbWlncm91cG9pZChJKSkge1xuICAgICAgICByLmNvbXBvc2UgPSBjb21wb3NlKEkpO1xuICAgIH1cbiAgICBpZiAoaXNNb25hZFRocm93KEkpKSB7XG4gICAgICAgIHZhciBmcm9tT3B0aW9uID0gZnVuY3Rpb24gKG9uTm9uZSkgeyByZXR1cm4gZnVuY3Rpb24gKG1hKSB7XG4gICAgICAgICAgICByZXR1cm4gbWEuX3RhZyA9PT0gJ05vbmUnID8gSS50aHJvd0Vycm9yKG9uTm9uZSgpKSA6IEkub2YobWEudmFsdWUpO1xuICAgICAgICB9OyB9O1xuICAgICAgICB2YXIgZnJvbUVpdGhlciA9IGZ1bmN0aW9uIChtYSkge1xuICAgICAgICAgICAgcmV0dXJuIG1hLl90YWcgPT09ICdMZWZ0JyA/IEkudGhyb3dFcnJvcihtYS5sZWZ0KSA6IEkub2YobWEucmlnaHQpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZnJvbVByZWRpY2F0ZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUsIG9uRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVkaWNhdGUoYSkgPyBJLm9mKGEpIDogSS50aHJvd0Vycm9yKG9uRmFsc2UoYSkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGZpbHRlck9yRWxzZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUsIG9uRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSS5jaGFpbihtYSwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIChwcmVkaWNhdGUoYSkgPyBJLm9mKGEpIDogSS50aHJvd0Vycm9yKG9uRmFsc2UoYSkpKTsgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICByLmZyb21PcHRpb24gPSBmcm9tT3B0aW9uO1xuICAgICAgICByLmZyb21FaXRoZXIgPSBmcm9tRWl0aGVyO1xuICAgICAgICByLmZyb21QcmVkaWNhdGUgPSBmcm9tUHJlZGljYXRlO1xuICAgICAgICByLmZpbHRlck9yRWxzZSA9IGZpbHRlck9yRWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHI7XG59XG4vKipcbiAqIFVzZSBbYHBpcGVgXShodHRwczovL2djYW50aS5naXRodWIuaW8vZnAtdHMvbW9kdWxlcy9mdW5jdGlvbi50cy5odG1sI3BpcGUpIGZyb20gYGZ1bmN0aW9uYCBtb2R1bGUgaW5zdGVhZC5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgcGlwZSA9IHBpcGVGcm9tRnVuY3Rpb25Nb2R1bGU7XG4iLCJpbXBvcnQgKiBhcyBGUyBmcm9tICcuL0ZyZWVTZW1pZ3JvdXAnO1xuLyoqXG4gKiBAY2F0ZWdvcnkgbW9kZWxcbiAqIEBzaW5jZSAyLjIuN1xuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3ByZWZlci1hcy1jb25zdFxuZXhwb3J0IHZhciByZXF1aXJlZCA9ICdyZXF1aXJlZCc7XG4vKipcbiAqIEBjYXRlZ29yeSBtb2RlbFxuICogQHNpbmNlIDIuMi43XG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLWFzLWNvbnN0XG5leHBvcnQgdmFyIG9wdGlvbmFsID0gJ29wdGlvbmFsJztcbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgbGVhZiA9IGZ1bmN0aW9uIChhY3R1YWwsIGVycm9yKSB7IHJldHVybiAoeyBfdGFnOiAnTGVhZicsIGFjdHVhbDogYWN0dWFsLCBlcnJvcjogZXJyb3IgfSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGtleSA9IGZ1bmN0aW9uIChrZXksIGtpbmQsIGVycm9ycykgeyByZXR1cm4gKHtcbiAgICBfdGFnOiAnS2V5JyxcbiAgICBrZXk6IGtleSxcbiAgICBraW5kOiBraW5kLFxuICAgIGVycm9yczogZXJyb3JzXG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgaW5kZXggPSBmdW5jdGlvbiAoaW5kZXgsIGtpbmQsIGVycm9ycykgeyByZXR1cm4gKHtcbiAgICBfdGFnOiAnSW5kZXgnLFxuICAgIGluZGV4OiBpbmRleCxcbiAgICBraW5kOiBraW5kLFxuICAgIGVycm9yczogZXJyb3JzXG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgbWVtYmVyID0gZnVuY3Rpb24gKGluZGV4LCBlcnJvcnMpIHsgcmV0dXJuICh7XG4gICAgX3RhZzogJ01lbWJlcicsXG4gICAgaW5kZXg6IGluZGV4LFxuICAgIGVycm9yczogZXJyb3JzXG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgbGF6eSA9IGZ1bmN0aW9uIChpZCwgZXJyb3JzKSB7IHJldHVybiAoe1xuICAgIF90YWc6ICdMYXp5JyxcbiAgICBpZDogaWQsXG4gICAgZXJyb3JzOiBlcnJvcnNcbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjlcbiAqL1xuZXhwb3J0IHZhciB3cmFwID0gZnVuY3Rpb24gKGVycm9yLCBlcnJvcnMpIHsgcmV0dXJuICh7XG4gICAgX3RhZzogJ1dyYXAnLFxuICAgIGVycm9yOiBlcnJvcixcbiAgICBlcnJvcnM6IGVycm9yc1xufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBkZXN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgZm9sZCA9IGZ1bmN0aW9uIChwYXR0ZXJucykge1xuICAgIHZhciBmID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgc3dpdGNoIChlLl90YWcpIHtcbiAgICAgICAgICAgIGNhc2UgJ0xlYWYnOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXR0ZXJucy5MZWFmKGUuYWN0dWFsLCBlLmVycm9yKTtcbiAgICAgICAgICAgIGNhc2UgJ0tleSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm5zLktleShlLmtleSwgZS5raW5kLCBlLmVycm9ycyk7XG4gICAgICAgICAgICBjYXNlICdJbmRleCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm5zLkluZGV4KGUuaW5kZXgsIGUua2luZCwgZS5lcnJvcnMpO1xuICAgICAgICAgICAgY2FzZSAnTWVtYmVyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0dGVybnMuTWVtYmVyKGUuaW5kZXgsIGUuZXJyb3JzKTtcbiAgICAgICAgICAgIGNhc2UgJ0xhenknOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXR0ZXJucy5MYXp5KGUuaWQsIGUuZXJyb3JzKTtcbiAgICAgICAgICAgIGNhc2UgJ1dyYXAnOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXR0ZXJucy5XcmFwKGUuZXJyb3IsIGUuZXJyb3JzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGY7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbWlncm91cCgpIHtcbiAgICByZXR1cm4gRlMuZ2V0U2VtaWdyb3VwKCk7XG59XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL2VzNi9FaXRoZXInO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICdmcC10cy9lczYvZnVuY3Rpb24nO1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2VzNi9waXBlYWJsZSc7XG5pbXBvcnQgKiBhcyBERSBmcm9tICcuL0RlY29kZUVycm9yJztcbmltcG9ydCAqIGFzIEZTIGZyb20gJy4vRnJlZVNlbWlncm91cCc7XG5pbXBvcnQgKiBhcyBHIGZyb20gJy4vR3VhcmQnO1xuaW1wb3J0ICogYXMgSyBmcm9tICcuL0tsZWlzbGknO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gS2xlaXNsaSBjb25maWdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCB2YXIgU0UgPSBcbi8qI19fUFVSRV9fKi9cbkRFLmdldFNlbWlncm91cCgpO1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IHZhciBhcCA9IGZ1bmN0aW9uIChmYWIsIGZhKSB7XG4gICAgcmV0dXJuIEUuaXNMZWZ0KGZhYilcbiAgICAgICAgPyBFLmlzTGVmdChmYSlcbiAgICAgICAgICAgID8gRS5sZWZ0KFNFLmNvbmNhdChmYWIubGVmdCwgZmEubGVmdCkpXG4gICAgICAgICAgICA6IGZhYlxuICAgICAgICA6IEUuaXNMZWZ0KGZhKVxuICAgICAgICAgICAgPyBmYVxuICAgICAgICAgICAgOiBFLnJpZ2h0KGZhYi5yaWdodChmYS5yaWdodCkpO1xufTtcbnZhciBNID0ge1xuICAgIFVSSTogRS5VUkksXG4gICAgX0U6IHVuZGVmaW5lZCxcbiAgICBtYXA6IGZ1bmN0aW9uIChmYSwgZikgeyByZXR1cm4gcGlwZShmYSwgRS5tYXAoZikpOyB9LFxuICAgIGFwOiBhcCxcbiAgICBvZjogRS5yaWdodCxcbiAgICBjaGFpbjogZnVuY3Rpb24gKG1hLCBmKSB7IHJldHVybiBwaXBlKG1hLCBFLmNoYWluKGYpKTsgfSxcbiAgICB0aHJvd0Vycm9yOiBFLmxlZnQsXG4gICAgYmltYXA6IGZ1bmN0aW9uIChmYSwgZiwgZykgeyByZXR1cm4gcGlwZShmYSwgRS5iaW1hcChmLCBnKSk7IH0sXG4gICAgbWFwTGVmdDogZnVuY3Rpb24gKGZhLCBmKSB7IHJldHVybiBwaXBlKGZhLCBFLm1hcExlZnQoZikpOyB9LFxuICAgIGFsdDogZnVuY3Rpb24gKG1lLCB0aGF0KSB7XG4gICAgICAgIGlmIChFLmlzUmlnaHQobWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVhID0gdGhhdCgpO1xuICAgICAgICByZXR1cm4gRS5pc0xlZnQoZWEpID8gRS5sZWZ0KFNFLmNvbmNhdChtZS5sZWZ0LCBlYS5sZWZ0KSkgOiBlYTtcbiAgICB9XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgRGVjb2RlRXJyb3JcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGVycm9yID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkgeyByZXR1cm4gRlMub2YoREUubGVhZihhY3R1YWwsIG1lc3NhZ2UpKTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IERlY29kZUVycm9yXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBzdWNjZXNzID0gRS5yaWdodDtcbi8qKlxuICogQGNhdGVnb3J5IERlY29kZUVycm9yXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBmYWlsdXJlID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIHJldHVybiBFLmxlZnQoZXJyb3IoYWN0dWFsLCBtZXNzYWdlKSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gY29uc3RydWN0b3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGZyb21SZWZpbmVtZW50ID0gZnVuY3Rpb24gKHJlZmluZW1lbnQsIGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIEsuZnJvbVJlZmluZW1lbnQoTSkocmVmaW5lbWVudCwgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIGVycm9yKHUsIGV4cGVjdGVkKTsgfSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBmcm9tR3VhcmQgPSBmdW5jdGlvbiAoZ3VhcmQsIGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZyb21SZWZpbmVtZW50KGd1YXJkLmlzLCBleHBlY3RlZCk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBsaXRlcmFsID0gXG4vKiNfX1BVUkVfXyovXG5LLmxpdGVyYWwoTSkoZnVuY3Rpb24gKHUsIHZhbHVlcykgeyByZXR1cm4gZXJyb3IodSwgdmFsdWVzLm1hcChmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKTsgfSkuam9pbignIHwgJykpOyB9KTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHByaW1pdGl2ZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIHN0cmluZyA9IFxuLyojX19QVVJFX18qL1xuZnJvbUd1YXJkKEcuc3RyaW5nLCAnc3RyaW5nJyk7XG4vKipcbiAqIEBjYXRlZ29yeSBwcmltaXRpdmVzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBudW1iZXIgPSBcbi8qI19fUFVSRV9fKi9cbmZyb21HdWFyZChHLm51bWJlciwgJ251bWJlcicpO1xuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgYm9vbGVhbiA9IFxuLyojX19QVVJFX18qL1xuZnJvbUd1YXJkKEcuYm9vbGVhbiwgJ2Jvb2xlYW4nKTtcbi8qKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIFVua25vd25BcnJheSA9IFxuLyojX19QVVJFX18qL1xuZnJvbUd1YXJkKEcuVW5rbm93bkFycmF5LCAnQXJyYXk8dW5rbm93bj4nKTtcbi8qKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIFVua25vd25SZWNvcmQgPSBcbi8qI19fUFVSRV9fKi9cbmZyb21HdWFyZChHLlVua25vd25SZWNvcmQsICdSZWNvcmQ8c3RyaW5nLCB1bmtub3duPicpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gY29tYmluYXRvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBtYXBMZWZ0V2l0aElucHV0ID0gXG4vKiNfX1BVUkVfXyovXG5LLm1hcExlZnRXaXRoSW5wdXQoTSk7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi45XG4gKi9cbmV4cG9ydCB2YXIgd2l0aE1lc3NhZ2UgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIHJldHVybiBtYXBMZWZ0V2l0aElucHV0KGZ1bmN0aW9uIChpbnB1dCwgZSkgeyByZXR1cm4gRlMub2YoREUud3JhcChtZXNzYWdlKGlucHV0LCBlKSwgZSkpOyB9KTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgcmVmaW5lID0gZnVuY3Rpb24gKHJlZmluZW1lbnQsIGlkKSB7IHJldHVybiBLLnJlZmluZShNKShyZWZpbmVtZW50LCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZXJyb3IoYSwgaWQpOyB9KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBwYXJzZSA9IFxuLyojX19QVVJFX18qL1xuSy5wYXJzZShNKTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBudWxsYWJsZSA9IFxuLyojX19QVVJFX18qL1xuSy5udWxsYWJsZShNKShmdW5jdGlvbiAodSwgZSkgeyByZXR1cm4gRlMuY29uY2F0KEZTLm9mKERFLm1lbWJlcigwLCBlcnJvcih1LCAnbnVsbCcpKSksIEZTLm9mKERFLm1lbWJlcigxLCBlKSkpOyB9KTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjE1XG4gKi9cbmV4cG9ydCB2YXIgZnJvbVN0cnVjdCA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgcmV0dXJuIEsuZnJvbVN0cnVjdChNKShmdW5jdGlvbiAoaywgZSkgeyByZXR1cm4gRlMub2YoREUua2V5KGssIERFLnJlcXVpcmVkLCBlKSk7IH0pKHByb3BlcnRpZXMpO1xufTtcbi8qKlxuICogVXNlIGBmcm9tU3RydWN0YCBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgdmFyIGZyb21UeXBlID0gZnJvbVN0cnVjdDtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjE1XG4gKi9cbmV4cG9ydCB2YXIgc3RydWN0ID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHsgcmV0dXJuIHBpcGUoVW5rbm93blJlY29yZCwgY29tcG9zZShmcm9tU3RydWN0KHByb3BlcnRpZXMpKSk7IH07XG4vKipcbiAqIFVzZSBgc3RydWN0YCBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgdmFyIHR5cGUgPSBzdHJ1Y3Q7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgZnJvbVBhcnRpYWwgPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xuICAgIHJldHVybiBLLmZyb21QYXJ0aWFsKE0pKGZ1bmN0aW9uIChrLCBlKSB7IHJldHVybiBGUy5vZihERS5rZXkoaywgREUub3B0aW9uYWwsIGUpKTsgfSkocHJvcGVydGllcyk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIHBhcnRpYWwgPSBmdW5jdGlvbiAocHJvcGVydGllcykgeyByZXR1cm4gcGlwZShVbmtub3duUmVjb3JkLCBjb21wb3NlKGZyb21QYXJ0aWFsKHByb3BlcnRpZXMpKSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgZnJvbUFycmF5ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gSy5mcm9tQXJyYXkoTSkoZnVuY3Rpb24gKGksIGUpIHsgcmV0dXJuIEZTLm9mKERFLmluZGV4KGksIERFLm9wdGlvbmFsLCBlKSk7IH0pKGl0ZW0pO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBhcnJheSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIHBpcGUoVW5rbm93bkFycmF5LCBjb21wb3NlKGZyb21BcnJheShpdGVtKSkpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBmcm9tUmVjb3JkID0gZnVuY3Rpb24gKGNvZG9tYWluKSB7XG4gICAgcmV0dXJuIEsuZnJvbVJlY29yZChNKShmdW5jdGlvbiAoaywgZSkgeyByZXR1cm4gRlMub2YoREUua2V5KGssIERFLm9wdGlvbmFsLCBlKSk7IH0pKGNvZG9tYWluKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgcmVjb3JkID0gZnVuY3Rpb24gKGNvZG9tYWluKSB7XG4gICAgcmV0dXJuIHBpcGUoVW5rbm93blJlY29yZCwgY29tcG9zZShmcm9tUmVjb3JkKGNvZG9tYWluKSkpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBmcm9tVHVwbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbXBvbmVudHMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBjb21wb25lbnRzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiBLLmZyb21UdXBsZShNKShmdW5jdGlvbiAoaSwgZSkgeyByZXR1cm4gRlMub2YoREUuaW5kZXgoaSwgREUucmVxdWlyZWQsIGUpKTsgfSkuYXBwbHkodm9pZCAwLCBjb21wb25lbnRzKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgdHVwbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbXBvbmVudHMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBjb21wb25lbnRzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiBwaXBlKFVua25vd25BcnJheSwgY29tcG9zZShmcm9tVHVwbGUuYXBwbHkodm9pZCAwLCBjb21wb25lbnRzKSkpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciB1bmlvbiA9IFxuLyojX19QVVJFX18qL1xuSy51bmlvbihNKShmdW5jdGlvbiAoaSwgZSkgeyByZXR1cm4gRlMub2YoREUubWVtYmVyKGksIGUpKTsgfSk7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgaW50ZXJzZWN0ID0gXG4vKiNfX1BVUkVfXyovXG5LLmludGVyc2VjdChNKTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBmcm9tU3VtID0gZnVuY3Rpb24gKHRhZykge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVtYmVycykge1xuICAgICAgICByZXR1cm4gSy5mcm9tU3VtKE0pKGZ1bmN0aW9uICh0YWcsIHZhbHVlLCBrZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gRlMub2YoREUua2V5KHRhZywgREUucmVxdWlyZWQsIGVycm9yKHZhbHVlLCBrZXlzLmxlbmd0aCA9PT0gMCA/ICduZXZlcicgOiBrZXlzLm1hcChmdW5jdGlvbiAoaykgeyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoayk7IH0pLmpvaW4oJyB8ICcpKSkpO1xuICAgICAgICB9KSh0YWcpKG1lbWJlcnMpO1xuICAgIH07XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIHN1bSA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG1lbWJlcnMpIHtcbiAgICAgICAgcmV0dXJuIHBpcGUoVW5rbm93blJlY29yZCwgY29tcG9zZShmcm9tU3VtKHRhZykobWVtYmVycykpKTtcbiAgICB9O1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBsYXp5ID0gXG4vKiNfX1BVUkVfXyovXG5LLmxhenkoTSkoZnVuY3Rpb24gKGlkLCBlKSB7IHJldHVybiBGUy5vZihERS5sYXp5KGlkLCBlKSk7IH0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMTVcbiAqL1xuZXhwb3J0IHZhciByZWFkb25seSA9IGlkZW50aXR5O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gbm9uLXBpcGVhYmxlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIG1hcF8gPSBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIG1hcChmKSk7IH07XG52YXIgYWx0XyA9IGZ1bmN0aW9uIChtZSwgdGhhdCkgeyByZXR1cm4gcGlwZShtZSwgYWx0KHRoYXQpKTsgfTtcbnZhciBjb21wb3NlXyA9IGZ1bmN0aW9uIChhYiwgbGEpIHsgcmV0dXJuIHBpcGUobGEsIGNvbXBvc2UoYWIpKTsgfTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHBpcGVhYmxlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgRnVuY3RvclxuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgbWFwID0gXG4vKiNfX1BVUkVfXyovXG5LLm1hcChNKTtcbi8qKlxuICogQGNhdGVnb3J5IEFsdFxuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgYWx0ID0gXG4vKiNfX1BVUkVfXyovXG5LLmFsdChNKTtcbi8qKlxuICogQGNhdGVnb3J5IFNlbWlncm91cG9pZFxuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgY29tcG9zZSA9IFxuLyojX19QVVJFX18qL1xuSy5jb21wb3NlKE0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgQ2F0ZWdvcnlcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGlkID0gXG4vKiNfX1BVUkVfXyovXG5LLmlkKE0pO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gaW5zdGFuY2VzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIFVSSSA9ICdpby10cy9EZWNvZGVyJztcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgRnVuY3RvciA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IG1hcF9cbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIEFsdCA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IG1hcF8sXG4gICAgYWx0OiBhbHRfXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBDYXRlZ29yeSA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBjb21wb3NlOiBjb21wb3NlXyxcbiAgICBpZDogaWRcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIFNjaGVtYWJsZSA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBsaXRlcmFsOiBsaXRlcmFsLFxuICAgIHN0cmluZzogc3RyaW5nLFxuICAgIG51bWJlcjogbnVtYmVyLFxuICAgIGJvb2xlYW46IGJvb2xlYW4sXG4gICAgbnVsbGFibGU6IG51bGxhYmxlLFxuICAgIHR5cGU6IHR5cGUsXG4gICAgc3RydWN0OiBzdHJ1Y3QsXG4gICAgcGFydGlhbDogcGFydGlhbCxcbiAgICByZWNvcmQ6IHJlY29yZCxcbiAgICBhcnJheTogYXJyYXksXG4gICAgdHVwbGU6IHR1cGxlLFxuICAgIGludGVyc2VjdDogaW50ZXJzZWN0LFxuICAgIHN1bTogc3VtLFxuICAgIGxhenk6IGxhenksXG4gICAgcmVhZG9ubHk6IHJlYWRvbmx5XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBXaXRoVW5rbm93bkNvbnRhaW5lcnMgPSB7XG4gICAgVW5rbm93bkFycmF5OiBVbmtub3duQXJyYXksXG4gICAgVW5rbm93blJlY29yZDogVW5rbm93blJlY29yZFxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgV2l0aFVuaW9uID0ge1xuICAgIHVuaW9uOiB1bmlvblxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgV2l0aFJlZmluZSA9IHtcbiAgICByZWZpbmU6IHJlZmluZVxufTtcbnZhciBlbXB0eSA9IFtdO1xudmFyIG1ha2UgPSBmdW5jdGlvbiAodmFsdWUsIGZvcmVzdCkge1xuICAgIGlmIChmb3Jlc3QgPT09IHZvaWQgMCkgeyBmb3Jlc3QgPSBlbXB0eTsgfVxuICAgIHJldHVybiAoe1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGZvcmVzdDogZm9yZXN0XG4gICAgfSk7XG59O1xudmFyIGRyYXdUcmVlID0gZnVuY3Rpb24gKHRyZWUpIHsgcmV0dXJuIHRyZWUudmFsdWUgKyBkcmF3Rm9yZXN0KCdcXG4nLCB0cmVlLmZvcmVzdCk7IH07XG52YXIgZHJhd0ZvcmVzdCA9IGZ1bmN0aW9uIChpbmRlbnRhdGlvbiwgZm9yZXN0KSB7XG4gICAgdmFyIHIgPSAnJztcbiAgICB2YXIgbGVuID0gZm9yZXN0Lmxlbmd0aDtcbiAgICB2YXIgdHJlZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHRyZWUgPSBmb3Jlc3RbaV07XG4gICAgICAgIHZhciBpc0xhc3QgPSBpID09PSBsZW4gLSAxO1xuICAgICAgICByICs9IGluZGVudGF0aW9uICsgKGlzTGFzdCA/ICfilJQnIDogJ+KUnCcpICsgJ+KUgCAnICsgdHJlZS52YWx1ZTtcbiAgICAgICAgciArPSBkcmF3Rm9yZXN0KGluZGVudGF0aW9uICsgKGxlbiA+IDEgJiYgIWlzTGFzdCA/ICfilIIgICcgOiAnICAgJyksIHRyZWUuZm9yZXN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHI7XG59O1xudmFyIHRvVHJlZSA9IERFLmZvbGQoe1xuICAgIExlYWY6IGZ1bmN0aW9uIChpbnB1dCwgZXJyb3IpIHsgcmV0dXJuIG1ha2UoXCJjYW5ub3QgZGVjb2RlIFwiLmNvbmNhdChKU09OLnN0cmluZ2lmeShpbnB1dCksIFwiLCBzaG91bGQgYmUgXCIpLmNvbmNhdChlcnJvcikpOyB9LFxuICAgIEtleTogZnVuY3Rpb24gKGtleSwga2luZCwgZXJyb3JzKSB7IHJldHVybiBtYWtlKFwiXCIuY29uY2F0KGtpbmQsIFwiIHByb3BlcnR5IFwiKS5jb25jYXQoSlNPTi5zdHJpbmdpZnkoa2V5KSksIHRvRm9yZXN0KGVycm9ycykpOyB9LFxuICAgIEluZGV4OiBmdW5jdGlvbiAoaW5kZXgsIGtpbmQsIGVycm9ycykgeyByZXR1cm4gbWFrZShcIlwiLmNvbmNhdChraW5kLCBcIiBpbmRleCBcIikuY29uY2F0KGluZGV4KSwgdG9Gb3Jlc3QoZXJyb3JzKSk7IH0sXG4gICAgTWVtYmVyOiBmdW5jdGlvbiAoaW5kZXgsIGVycm9ycykgeyByZXR1cm4gbWFrZShcIm1lbWJlciBcIi5jb25jYXQoaW5kZXgpLCB0b0ZvcmVzdChlcnJvcnMpKTsgfSxcbiAgICBMYXp5OiBmdW5jdGlvbiAoaWQsIGVycm9ycykgeyByZXR1cm4gbWFrZShcImxhenkgdHlwZSBcIi5jb25jYXQoaWQpLCB0b0ZvcmVzdChlcnJvcnMpKTsgfSxcbiAgICBXcmFwOiBmdW5jdGlvbiAoZXJyb3IsIGVycm9ycykgeyByZXR1cm4gbWFrZShlcnJvciwgdG9Gb3Jlc3QoZXJyb3JzKSk7IH1cbn0pO1xudmFyIHRvRm9yZXN0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICB2YXIgZm9jdXMgPSBlO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgc3dpdGNoIChmb2N1cy5fdGFnKSB7XG4gICAgICAgICAgICBjYXNlICdPZic6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaCh0b1RyZWUoZm9jdXMudmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRtcCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG1wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2N1cyA9IHRtcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0NvbmNhdCc6XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChmb2N1cy5yaWdodCk7XG4gICAgICAgICAgICAgICAgZm9jdXMgPSBmb2N1cy5sZWZ0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufTtcbi8qKlxuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgZHJhdyA9IGZ1bmN0aW9uIChlKSB7IHJldHVybiB0b0ZvcmVzdChlKS5tYXAoZHJhd1RyZWUpLmpvaW4oJ1xcbicpOyB9O1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IHZhciBzdHJpbmdpZnkgPSBcbi8qI19fUFVSRV9fKi9cbkUuZm9sZChkcmF3LCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYSwgbnVsbCwgMik7IH0pO1xuIiwiLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBvZiA9IGZ1bmN0aW9uIChhKSB7IHJldHVybiAoeyBfdGFnOiAnT2YnLCB2YWx1ZTogYSB9KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgY29uY2F0ID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiAoe1xuICAgIF90YWc6ICdDb25jYXQnLFxuICAgIGxlZnQ6IGxlZnQsXG4gICAgcmlnaHQ6IHJpZ2h0XG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGRlc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBmb2xkID0gZnVuY3Rpb24gKG9uT2YsIG9uQ29uY2F0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7XG4gICAgICAgIHN3aXRjaCAoZi5fdGFnKSB7XG4gICAgICAgICAgICBjYXNlICdPZic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9uT2YoZi52YWx1ZSk7XG4gICAgICAgICAgICBjYXNlICdDb25jYXQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBvbkNvbmNhdChmLmxlZnQsIGYucmlnaHQpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VtaWdyb3VwKCkge1xuICAgIHJldHVybiB7IGNvbmNhdDogY29uY2F0IH07XG59XG4iLCIvKipcbiAqICoqVGhpcyBtb2R1bGUgaXMgZXhwZXJpbWVudGFsKipcbiAqXG4gKiBFeHBlcmltZW50YWwgZmVhdHVyZXMgYXJlIHB1Ymxpc2hlZCBpbiBvcmRlciB0byBnZXQgZWFybHkgZmVlZGJhY2sgZnJvbSB0aGUgY29tbXVuaXR5LCBzZWUgdGhlc2UgdHJhY2tpbmdcbiAqIFtpc3N1ZXNdKGh0dHBzOi8vZ2l0aHViLmNvbS9nY2FudGkvaW8tdHMvaXNzdWVzP3E9bGFiZWwlM0F2Mi4yKykgZm9yIGZ1cnRoZXIgZGlzY3Vzc2lvbnMgYW5kIGVuaGFuY2VtZW50cy5cbiAqXG4gKiBBIGZlYXR1cmUgdGFnZ2VkIGFzIF9FeHBlcmltZW50YWxfIGlzIGluIGEgaGlnaCBzdGF0ZSBvZiBmbHV4LCB5b3UncmUgYXQgcmlzayBvZiBpdCBjaGFuZ2luZyB3aXRob3V0IG5vdGljZS5cbiAqXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICdmcC10cy9lczYvZnVuY3Rpb24nO1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2VzNi9waXBlYWJsZSc7XG5pbXBvcnQgKiBhcyBTIGZyb20gJy4vU2NoZW1hYmxlJztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbnN0cnVjdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciBsaXRlcmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YWx1ZXNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuICh7XG4gICAgICAgIGlzOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gdmFsdWVzLmZpbmRJbmRleChmdW5jdGlvbiAoYSkgeyByZXR1cm4gYSA9PT0gdTsgfSkgIT09IC0xOyB9XG4gICAgfSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcHJpbWl0aXZlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgc3RyaW5nID0ge1xuICAgIGlzOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gdHlwZW9mIHUgPT09ICdzdHJpbmcnOyB9XG59O1xuLyoqXG4gKiBOb3RlOiBgTmFOYCBpcyBleGNsdWRlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgbnVtYmVyID0ge1xuICAgIGlzOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gdHlwZW9mIHUgPT09ICdudW1iZXInICYmICFpc05hTih1KTsgfVxufTtcbi8qKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIGJvb2xlYW4gPSB7XG4gICAgaXM6IGZ1bmN0aW9uICh1KSB7IHJldHVybiB0eXBlb2YgdSA9PT0gJ2Jvb2xlYW4nOyB9XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgVW5rbm93bkFycmF5ID0ge1xuICAgIGlzOiBBcnJheS5pc0FycmF5XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgVW5rbm93blJlY29yZCA9IHtcbiAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHUgIT09IG51bGwgJiYgdHlwZW9mIHUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHUpOyB9XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gY29tYmluYXRvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciByZWZpbmUgPSBmdW5jdGlvbiAocmVmaW5lbWVudCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZnJvbSkgeyByZXR1cm4gKHtcbiAgICAgICAgaXM6IGZ1bmN0aW9uIChpKSB7IHJldHVybiBmcm9tLmlzKGkpICYmIHJlZmluZW1lbnQoaSk7IH1cbiAgICB9KTsgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgbnVsbGFibGUgPSBmdW5jdGlvbiAob3IpIHsgcmV0dXJuICh7XG4gICAgaXM6IGZ1bmN0aW9uIChpKSB7IHJldHVybiBpID09PSBudWxsIHx8IG9yLmlzKGkpOyB9XG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjE1XG4gKi9cbmV4cG9ydCB2YXIgc3RydWN0ID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICByZXR1cm4gcGlwZShVbmtub3duUmVjb3JkLCByZWZpbmUoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgZm9yICh2YXIgayBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAoIShrIGluIHIpIHx8ICFwcm9wZXJ0aWVzW2tdLmlzKHJba10pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pKTtcbn07XG4vKipcbiAqIFVzZSBgc3RydWN0YCBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgdmFyIHR5cGUgPSBzdHJ1Y3Q7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgcGFydGlhbCA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgcmV0dXJuIHBpcGUoVW5rbm93blJlY29yZCwgcmVmaW5lKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIGZvciAodmFyIGsgaW4gcHJvcGVydGllcykge1xuICAgICAgICAgICAgdmFyIHYgPSByW2tdO1xuICAgICAgICAgICAgaWYgKHYgIT09IHVuZGVmaW5lZCAmJiAhcHJvcGVydGllc1trXS5pcyh2KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIGFycmF5ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gcGlwZShVbmtub3duQXJyYXksIHJlZmluZShmdW5jdGlvbiAodXMpIHsgcmV0dXJuIHVzLmV2ZXJ5KGl0ZW0uaXMpOyB9KSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIHJlY29yZCA9IGZ1bmN0aW9uIChjb2RvbWFpbikge1xuICAgIHJldHVybiBwaXBlKFVua25vd25SZWNvcmQsIHJlZmluZShmdW5jdGlvbiAocikge1xuICAgICAgICBmb3IgKHZhciBrIGluIHIpIHtcbiAgICAgICAgICAgIGlmICghY29kb21haW4uaXMocltrXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSkpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciB0dXBsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29tcG9uZW50cyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGNvbXBvbmVudHNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuICh7XG4gICAgICAgIGlzOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gQXJyYXkuaXNBcnJheSh1KSAmJiB1Lmxlbmd0aCA9PT0gY29tcG9uZW50cy5sZW5ndGggJiYgY29tcG9uZW50cy5ldmVyeShmdW5jdGlvbiAoYywgaSkgeyByZXR1cm4gYy5pcyh1W2ldKTsgfSk7IH1cbiAgICB9KTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgaW50ZXJzZWN0ID0gZnVuY3Rpb24gKHJpZ2h0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChsZWZ0KSB7IHJldHVybiAoe1xuICAgICAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIGxlZnQuaXModSkgJiYgcmlnaHQuaXModSk7IH1cbiAgICB9KTsgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgdW5pb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1lbWJlcnMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBtZW1iZXJzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiAoe1xuICAgICAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIG1lbWJlcnMuc29tZShmdW5jdGlvbiAobSkgeyByZXR1cm4gbS5pcyh1KTsgfSk7IH1cbiAgICB9KTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgc3VtID0gZnVuY3Rpb24gKHRhZykge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVtYmVycykge1xuICAgICAgICByZXR1cm4gcGlwZShVbmtub3duUmVjb3JkLCByZWZpbmUoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICAgIHZhciB2ID0gclt0YWddO1xuICAgICAgICAgICAgaWYgKHYgaW4gbWVtYmVycykge1xuICAgICAgICAgICAgICAgIHJldHVybiBtZW1iZXJzW3ZdLmlzKHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KSk7XG4gICAgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgbGF6eSA9IGZ1bmN0aW9uIChmKSB7XG4gICAgdmFyIGdldCA9IFMubWVtb2l6ZShmKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIGdldCgpLmlzKHUpOyB9XG4gICAgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4xNVxuICovXG5leHBvcnQgdmFyIHJlYWRvbmx5ID0gaWRlbnRpdHk7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgYWx0ID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG1lKSB7IHJldHVybiAoe1xuICAgICAgICBpczogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIG1lLmlzKGkpIHx8IHRoYXQoKS5pcyhpKTsgfVxuICAgIH0pOyB9O1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciB6ZXJvID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICBpczogZnVuY3Rpb24gKF8pIHsgcmV0dXJuIGZhbHNlOyB9XG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBjb21wb3NlID0gZnVuY3Rpb24gKHRvKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmcm9tKSB7IHJldHVybiAoe1xuICAgICAgICBpczogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIGZyb20uaXMoaSkgJiYgdG8uaXMoaSk7IH1cbiAgICB9KTsgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgaWQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgIGlzOiBmdW5jdGlvbiAoXykgeyByZXR1cm4gdHJ1ZTsgfVxufSk7IH07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBpbnN0YW5jZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgVVJJID0gJ2lvLXRzL0d1YXJkJztcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgU2NoZW1hYmxlID0ge1xuICAgIFVSSTogVVJJLFxuICAgIGxpdGVyYWw6IGxpdGVyYWwsXG4gICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgbnVtYmVyOiBudW1iZXIsXG4gICAgYm9vbGVhbjogYm9vbGVhbixcbiAgICBudWxsYWJsZTogbnVsbGFibGUsXG4gICAgdHlwZTogdHlwZSxcbiAgICBzdHJ1Y3Q6IHN0cnVjdCxcbiAgICBwYXJ0aWFsOiBwYXJ0aWFsLFxuICAgIHJlY29yZDogcmVjb3JkLFxuICAgIGFycmF5OiBhcnJheSxcbiAgICB0dXBsZTogdHVwbGUsXG4gICAgaW50ZXJzZWN0OiBpbnRlcnNlY3QsXG4gICAgc3VtOiBzdW0sXG4gICAgbGF6eTogZnVuY3Rpb24gKF8sIGYpIHsgcmV0dXJuIGxhenkoZik7IH0sXG4gICAgcmVhZG9ubHk6IHJlYWRvbmx5XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBXaXRoVW5rbm93bkNvbnRhaW5lcnMgPSB7XG4gICAgVW5rbm93bkFycmF5OiBVbmtub3duQXJyYXksXG4gICAgVW5rbm93blJlY29yZDogVW5rbm93blJlY29yZFxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgV2l0aFVuaW9uID0ge1xuICAgIHVuaW9uOiB1bmlvblxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgV2l0aFJlZmluZSA9IHtcbiAgICByZWZpbmU6IHJlZmluZVxufTtcbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvZXM2L0VpdGhlcic7XG5pbXBvcnQgKiBhcyBHIGZyb20gJy4vR3VhcmQnO1xuaW1wb3J0ICogYXMgUyBmcm9tICcuL1NjaGVtYWJsZSc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdHJ1Y3RvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUmVmaW5lbWVudChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyZWZpbmVtZW50LCBvbkVycm9yKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpKSB7IHJldHVybiAocmVmaW5lbWVudChpKSA/IE0ub2YoaSkgOiBNLnRocm93RXJyb3Iob25FcnJvcihpKSkpOyB9XG4gICAgfSk7IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGl0ZXJhbChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbkVycm9yKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhbHVlc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICh7XG4gICAgICAgICAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gKEcubGl0ZXJhbC5hcHBseShHLCB2YWx1ZXMpLmlzKGkpID8gTS5vZihpKSA6IE0udGhyb3dFcnJvcihvbkVycm9yKGksIHZhbHVlcykpKTsgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbWJpbmF0b3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBMZWZ0V2l0aElucHV0KE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChkZWNvZGVyKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpKSB7IHJldHVybiBNLm1hcExlZnQoZGVjb2Rlci5kZWNvZGUoaSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBmKGksIGUpOyB9KTsgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVmaW5lKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJlZmluZW1lbnQsIG9uRXJyb3IpIHsgcmV0dXJuIGZ1bmN0aW9uIChmcm9tKSB7IHJldHVybiBjb21wb3NlKE0pKGZyb21SZWZpbmVtZW50KE0pKHJlZmluZW1lbnQsIG9uRXJyb3IpKShmcm9tKTsgfTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRlY29kZSkgeyByZXR1cm4gZnVuY3Rpb24gKGZyb20pIHsgcmV0dXJuIGNvbXBvc2UoTSkoeyBkZWNvZGU6IGRlY29kZSB9KShmcm9tKTsgfTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG51bGxhYmxlKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvcikgeyByZXR1cm4gKHtcbiAgICAgICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaSA9PT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICA/IE0ub2YobnVsbClcbiAgICAgICAgICAgICAgICAgICAgOiBNLmJpbWFwKG9yLmRlY29kZShpKSwgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIG9uRXJyb3IoaSwgZSk7IH0sIGZ1bmN0aW9uIChhKSB7IHJldHVybiBhOyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7IH07XG4gICAgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjE1XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tU3RydWN0KE0pIHtcbiAgICB2YXIgdHJhdmVyc2UgPSB0cmF2ZXJzZVJlY29yZFdpdGhJbmRleChNKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uUHJvcGVydHlFcnJvcikgeyByZXR1cm4gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmF2ZXJzZShwcm9wZXJ0aWVzLCBmdW5jdGlvbiAoa2V5LCBkZWNvZGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE0ubWFwTGVmdChkZWNvZGVyLmRlY29kZShpW2tleV0pLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25Qcm9wZXJ0eUVycm9yKGtleSwgZSk7IH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTsgfTsgfTtcbn1cbi8qKlxuICogVXNlIGBmcm9tU3RydWN0YCBpbnN0ZWFkLlxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgdmFyIGZyb21UeXBlID0gZnJvbVN0cnVjdDtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21QYXJ0aWFsKE0pIHtcbiAgICB2YXIgdHJhdmVyc2UgPSB0cmF2ZXJzZVJlY29yZFdpdGhJbmRleChNKTtcbiAgICB2YXIgdW5kZWZpbmVkUHJvcGVydHkgPSBNLm9mKEUucmlnaHQodW5kZWZpbmVkKSk7XG4gICAgdmFyIHNraXBQcm9wZXJ0eSA9IE0ub2YoRS5sZWZ0KHVuZGVmaW5lZCkpO1xuICAgIHJldHVybiBmdW5jdGlvbiAob25Qcm9wZXJ0eUVycm9yKSB7IHJldHVybiBmdW5jdGlvbiAocHJvcGVydGllcykgeyByZXR1cm4gKHtcbiAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIE0ubWFwKHRyYXZlcnNlKHByb3BlcnRpZXMsIGZ1bmN0aW9uIChrZXksIGRlY29kZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgaWtleSA9IGlba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoaWtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXkgaW4gaVxuICAgICAgICAgICAgICAgICAgICAgICAgPyAvLyBkb24ndCBzdHJpcCB1bmRlZmluZWQgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZFByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICA6IC8vIGRvbid0IGFkZCBtaXNzaW5nIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBza2lwUHJvcGVydHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBNLmJpbWFwKGRlY29kZXIuZGVjb2RlKGlrZXkpLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25Qcm9wZXJ0eUVycm9yKGtleSwgZSk7IH0sIGZ1bmN0aW9uIChhKSB7IHJldHVybiBFLnJpZ2h0KGEpOyB9KTtcbiAgICAgICAgICAgIH0pLCBjb21wYWN0UmVjb3JkKTtcbiAgICAgICAgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUFycmF5KE0pIHtcbiAgICB2YXIgdHJhdmVyc2UgPSB0cmF2ZXJzZUFycmF5V2l0aEluZGV4KE0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAob25JdGVtRXJyb3IpIHsgcmV0dXJuIGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpcykgeyByZXR1cm4gdHJhdmVyc2UoaXMsIGZ1bmN0aW9uIChpbmRleCwgaSkgeyByZXR1cm4gTS5tYXBMZWZ0KGl0ZW0uZGVjb2RlKGkpLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25JdGVtRXJyb3IoaW5kZXgsIGUpOyB9KTsgfSk7IH1cbiAgICB9KTsgfTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21SZWNvcmQoTSkge1xuICAgIHZhciB0cmF2ZXJzZSA9IHRyYXZlcnNlUmVjb3JkV2l0aEluZGV4KE0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAob25LZXlFcnJvcikgeyByZXR1cm4gZnVuY3Rpb24gKGNvZG9tYWluKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpcikgeyByZXR1cm4gdHJhdmVyc2UoaXIsIGZ1bmN0aW9uIChrZXksIGkpIHsgcmV0dXJuIE0ubWFwTGVmdChjb2RvbWFpbi5kZWNvZGUoaSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBvbktleUVycm9yKGtleSwgZSk7IH0pOyB9KTsgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbVR1cGxlKE0pIHtcbiAgICB2YXIgdHJhdmVyc2UgPSB0cmF2ZXJzZUFycmF5V2l0aEluZGV4KE0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAob25JbmRleEVycm9yKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKHtcbiAgICAgICAgICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJhdmVyc2UoY29tcG9uZW50cywgZnVuY3Rpb24gKGluZGV4LCBkZWNvZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTS5tYXBMZWZ0KGRlY29kZXIuZGVjb2RlKGlzW2luZGV4XSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBvbkluZGV4RXJyb3IoaW5kZXgsIGUpOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaW9uKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uTWVtYmVyRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtZW1iZXJzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIG1lbWJlcnNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoe1xuICAgICAgICAgICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG91dCA9IE0ubWFwTGVmdChtZW1iZXJzWzBdLmRlY29kZShpKSwgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIG9uTWVtYmVyRXJyb3IoMCwgZSk7IH0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ID0gTS5hbHQob3V0LCBmdW5jdGlvbiAoKSB7IHJldHVybiBNLm1hcExlZnQobWVtYmVyc1tpbmRleF0uZGVjb2RlKGkpLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25NZW1iZXJFcnJvcihpbmRleCwgZSk7IH0pOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IG1lbWJlcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbG9vcF8xKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnNlY3QoTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocmlnaHQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChsZWZ0KSB7IHJldHVybiAoe1xuICAgICAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNLmFwKE0ubWFwKGxlZnQuZGVjb2RlKGkpLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHsgcmV0dXJuIFMuaW50ZXJzZWN0XyhhLCBiKTsgfTsgfSksIHJpZ2h0LmRlY29kZShpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyB9O1xuICAgIH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tU3VtKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uVGFnRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAobWVtYmVycykge1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMobWVtYmVycyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gaXJbdGFnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobWVtYmVycywgdikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWVtYmVyc1t2XS5kZWNvZGUoaXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE0udGhyb3dFcnJvcihvblRhZ0Vycm9yKHRhZywgdiwga2V5cykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxhenkoTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAob25FcnJvcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlkLCBmKSB7XG4gICAgICAgICAgICB2YXIgZ2V0ID0gUy5tZW1vaXplKGYpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uICh1KSB7IHJldHVybiBNLm1hcExlZnQoZ2V0KCkuZGVjb2RlKHUpLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25FcnJvcihpZCwgZSk7IH0pOyB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFiKSB7IHJldHVybiBmdW5jdGlvbiAoaWEpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIE0uY2hhaW4oaWEuZGVjb2RlKGkpLCBhYi5kZWNvZGUpOyB9XG4gICAgfSk7IH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogTS5vZlxuICAgIH0pOyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChpYSkgeyByZXR1cm4gKHtcbiAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gRi5tYXAoaWEuZGVjb2RlKGkpLCBmKTsgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWx0KEEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRoYXQpIHsgcmV0dXJuIGZ1bmN0aW9uIChtZSkgeyByZXR1cm4gKHtcbiAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gQS5hbHQobWUuZGVjb2RlKGkpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGF0KCkuZGVjb2RlKGkpOyB9KTsgfVxuICAgIH0pOyB9OyB9O1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gdXRpbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciB0cmF2ZXJzZUFycmF5V2l0aEluZGV4ID0gZnVuY3Rpb24gKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFzLCBmKSB7XG4gICAgICAgIHJldHVybiBhcy5yZWR1Y2UoZnVuY3Rpb24gKG1icywgYSwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIE0uYXAoTS5tYXAobWJzLCBmdW5jdGlvbiAoYnMpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgYnMucHVzaChiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYnM7XG4gICAgICAgICAgICB9OyB9KSwgZihpLCBhKSk7XG4gICAgICAgIH0sIE0ub2YoW10pKTtcbiAgICB9O1xufTtcbnZhciB0cmF2ZXJzZVJlY29yZFdpdGhJbmRleCA9IGZ1bmN0aW9uIChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyLCBmKSB7XG4gICAgICAgIHZhciBrcyA9IE9iamVjdC5rZXlzKHIpO1xuICAgICAgICBpZiAoa3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTS5vZih7fSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZyID0gTS5vZih7fSk7XG4gICAgICAgIHZhciBfbG9vcF8yID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgZnIgPSBNLmFwKE0ubWFwKGZyLCBmdW5jdGlvbiAocikgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICByW2tleV0gPSBiO1xuICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgfTsgfSksIGYoa2V5LCByW2tleV0pKTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBrc18xID0ga3M7IF9pIDwga3NfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrc18xW19pXTtcbiAgICAgICAgICAgIF9sb29wXzIoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnI7XG4gICAgfTtcbn07XG52YXIgY29tcGFjdFJlY29yZCA9IGZ1bmN0aW9uIChyKSB7XG4gICAgdmFyIG91dCA9IHt9O1xuICAgIGZvciAodmFyIGsgaW4gcikge1xuICAgICAgICB2YXIgcmsgPSByW2tdO1xuICAgICAgICBpZiAoRS5pc1JpZ2h0KHJrKSkge1xuICAgICAgICAgICAgb3V0W2tdID0gcmsucmlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn07XG4iLCIvKipcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVtb2l6ZShmKSB7XG4gICAgdmFyIGNhY2hlID0gbmV3IE1hcCgpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgICBpZiAoIWNhY2hlLmhhcyhhKSkge1xuICAgICAgICAgICAgdmFyIGIgPSBmKGEpO1xuICAgICAgICAgICAgY2FjaGUuc2V0KGEsIGIpO1xuICAgICAgICAgICAgcmV0dXJuIGI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhY2hlLmdldChhKTtcbiAgICB9O1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gdXRpbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciB0eXBlT2YgPSBmdW5jdGlvbiAoeCkgeyByZXR1cm4gKHggPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgeCk7IH07XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgdmFyIGludGVyc2VjdF8gPSBmdW5jdGlvbiAoYSwgYikge1xuICAgIGlmIChhICE9PSB1bmRlZmluZWQgJiYgYiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciB0eCA9IHR5cGVPZihhKTtcbiAgICAgICAgdmFyIHR5ID0gdHlwZU9mKGIpO1xuICAgICAgICBpZiAodHggPT09ICdvYmplY3QnIHx8IHR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGEsIGIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93W1wiVGhpbmtpbmdIb21lVWlcIl07IiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3dbXCJ0aFJlYWN0XCJdOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNyZWF0ZU1vZHVsZSwgTG9nTGV2ZWwsIHVzZUFwcENvbnRleHQsIHVzZUxvZ2dlciB9IGZyb20gJ0B0aGlua2luZy1ob21lL3VpJztcbmltcG9ydCAqIGFzIGQgZnJvbSAnaW8tdHMvRGVjb2Rlcic7XG5jb25zdCB1cmwgPSAnL2FwaS90bXAvcGlncyc7XG5jb25zdCB0bXBQaWdEZWNvZGVyID0gZC5zdHJ1Y3Qoe1xuICAgIGlkOiBkLnN0cmluZyxcbiAgICBuYW1lOiBkLnN0cmluZyxcbiAgICBzaXplOiBkLm51bWJlcixcbn0pO1xuY29uc3QgdG1wUmVzcG9uc2VEZWNvZGVyID0gZC5hcnJheSh0bXBQaWdEZWNvZGVyKTtcbmNvbnN0IFRtcFNlY3Rpb24gPSAoKSA9PiB7XG4gICAgY29uc3QgW2xpc3QsIHNldExpc3RdID0gdXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IHsgYXBpIH0gPSB1c2VBcHBDb250ZXh0KCk7XG4gICAgY29uc3QgY29udHJvbGxlciA9IHVzZU1lbW8oKCkgPT4gbmV3IEFib3J0Q29udHJvbGxlcigpLCBbXSk7XG4gICAgY29uc3QgbG9nZ2VyID0gdXNlTG9nZ2VyKCk7XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgYXBpLmdldCh0bXBSZXNwb25zZURlY29kZXIsIHsgdXJsLCBzaWduYWw6IGNvbnRyb2xsZXIuc2lnbmFsIH0pXG4gICAgICAgICAgICAudGhlbihzZXRMaXN0LCAoZSkgPT4gbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogJ2Vycm9yJykpO1xuICAgICAgICByZXR1cm4gKCkgPT4gY29udHJvbGxlci5hYm9ydCgpO1xuICAgIH0sIFtjb250cm9sbGVyLCBsb2dnZXJdKTtcbiAgICBjb25zdCBjYW5jZWwgPSB1c2VDYWxsYmFjaygoKSA9PiBjb250cm9sbGVyLmFib3J0KCksIFtjb250cm9sbGVyXSk7XG4gICAgY29uc3QgY29udGVudCA9IGxpc3QubGVuZ3RoID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLCBsaXN0Lm1hcChwaWcgPT4gUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsXG4gICAgICAgIHBpZy5uYW1lLFxuICAgICAgICBcIiAoXCIsXG4gICAgICAgIHBpZy5zaXplLFxuICAgICAgICBcIilcIikpKSkgOiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiTE9BRElORy4uLlwiKTtcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBsaXN0Lmxlbmd0aCA/IHVuZGVmaW5lZCA6IChSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgb25DbGljazogY2FuY2VsIH0sIFwiQ2FuY2VsIHJlcXVlc3RcIikpKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCxcbiAgICAgICAgICAgIFwiVGhpcyBpcyB0aGUgXCIsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIFwiVGVzdCBwYWdlIDJcIiksXG4gICAgICAgICAgICBcIiAoZnJvbSBcIixcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjb2RlXCIsIG51bGwsIFwiVG1wIHBsdWdpblwiKSxcbiAgICAgICAgICAgIFwiKVwiKSxcbiAgICAgICAgY2FuY2VsQnV0dG9uLFxuICAgICAgICBjb250ZW50KSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTW9kdWxlKFRtcFNlY3Rpb24pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9