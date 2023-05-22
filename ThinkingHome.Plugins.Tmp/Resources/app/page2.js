/******/ var __webpack_modules__ = ({

/***/ "./node_modules/fp-ts/es6/Applicative.js":
/*!***********************************************!*\
  !*** ./node_modules/fp-ts/es6/Applicative.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getApplicativeComposition": () => (/* binding */ getApplicativeComposition),
/* harmony export */   "getApplicativeMonoid": () => (/* binding */ getApplicativeMonoid)
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
/* harmony export */   "ap": () => (/* binding */ ap),
/* harmony export */   "apFirst": () => (/* binding */ apFirst),
/* harmony export */   "apS": () => (/* binding */ apS),
/* harmony export */   "apSecond": () => (/* binding */ apSecond),
/* harmony export */   "getApplySemigroup": () => (/* binding */ getApplySemigroup),
/* harmony export */   "sequenceS": () => (/* binding */ sequenceS),
/* harmony export */   "sequenceT": () => (/* binding */ sequenceT)
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
/* harmony export */   "bind": () => (/* binding */ bind),
/* harmony export */   "chainFirst": () => (/* binding */ chainFirst)
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
/* harmony export */   "tailRec": () => (/* binding */ tailRec)
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
/* harmony export */   "Alt": () => (/* binding */ Alt),
/* harmony export */   "ApT": () => (/* binding */ ApT),
/* harmony export */   "Applicative": () => (/* binding */ Applicative),
/* harmony export */   "Apply": () => (/* binding */ Apply),
/* harmony export */   "Bifunctor": () => (/* binding */ Bifunctor),
/* harmony export */   "Chain": () => (/* binding */ Chain),
/* harmony export */   "ChainRec": () => (/* binding */ ChainRec),
/* harmony export */   "Do": () => (/* binding */ Do),
/* harmony export */   "Extend": () => (/* binding */ Extend),
/* harmony export */   "Foldable": () => (/* binding */ Foldable),
/* harmony export */   "FromEither": () => (/* binding */ FromEither),
/* harmony export */   "Functor": () => (/* binding */ Functor),
/* harmony export */   "Monad": () => (/* binding */ Monad),
/* harmony export */   "MonadThrow": () => (/* binding */ MonadThrow),
/* harmony export */   "Pointed": () => (/* binding */ Pointed),
/* harmony export */   "Traversable": () => (/* binding */ Traversable),
/* harmony export */   "URI": () => (/* binding */ URI),
/* harmony export */   "alt": () => (/* binding */ alt),
/* harmony export */   "altW": () => (/* binding */ altW),
/* harmony export */   "ap": () => (/* binding */ ap),
/* harmony export */   "apFirst": () => (/* binding */ apFirst),
/* harmony export */   "apFirstW": () => (/* binding */ apFirstW),
/* harmony export */   "apS": () => (/* binding */ apS),
/* harmony export */   "apSW": () => (/* binding */ apSW),
/* harmony export */   "apSecond": () => (/* binding */ apSecond),
/* harmony export */   "apSecondW": () => (/* binding */ apSecondW),
/* harmony export */   "apW": () => (/* binding */ apW),
/* harmony export */   "bimap": () => (/* binding */ bimap),
/* harmony export */   "bind": () => (/* binding */ bind),
/* harmony export */   "bindTo": () => (/* binding */ bindTo),
/* harmony export */   "bindW": () => (/* binding */ bindW),
/* harmony export */   "chain": () => (/* binding */ chain),
/* harmony export */   "chainFirst": () => (/* binding */ chainFirst),
/* harmony export */   "chainFirstW": () => (/* binding */ chainFirstW),
/* harmony export */   "chainNullableK": () => (/* binding */ chainNullableK),
/* harmony export */   "chainOptionK": () => (/* binding */ chainOptionK),
/* harmony export */   "chainOptionKW": () => (/* binding */ chainOptionKW),
/* harmony export */   "chainW": () => (/* binding */ chainW),
/* harmony export */   "duplicate": () => (/* binding */ duplicate),
/* harmony export */   "either": () => (/* binding */ either),
/* harmony export */   "elem": () => (/* binding */ elem),
/* harmony export */   "exists": () => (/* binding */ exists),
/* harmony export */   "extend": () => (/* binding */ extend),
/* harmony export */   "filterOrElse": () => (/* binding */ filterOrElse),
/* harmony export */   "filterOrElseW": () => (/* binding */ filterOrElseW),
/* harmony export */   "flap": () => (/* binding */ flap),
/* harmony export */   "flatMap": () => (/* binding */ flatMap),
/* harmony export */   "flatten": () => (/* binding */ flatten),
/* harmony export */   "flattenW": () => (/* binding */ flattenW),
/* harmony export */   "fold": () => (/* binding */ fold),
/* harmony export */   "foldMap": () => (/* binding */ foldMap),
/* harmony export */   "foldW": () => (/* binding */ foldW),
/* harmony export */   "fromNullable": () => (/* binding */ fromNullable),
/* harmony export */   "fromNullableK": () => (/* binding */ fromNullableK),
/* harmony export */   "fromOption": () => (/* binding */ fromOption),
/* harmony export */   "fromOptionK": () => (/* binding */ fromOptionK),
/* harmony export */   "fromPredicate": () => (/* binding */ fromPredicate),
/* harmony export */   "getAltValidation": () => (/* binding */ getAltValidation),
/* harmony export */   "getApplicativeValidation": () => (/* binding */ getApplicativeValidation),
/* harmony export */   "getApplyMonoid": () => (/* binding */ getApplyMonoid),
/* harmony export */   "getApplySemigroup": () => (/* binding */ getApplySemigroup),
/* harmony export */   "getCompactable": () => (/* binding */ getCompactable),
/* harmony export */   "getEq": () => (/* binding */ getEq),
/* harmony export */   "getFilterable": () => (/* binding */ getFilterable),
/* harmony export */   "getOrElse": () => (/* binding */ getOrElse),
/* harmony export */   "getOrElseW": () => (/* binding */ getOrElseW),
/* harmony export */   "getSemigroup": () => (/* binding */ getSemigroup),
/* harmony export */   "getShow": () => (/* binding */ getShow),
/* harmony export */   "getValidation": () => (/* binding */ getValidation),
/* harmony export */   "getValidationMonoid": () => (/* binding */ getValidationMonoid),
/* harmony export */   "getValidationSemigroup": () => (/* binding */ getValidationSemigroup),
/* harmony export */   "getWitherable": () => (/* binding */ getWitherable),
/* harmony export */   "isLeft": () => (/* binding */ isLeft),
/* harmony export */   "isRight": () => (/* binding */ isRight),
/* harmony export */   "left": () => (/* binding */ left),
/* harmony export */   "let": () => (/* binding */ let_),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "mapLeft": () => (/* binding */ mapLeft),
/* harmony export */   "match": () => (/* binding */ match),
/* harmony export */   "matchW": () => (/* binding */ matchW),
/* harmony export */   "of": () => (/* binding */ of),
/* harmony export */   "orElse": () => (/* binding */ orElse),
/* harmony export */   "orElseW": () => (/* binding */ orElseW),
/* harmony export */   "parseJSON": () => (/* binding */ parseJSON),
/* harmony export */   "reduce": () => (/* binding */ reduce),
/* harmony export */   "reduceRight": () => (/* binding */ reduceRight),
/* harmony export */   "right": () => (/* binding */ right),
/* harmony export */   "sequence": () => (/* binding */ sequence),
/* harmony export */   "sequenceArray": () => (/* binding */ sequenceArray),
/* harmony export */   "stringifyJSON": () => (/* binding */ stringifyJSON),
/* harmony export */   "swap": () => (/* binding */ swap),
/* harmony export */   "throwError": () => (/* binding */ throwError),
/* harmony export */   "toError": () => (/* binding */ toError),
/* harmony export */   "toUnion": () => (/* binding */ toUnion),
/* harmony export */   "traverse": () => (/* binding */ traverse),
/* harmony export */   "traverseArray": () => (/* binding */ traverseArray),
/* harmony export */   "traverseArrayWithIndex": () => (/* binding */ traverseArrayWithIndex),
/* harmony export */   "traverseReadonlyArrayWithIndex": () => (/* binding */ traverseReadonlyArrayWithIndex),
/* harmony export */   "traverseReadonlyNonEmptyArrayWithIndex": () => (/* binding */ traverseReadonlyNonEmptyArrayWithIndex),
/* harmony export */   "tryCatch": () => (/* binding */ tryCatch),
/* harmony export */   "tryCatchK": () => (/* binding */ tryCatchK)
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
/* harmony export */   "chainEitherK": () => (/* binding */ chainEitherK),
/* harmony export */   "chainFirstEitherK": () => (/* binding */ chainFirstEitherK),
/* harmony export */   "chainOptionK": () => (/* binding */ chainOptionK),
/* harmony export */   "filterOrElse": () => (/* binding */ filterOrElse),
/* harmony export */   "fromEitherK": () => (/* binding */ fromEitherK),
/* harmony export */   "fromOption": () => (/* binding */ fromOption),
/* harmony export */   "fromOptionK": () => (/* binding */ fromOptionK),
/* harmony export */   "fromPredicate": () => (/* binding */ fromPredicate)
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
/* harmony export */   "bindTo": () => (/* binding */ bindTo),
/* harmony export */   "flap": () => (/* binding */ flap),
/* harmony export */   "getFunctorComposition": () => (/* binding */ getFunctorComposition),
/* harmony export */   "let": () => (/* binding */ let_),
/* harmony export */   "map": () => (/* binding */ map)
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
/* harmony export */   "Bifunctor": () => (/* binding */ Bifunctor),
/* harmony export */   "Functor": () => (/* binding */ Functor),
/* harmony export */   "URI": () => (/* binding */ URI),
/* harmony export */   "bimap": () => (/* binding */ bimap),
/* harmony export */   "flap": () => (/* binding */ flap),
/* harmony export */   "left": () => (/* binding */ left),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "mapLeft": () => (/* binding */ mapLeft),
/* harmony export */   "right": () => (/* binding */ right),
/* harmony export */   "separated": () => (/* binding */ separated)
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
/* harmony export */   "filterE": () => (/* binding */ filterE),
/* harmony export */   "wiltDefault": () => (/* binding */ wiltDefault),
/* harmony export */   "witherDefault": () => (/* binding */ witherDefault)
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
/* harmony export */   "SK": () => (/* binding */ SK),
/* harmony export */   "absurd": () => (/* binding */ absurd),
/* harmony export */   "apply": () => (/* binding */ apply),
/* harmony export */   "constFalse": () => (/* binding */ constFalse),
/* harmony export */   "constNull": () => (/* binding */ constNull),
/* harmony export */   "constTrue": () => (/* binding */ constTrue),
/* harmony export */   "constUndefined": () => (/* binding */ constUndefined),
/* harmony export */   "constVoid": () => (/* binding */ constVoid),
/* harmony export */   "constant": () => (/* binding */ constant),
/* harmony export */   "decrement": () => (/* binding */ decrement),
/* harmony export */   "dual": () => (/* binding */ dual),
/* harmony export */   "flip": () => (/* binding */ flip),
/* harmony export */   "flow": () => (/* binding */ flow),
/* harmony export */   "getBooleanAlgebra": () => (/* binding */ getBooleanAlgebra),
/* harmony export */   "getEndomorphismMonoid": () => (/* binding */ getEndomorphismMonoid),
/* harmony export */   "getMonoid": () => (/* binding */ getMonoid),
/* harmony export */   "getRing": () => (/* binding */ getRing),
/* harmony export */   "getSemigroup": () => (/* binding */ getSemigroup),
/* harmony export */   "getSemiring": () => (/* binding */ getSemiring),
/* harmony export */   "hole": () => (/* binding */ hole),
/* harmony export */   "identity": () => (/* binding */ identity),
/* harmony export */   "increment": () => (/* binding */ increment),
/* harmony export */   "not": () => (/* binding */ not),
/* harmony export */   "pipe": () => (/* binding */ pipe),
/* harmony export */   "tuple": () => (/* binding */ tuple),
/* harmony export */   "tupled": () => (/* binding */ tupled),
/* harmony export */   "unsafeCoerce": () => (/* binding */ unsafeCoerce),
/* harmony export */   "untupled": () => (/* binding */ untupled)
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
/* harmony export */   "emptyReadonlyArray": () => (/* binding */ emptyReadonlyArray),
/* harmony export */   "emptyRecord": () => (/* binding */ emptyRecord),
/* harmony export */   "fromReadonlyNonEmptyArray": () => (/* binding */ fromReadonlyNonEmptyArray),
/* harmony export */   "has": () => (/* binding */ has),
/* harmony export */   "head": () => (/* binding */ head),
/* harmony export */   "isLeft": () => (/* binding */ isLeft),
/* harmony export */   "isNonEmpty": () => (/* binding */ isNonEmpty),
/* harmony export */   "isNone": () => (/* binding */ isNone),
/* harmony export */   "isRight": () => (/* binding */ isRight),
/* harmony export */   "isSome": () => (/* binding */ isSome),
/* harmony export */   "left": () => (/* binding */ left),
/* harmony export */   "none": () => (/* binding */ none),
/* harmony export */   "right": () => (/* binding */ right),
/* harmony export */   "singleton": () => (/* binding */ singleton),
/* harmony export */   "some": () => (/* binding */ some),
/* harmony export */   "tail": () => (/* binding */ tail)
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
/* harmony export */   "alt": () => (/* binding */ alt),
/* harmony export */   "ap": () => (/* binding */ ap),
/* harmony export */   "bimap": () => (/* binding */ bimap),
/* harmony export */   "chain": () => (/* binding */ chain),
/* harmony export */   "compose": () => (/* binding */ compose),
/* harmony export */   "contramap": () => (/* binding */ contramap),
/* harmony export */   "extend": () => (/* binding */ extend),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "filterMap": () => (/* binding */ filterMap),
/* harmony export */   "filterMapWithIndex": () => (/* binding */ filterMapWithIndex),
/* harmony export */   "filterWithIndex": () => (/* binding */ filterWithIndex),
/* harmony export */   "foldMap": () => (/* binding */ foldMap),
/* harmony export */   "foldMapWithIndex": () => (/* binding */ foldMapWithIndex),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "mapLeft": () => (/* binding */ mapLeft),
/* harmony export */   "mapWithIndex": () => (/* binding */ mapWithIndex),
/* harmony export */   "partition": () => (/* binding */ partition),
/* harmony export */   "partitionMap": () => (/* binding */ partitionMap),
/* harmony export */   "partitionMapWithIndex": () => (/* binding */ partitionMapWithIndex),
/* harmony export */   "partitionWithIndex": () => (/* binding */ partitionWithIndex),
/* harmony export */   "pipe": () => (/* binding */ pipe),
/* harmony export */   "pipeable": () => (/* binding */ pipeable),
/* harmony export */   "promap": () => (/* binding */ promap),
/* harmony export */   "reduce": () => (/* binding */ reduce),
/* harmony export */   "reduceRight": () => (/* binding */ reduceRight),
/* harmony export */   "reduceRightWithIndex": () => (/* binding */ reduceRightWithIndex),
/* harmony export */   "reduceWithIndex": () => (/* binding */ reduceWithIndex)
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
/* harmony export */   "fold": () => (/* binding */ fold),
/* harmony export */   "getSemigroup": () => (/* binding */ getSemigroup),
/* harmony export */   "index": () => (/* binding */ index),
/* harmony export */   "key": () => (/* binding */ key),
/* harmony export */   "lazy": () => (/* binding */ lazy),
/* harmony export */   "leaf": () => (/* binding */ leaf),
/* harmony export */   "member": () => (/* binding */ member),
/* harmony export */   "optional": () => (/* binding */ optional),
/* harmony export */   "required": () => (/* binding */ required),
/* harmony export */   "wrap": () => (/* binding */ wrap)
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
/* harmony export */   "Alt": () => (/* binding */ Alt),
/* harmony export */   "Category": () => (/* binding */ Category),
/* harmony export */   "Functor": () => (/* binding */ Functor),
/* harmony export */   "SE": () => (/* binding */ SE),
/* harmony export */   "Schemable": () => (/* binding */ Schemable),
/* harmony export */   "URI": () => (/* binding */ URI),
/* harmony export */   "UnknownArray": () => (/* binding */ UnknownArray),
/* harmony export */   "UnknownRecord": () => (/* binding */ UnknownRecord),
/* harmony export */   "WithRefine": () => (/* binding */ WithRefine),
/* harmony export */   "WithUnion": () => (/* binding */ WithUnion),
/* harmony export */   "WithUnknownContainers": () => (/* binding */ WithUnknownContainers),
/* harmony export */   "alt": () => (/* binding */ alt),
/* harmony export */   "ap": () => (/* binding */ ap),
/* harmony export */   "array": () => (/* binding */ array),
/* harmony export */   "boolean": () => (/* binding */ boolean),
/* harmony export */   "compose": () => (/* binding */ compose),
/* harmony export */   "draw": () => (/* binding */ draw),
/* harmony export */   "error": () => (/* binding */ error),
/* harmony export */   "failure": () => (/* binding */ failure),
/* harmony export */   "fromArray": () => (/* binding */ fromArray),
/* harmony export */   "fromGuard": () => (/* binding */ fromGuard),
/* harmony export */   "fromPartial": () => (/* binding */ fromPartial),
/* harmony export */   "fromRecord": () => (/* binding */ fromRecord),
/* harmony export */   "fromRefinement": () => (/* binding */ fromRefinement),
/* harmony export */   "fromStruct": () => (/* binding */ fromStruct),
/* harmony export */   "fromSum": () => (/* binding */ fromSum),
/* harmony export */   "fromTuple": () => (/* binding */ fromTuple),
/* harmony export */   "fromType": () => (/* binding */ fromType),
/* harmony export */   "id": () => (/* binding */ id),
/* harmony export */   "intersect": () => (/* binding */ intersect),
/* harmony export */   "lazy": () => (/* binding */ lazy),
/* harmony export */   "literal": () => (/* binding */ literal),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "mapLeftWithInput": () => (/* binding */ mapLeftWithInput),
/* harmony export */   "nullable": () => (/* binding */ nullable),
/* harmony export */   "number": () => (/* binding */ number),
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "partial": () => (/* binding */ partial),
/* harmony export */   "readonly": () => (/* binding */ readonly),
/* harmony export */   "record": () => (/* binding */ record),
/* harmony export */   "refine": () => (/* binding */ refine),
/* harmony export */   "string": () => (/* binding */ string),
/* harmony export */   "stringify": () => (/* binding */ stringify),
/* harmony export */   "struct": () => (/* binding */ struct),
/* harmony export */   "success": () => (/* binding */ success),
/* harmony export */   "sum": () => (/* binding */ sum),
/* harmony export */   "tuple": () => (/* binding */ tuple),
/* harmony export */   "type": () => (/* binding */ type),
/* harmony export */   "union": () => (/* binding */ union),
/* harmony export */   "withMessage": () => (/* binding */ withMessage)
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
/* harmony export */   "concat": () => (/* binding */ concat),
/* harmony export */   "fold": () => (/* binding */ fold),
/* harmony export */   "getSemigroup": () => (/* binding */ getSemigroup),
/* harmony export */   "of": () => (/* binding */ of)
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
/* harmony export */   "Schemable": () => (/* binding */ Schemable),
/* harmony export */   "URI": () => (/* binding */ URI),
/* harmony export */   "UnknownArray": () => (/* binding */ UnknownArray),
/* harmony export */   "UnknownRecord": () => (/* binding */ UnknownRecord),
/* harmony export */   "WithRefine": () => (/* binding */ WithRefine),
/* harmony export */   "WithUnion": () => (/* binding */ WithUnion),
/* harmony export */   "WithUnknownContainers": () => (/* binding */ WithUnknownContainers),
/* harmony export */   "alt": () => (/* binding */ alt),
/* harmony export */   "array": () => (/* binding */ array),
/* harmony export */   "boolean": () => (/* binding */ boolean),
/* harmony export */   "compose": () => (/* binding */ compose),
/* harmony export */   "id": () => (/* binding */ id),
/* harmony export */   "intersect": () => (/* binding */ intersect),
/* harmony export */   "lazy": () => (/* binding */ lazy),
/* harmony export */   "literal": () => (/* binding */ literal),
/* harmony export */   "nullable": () => (/* binding */ nullable),
/* harmony export */   "number": () => (/* binding */ number),
/* harmony export */   "partial": () => (/* binding */ partial),
/* harmony export */   "readonly": () => (/* binding */ readonly),
/* harmony export */   "record": () => (/* binding */ record),
/* harmony export */   "refine": () => (/* binding */ refine),
/* harmony export */   "string": () => (/* binding */ string),
/* harmony export */   "struct": () => (/* binding */ struct),
/* harmony export */   "sum": () => (/* binding */ sum),
/* harmony export */   "tuple": () => (/* binding */ tuple),
/* harmony export */   "type": () => (/* binding */ type),
/* harmony export */   "union": () => (/* binding */ union),
/* harmony export */   "zero": () => (/* binding */ zero)
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
/* harmony export */   "alt": () => (/* binding */ alt),
/* harmony export */   "compose": () => (/* binding */ compose),
/* harmony export */   "fromArray": () => (/* binding */ fromArray),
/* harmony export */   "fromPartial": () => (/* binding */ fromPartial),
/* harmony export */   "fromRecord": () => (/* binding */ fromRecord),
/* harmony export */   "fromRefinement": () => (/* binding */ fromRefinement),
/* harmony export */   "fromStruct": () => (/* binding */ fromStruct),
/* harmony export */   "fromSum": () => (/* binding */ fromSum),
/* harmony export */   "fromTuple": () => (/* binding */ fromTuple),
/* harmony export */   "fromType": () => (/* binding */ fromType),
/* harmony export */   "id": () => (/* binding */ id),
/* harmony export */   "intersect": () => (/* binding */ intersect),
/* harmony export */   "lazy": () => (/* binding */ lazy),
/* harmony export */   "literal": () => (/* binding */ literal),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "mapLeftWithInput": () => (/* binding */ mapLeftWithInput),
/* harmony export */   "nullable": () => (/* binding */ nullable),
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "refine": () => (/* binding */ refine),
/* harmony export */   "union": () => (/* binding */ union)
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
/* harmony export */   "intersect_": () => (/* binding */ intersect_),
/* harmony export */   "memoize": () => (/* binding */ memoize)
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLDhCQUE4QjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sNkJBQTZCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sNkJBQTZCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyw0QkFBNEI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtVQUNBLGlDQUFpQyxXQUFXO1VBQzVDO1VBQ0E7Ozs7O1VDUEE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOK0I7QUFDbUM7QUFDbUI7QUFDbEQ7QUFDbkM7QUFDQSxzQkFBc0IsaURBQVE7QUFDOUIsUUFBUSxpREFBUTtBQUNoQixVQUFVLGlEQUFRO0FBQ2xCLFVBQVUsaURBQVE7QUFDbEIsQ0FBQztBQUNELDJCQUEyQixnREFBTztBQUNsQztBQUNBLDRCQUE0QiwrQ0FBUTtBQUNwQyxZQUFZLE1BQU0sRUFBRSxnRUFBYTtBQUNqQyx1QkFBdUIsOENBQU87QUFDOUIsbUJBQW1CLDREQUFTO0FBQzVCLElBQUksZ0RBQVM7QUFDYixzQ0FBc0MsZ0NBQWdDO0FBQ3RFLDZDQUE2Qyw2REFBYztBQUMzRDtBQUNBLEtBQUs7QUFDTCxtQkFBbUIsa0RBQVc7QUFDOUIsbUNBQW1DLGdEQUFtQiw2QkFBNkIsZ0RBQW1CO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixnREFBbUI7QUFDckMsb0RBQW9ELGdEQUFtQjtBQUN2RSxRQUFRLGdEQUFtQixhQUFhLGlCQUFpQjtBQUN6RCxZQUFZLGdEQUFtQjtBQUMvQixRQUFRLGdEQUFtQjtBQUMzQjtBQUNBLFlBQVksZ0RBQW1CO0FBQy9CO0FBQ0EsWUFBWSxnREFBbUI7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSwrREFBWSxZQUFZLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvQXBwbGljYXRpdmUuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L0FwcGx5LmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2ZwLXRzL2VzNi9DaGFpbi5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvQ2hhaW5SZWMuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L0VpdGhlci5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvRnJvbUVpdGhlci5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvRnVuY3Rvci5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvU2VwYXJhdGVkLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2ZwLXRzL2VzNi9XaXRoZXJhYmxlLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2ZwLXRzL2VzNi9mdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9mcC10cy9lczYvaW50ZXJuYWwuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvZnAtdHMvZXM2L3BpcGVhYmxlLmpzIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vbm9kZV9tb2R1bGVzL2lvLXRzL2VzNi9EZWNvZGVFcnJvci5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9pby10cy9lczYvRGVjb2Rlci5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9pby10cy9lczYvRnJlZVNlbWlncm91cC5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC8uL25vZGVfbW9kdWxlcy9pby10cy9lczYvR3VhcmQuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvaW8tdHMvZXM2L0tsZWlzbGkuanMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvLi9ub2RlX21vZHVsZXMvaW8tdHMvZXM2L1NjaGVtYWJsZS5qcyIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC9leHRlcm5hbCB3aW5kb3cgXCJUaGlua2luZ0hvbWVVaVwiIiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wL2V4dGVybmFsIHdpbmRvdyBcInRoUmVhY3RcIiIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQHRoaW5raW5nLWhvbWUvcGx1Z2lucy10bXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9AdGhpbmtpbmctaG9tZS9wbHVnaW5zLXRtcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0B0aGlua2luZy1ob21lL3BsdWdpbnMtdG1wLy4vZnJvbnRlbmQvcGFnZTIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGBBcHBsaWNhdGl2ZWAgdHlwZSBjbGFzcyBleHRlbmRzIHRoZSBgQXBwbHlgIHR5cGUgY2xhc3Mgd2l0aCBhIGBvZmAgZnVuY3Rpb24sIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSB2YWx1ZXNcbiAqIG9mIHR5cGUgYGYgYWAgZnJvbSB2YWx1ZXMgb2YgdHlwZSBgYWAuXG4gKlxuICogV2hlcmUgYEFwcGx5YCBwcm92aWRlcyB0aGUgYWJpbGl0eSB0byBsaWZ0IGZ1bmN0aW9ucyBvZiB0d28gb3IgbW9yZSBhcmd1bWVudHMgdG8gZnVuY3Rpb25zIHdob3NlIGFyZ3VtZW50cyBhcmVcbiAqIHdyYXBwZWQgdXNpbmcgYGZgLCBhbmQgYEZ1bmN0b3JgIHByb3ZpZGVzIHRoZSBhYmlsaXR5IHRvIGxpZnQgZnVuY3Rpb25zIG9mIG9uZSBhcmd1bWVudCwgYHB1cmVgIGNhbiBiZSBzZWVuIGFzIHRoZVxuICogZnVuY3Rpb24gd2hpY2ggbGlmdHMgZnVuY3Rpb25zIG9mIF96ZXJvXyBhcmd1bWVudHMuIFRoYXQgaXMsIGBBcHBsaWNhdGl2ZWAgZnVuY3RvcnMgc3VwcG9ydCBhIGxpZnRpbmcgb3BlcmF0aW9uIGZvclxuICogYW55IG51bWJlciBvZiBmdW5jdGlvbiBhcmd1bWVudHMuXG4gKlxuICogSW5zdGFuY2VzIG11c3Qgc2F0aXNmeSB0aGUgZm9sbG93aW5nIGxhd3MgaW4gYWRkaXRpb24gdG8gdGhlIGBBcHBseWAgbGF3czpcbiAqXG4gKiAxLiBJZGVudGl0eTogYEEuYXAoQS5vZihhID0+IGEpLCBmYSkgPC0+IGZhYFxuICogMi4gSG9tb21vcnBoaXNtOiBgQS5hcChBLm9mKGFiKSwgQS5vZihhKSkgPC0+IEEub2YoYWIoYSkpYFxuICogMy4gSW50ZXJjaGFuZ2U6IGBBLmFwKGZhYiwgQS5vZihhKSkgPC0+IEEuYXAoQS5vZihhYiA9PiBhYihhKSksIGZhYilgXG4gKlxuICogTm90ZS4gYEZ1bmN0b3JgJ3MgYG1hcGAgY2FuIGJlIGRlcml2ZWQ6IGBBLm1hcCh4LCBmKSA9IEEuYXAoQS5vZihmKSwgeClgXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmltcG9ydCB7IGFwLCBnZXRBcHBseVNlbWlncm91cCB9IGZyb20gJy4vQXBwbHknO1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJy4vZnVuY3Rpb24nO1xuaW1wb3J0IHsgZ2V0RnVuY3RvckNvbXBvc2l0aW9uIH0gZnJvbSAnLi9GdW5jdG9yJztcbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGl2ZU1vbm9pZChGKSB7XG4gICAgdmFyIGYgPSBnZXRBcHBseVNlbWlncm91cChGKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKE0pIHsgcmV0dXJuICh7XG4gICAgICAgIGNvbmNhdDogZihNKS5jb25jYXQsXG4gICAgICAgIGVtcHR5OiBGLm9mKE0uZW1wdHkpXG4gICAgfSk7IH07XG59XG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGl2ZUNvbXBvc2l0aW9uKEYsIEcpIHtcbiAgICB2YXIgbWFwID0gZ2V0RnVuY3RvckNvbXBvc2l0aW9uKEYsIEcpLm1hcDtcbiAgICB2YXIgX2FwID0gYXAoRiwgRyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIG9mOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gRi5vZihHLm9mKGEpKTsgfSxcbiAgICAgICAgYXA6IGZ1bmN0aW9uIChmZ2FiLCBmZ2EpIHsgcmV0dXJuIHBpcGUoZmdhYiwgX2FwKGZnYSkpOyB9XG4gICAgfTtcbn1cbiIsIi8qKlxuICogVGhlIGBBcHBseWAgY2xhc3MgcHJvdmlkZXMgdGhlIGBhcGAgd2hpY2ggaXMgdXNlZCB0byBhcHBseSBhIGZ1bmN0aW9uIHRvIGFuIGFyZ3VtZW50IHVuZGVyIGEgdHlwZSBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBgQXBwbHlgIGNhbiBiZSB1c2VkIHRvIGxpZnQgZnVuY3Rpb25zIG9mIHR3byBvciBtb3JlIGFyZ3VtZW50cyB0byB3b3JrIG9uIHZhbHVlcyB3cmFwcGVkIHdpdGggdGhlIHR5cGUgY29uc3RydWN0b3JcbiAqIGBmYC5cbiAqXG4gKiBJbnN0YW5jZXMgbXVzdCBzYXRpc2Z5IHRoZSBmb2xsb3dpbmcgbGF3IGluIGFkZGl0aW9uIHRvIHRoZSBgRnVuY3RvcmAgbGF3czpcbiAqXG4gKiAxLiBBc3NvY2lhdGl2ZSBjb21wb3NpdGlvbjogYEYuYXAoRi5hcChGLm1hcChmYmMsIGJjID0+IGFiID0+IGEgPT4gYmMoYWIoYSkpKSwgZmFiKSwgZmEpIDwtPiBGLmFwKGZiYywgRi5hcChmYWIsIGZhKSlgXG4gKlxuICogRm9ybWFsbHksIGBBcHBseWAgcmVwcmVzZW50cyBhIHN0cm9uZyBsYXggc2VtaS1tb25vaWRhbCBlbmRvZnVuY3Rvci5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgTyBmcm9tICdmcC10cy9PcHRpb24nXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogY29uc3QgZiA9IChhOiBzdHJpbmcpID0+IChiOiBudW1iZXIpID0+IChjOiBib29sZWFuKSA9PiBhICsgU3RyaW5nKGIpICsgU3RyaW5nKGMpXG4gKiBjb25zdCBmYTogTy5PcHRpb248c3RyaW5nPiA9IE8uc29tZSgncycpXG4gKiBjb25zdCBmYjogTy5PcHRpb248bnVtYmVyPiA9IE8uc29tZSgxKVxuICogY29uc3QgZmM6IE8uT3B0aW9uPGJvb2xlYW4+ID0gTy5zb21lKHRydWUpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICAvLyBsaWZ0IGEgZnVuY3Rpb25cbiAqICAgICBPLnNvbWUoZiksXG4gKiAgICAgLy8gYXBwbHkgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiAgICAgTy5hcChmYSksXG4gKiAgICAgLy8gYXBwbHkgdGhlIHNlY29uZCBhcmd1bWVudFxuICogICAgIE8uYXAoZmIpLFxuICogICAgIC8vIGFwcGx5IHRoZSB0aGlyZCBhcmd1bWVudFxuICogICAgIE8uYXAoZmMpXG4gKiAgICksXG4gKiAgIE8uc29tZSgnczF0cnVlJylcbiAqIClcbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuaW1wb3J0IHsgdHVwbGUgfSBmcm9tICcuL2Z1bmN0aW9uJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnLi9pbnRlcm5hbCc7XG5leHBvcnQgZnVuY3Rpb24gYXAoRiwgRykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmYWIpIHtcbiAgICAgICAgICAgIHJldHVybiBGLmFwKEYubWFwKGZhYiwgZnVuY3Rpb24gKGdhYikgeyByZXR1cm4gZnVuY3Rpb24gKGdhKSB7IHJldHVybiBHLmFwKGdhYiwgZ2EpOyB9OyB9KSwgZmEpO1xuICAgICAgICB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYXBGaXJzdChBKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWNvbmQpIHsgcmV0dXJuIGZ1bmN0aW9uIChmaXJzdCkge1xuICAgICAgICByZXR1cm4gQS5hcChBLm1hcChmaXJzdCwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGE7IH07IH0pLCBzZWNvbmQpO1xuICAgIH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gYXBTZWNvbmQoQSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2Vjb25kKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZmlyc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBBLmFwKEEubWFwKGZpcnN0LCBmdW5jdGlvbiAoKSB7IHJldHVybiBmdW5jdGlvbiAoYikgeyByZXR1cm4gYjsgfTsgfSksIHNlY29uZCk7XG4gICAgICAgIH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhcFMoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSwgZmIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgICAgICAgICAgcmV0dXJuIEYuYXAoRi5tYXAoZmEsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYSwgKF9hID0ge30sIF9hW25hbWVdID0gYiwgX2EpKTtcbiAgICAgICAgICAgIH07IH0pLCBmYik7XG4gICAgICAgIH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBseVNlbWlncm91cChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChTKSB7IHJldHVybiAoe1xuICAgICAgICBjb25jYXQ6IGZ1bmN0aW9uIChmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgICAgICByZXR1cm4gRi5hcChGLm1hcChmaXJzdCwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIGZ1bmN0aW9uICh5KSB7IHJldHVybiBTLmNvbmNhdCh4LCB5KTsgfTsgfSksIHNlY29uZCk7XG4gICAgICAgIH1cbiAgICB9KTsgfTtcbn1cbmZ1bmN0aW9uIGN1cnJpZWQoZiwgbiwgYWNjKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHZhciBjb21iaW5lZCA9IEFycmF5KGFjYy5sZW5ndGggKyAxKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY2MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbWJpbmVkW2ldID0gYWNjW2ldO1xuICAgICAgICB9XG4gICAgICAgIGNvbWJpbmVkW2FjYy5sZW5ndGhdID0geDtcbiAgICAgICAgcmV0dXJuIG4gPT09IDAgPyBmLmFwcGx5KG51bGwsIGNvbWJpbmVkKSA6IGN1cnJpZWQoZiwgbiAtIDEsIGNvbWJpbmVkKTtcbiAgICB9O1xufVxudmFyIHR1cGxlQ29uc3RydWN0b3JzID0ge1xuICAgIDE6IGZ1bmN0aW9uIChhKSB7IHJldHVybiBbYV07IH0sXG4gICAgMjogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBbYSwgYl07IH07IH0sXG4gICAgMzogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBmdW5jdGlvbiAoYykgeyByZXR1cm4gW2EsIGIsIGNdOyB9OyB9OyB9LFxuICAgIDQ6IGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoYikgeyByZXR1cm4gZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGZ1bmN0aW9uIChkKSB7IHJldHVybiBbYSwgYiwgYywgZF07IH07IH07IH07IH0sXG4gICAgNTogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBmdW5jdGlvbiAoYykgeyByZXR1cm4gZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGZ1bmN0aW9uIChlKSB7IHJldHVybiBbYSwgYiwgYywgZCwgZV07IH07IH07IH07IH07IH1cbn07XG5mdW5jdGlvbiBnZXRUdXBsZUNvbnN0cnVjdG9yKGxlbikge1xuICAgIGlmICghXy5oYXMuY2FsbCh0dXBsZUNvbnN0cnVjdG9ycywgbGVuKSkge1xuICAgICAgICB0dXBsZUNvbnN0cnVjdG9yc1tsZW5dID0gY3VycmllZCh0dXBsZSwgbGVuIC0gMSwgW10pO1xuICAgIH1cbiAgICByZXR1cm4gdHVwbGVDb25zdHJ1Y3RvcnNbbGVuXTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZVQoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICAgICAgICB2YXIgZiA9IGdldFR1cGxlQ29uc3RydWN0b3IobGVuKTtcbiAgICAgICAgdmFyIGZhcyA9IEYubWFwKGFyZ3NbMF0sIGYpO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBmYXMgPSBGLmFwKGZhcywgYXJnc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhcztcbiAgICB9O1xufVxuZnVuY3Rpb24gZ2V0UmVjb3JkQ29uc3RydWN0b3Ioa2V5cykge1xuICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LCBfYVtrZXlzWzBdXSA9IGEsIF9hKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LCBfYVtrZXlzWzBdXSA9IGEsIF9hW2tleXNbMV1dID0gYiwgX2EpO1xuICAgICAgICAgICAgfTsgfTtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoYikgeyByZXR1cm4gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LCBfYVtrZXlzWzBdXSA9IGEsIF9hW2tleXNbMV1dID0gYiwgX2Fba2V5c1syXV0gPSBjLCBfYSk7XG4gICAgICAgICAgICB9OyB9OyB9O1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBmdW5jdGlvbiAoYykgeyByZXR1cm4gZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzBdXSA9IGEsXG4gICAgICAgICAgICAgICAgICAgIF9hW2tleXNbMV1dID0gYixcbiAgICAgICAgICAgICAgICAgICAgX2Fba2V5c1syXV0gPSBjLFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzNdXSA9IGQsXG4gICAgICAgICAgICAgICAgICAgIF9hKTtcbiAgICAgICAgICAgIH07IH07IH07IH07XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHsgcmV0dXJuIGZ1bmN0aW9uIChjKSB7IHJldHVybiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzBdXSA9IGEsXG4gICAgICAgICAgICAgICAgICAgIF9hW2tleXNbMV1dID0gYixcbiAgICAgICAgICAgICAgICAgICAgX2Fba2V5c1syXV0gPSBjLFxuICAgICAgICAgICAgICAgICAgICBfYVtrZXlzWzNdXSA9IGQsXG4gICAgICAgICAgICAgICAgICAgIF9hW2tleXNbNF1dID0gZSxcbiAgICAgICAgICAgICAgICAgICAgX2EpO1xuICAgICAgICAgICAgfTsgfTsgfTsgfTsgfTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBjdXJyaWVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHIgPSB7fTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJba2V5c1tpXV0gPSBhcmdzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH0sIGxlbiAtIDEsIFtdKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gc2VxdWVuY2VTKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhyKTtcbiAgICAgICAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgICAgICB2YXIgZiA9IGdldFJlY29yZENvbnN0cnVjdG9yKGtleXMpO1xuICAgICAgICB2YXIgZnIgPSBGLm1hcChyW2tleXNbMF1dLCBmKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgZnIgPSBGLmFwKGZyLCByW2tleXNbaV1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnI7XG4gICAgfTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjaGFpbkZpcnN0KE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmaXJzdCkgeyByZXR1cm4gTS5jaGFpbihmaXJzdCwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIE0ubWFwKGYoYSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGE7IH0pOyB9KTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBiaW5kKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5hbWUsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gTS5jaGFpbihtYSwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIE0ubWFwKGYoYSksIGZ1bmN0aW9uIChiKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGEsIChfYSA9IHt9LCBfYVtuYW1lXSA9IGIsIF9hKSk7XG4gICAgfSk7IH0pOyB9OyB9O1xufVxuIiwiLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciB0YWlsUmVjID0gZnVuY3Rpb24gKHN0YXJ0V2l0aCwgZikge1xuICAgIHZhciBhYiA9IGYoc3RhcnRXaXRoKTtcbiAgICB3aGlsZSAoYWIuX3RhZyA9PT0gJ0xlZnQnKSB7XG4gICAgICAgIGFiID0gZihhYi5sZWZ0KTtcbiAgICB9XG4gICAgcmV0dXJuIGFiLnJpZ2h0O1xufTtcbiIsImltcG9ydCB7IGdldEFwcGxpY2F0aXZlTW9ub2lkIH0gZnJvbSAnLi9BcHBsaWNhdGl2ZSc7XG5pbXBvcnQgeyBhcEZpcnN0IGFzIGFwRmlyc3RfLCBhcFMgYXMgYXBTXywgYXBTZWNvbmQgYXMgYXBTZWNvbmRfLCBnZXRBcHBseVNlbWlncm91cCBhcyBnZXRBcHBseVNlbWlncm91cF8gfSBmcm9tICcuL0FwcGx5JztcbmltcG9ydCB7IGJpbmQgYXMgYmluZF8sIGNoYWluRmlyc3QgYXMgY2hhaW5GaXJzdF8gfSBmcm9tICcuL0NoYWluJztcbmltcG9ydCB7IHRhaWxSZWMgfSBmcm9tICcuL0NoYWluUmVjJztcbmltcG9ydCB7IGNoYWluT3B0aW9uSyBhcyBjaGFpbk9wdGlvbktfLCBmaWx0ZXJPckVsc2UgYXMgZmlsdGVyT3JFbHNlXywgZnJvbU9wdGlvbiBhcyBmcm9tT3B0aW9uXywgZnJvbU9wdGlvbksgYXMgZnJvbU9wdGlvbktfLCBmcm9tUHJlZGljYXRlIGFzIGZyb21QcmVkaWNhdGVfIH0gZnJvbSAnLi9Gcm9tRWl0aGVyJztcbmltcG9ydCB7IGR1YWwsIGZsb3csIGlkZW50aXR5LCBwaXBlIH0gZnJvbSAnLi9mdW5jdGlvbic7XG5pbXBvcnQgeyBiaW5kVG8gYXMgYmluZFRvXywgZmxhcCBhcyBmbGFwXywgbGV0IGFzIGxldF9fIH0gZnJvbSAnLi9GdW5jdG9yJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnLi9pbnRlcm5hbCc7XG5pbXBvcnQgeyBzZXBhcmF0ZWQgfSBmcm9tICcuL1NlcGFyYXRlZCc7XG5pbXBvcnQgeyB3aWx0RGVmYXVsdCwgd2l0aGVyRGVmYXVsdCB9IGZyb20gJy4vV2l0aGVyYWJsZSc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdHJ1Y3RvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgRWl0aGVyYCBob2xkaW5nIGEgYExlZnRgIHZhbHVlLiBUaGlzIHVzdWFsbHkgcmVwcmVzZW50cyBhIGZhaWx1cmUsIGR1ZSB0byB0aGUgcmlnaHQtYmlhcyBvZiB0aGlzXG4gKiBzdHJ1Y3R1cmUuXG4gKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgbGVmdCA9IF8ubGVmdDtcbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgRWl0aGVyYCBob2xkaW5nIGEgYFJpZ2h0YCB2YWx1ZS4gVGhpcyB1c3VhbGx5IHJlcHJlc2VudHMgYSBzdWNjZXNzZnVsIHZhbHVlIGR1ZSB0byB0aGUgcmlnaHQgYmlhc1xuICogb2YgdGhpcyBzdHJ1Y3R1cmUuXG4gKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgcmlnaHQgPSBfLnJpZ2h0O1xuLyoqXG4gKiBAY2F0ZWdvcnkgc2VxdWVuY2luZ1xuICogQHNpbmNlIDIuMTQuMFxuICovXG5leHBvcnQgdmFyIGZsYXRNYXAgPSAvKiNfX1BVUkVfXyovIGR1YWwoMiwgZnVuY3Rpb24gKG1hLCBmKSB7IHJldHVybiAoaXNMZWZ0KG1hKSA/IG1hIDogZihtYS5yaWdodCkpOyB9KTtcbnZhciBfbWFwID0gZnVuY3Rpb24gKGZhLCBmKSB7IHJldHVybiBwaXBlKGZhLCBtYXAoZikpOyB9O1xudmFyIF9hcCA9IGZ1bmN0aW9uIChmYWIsIGZhKSB7IHJldHVybiBwaXBlKGZhYiwgYXAoZmEpKTsgfTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgX3JlZHVjZSA9IGZ1bmN0aW9uIChmYSwgYiwgZikgeyByZXR1cm4gcGlwZShmYSwgcmVkdWNlKGIsIGYpKTsgfTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgX2ZvbGRNYXAgPSBmdW5jdGlvbiAoTSkgeyByZXR1cm4gZnVuY3Rpb24gKGZhLCBmKSB7XG4gICAgdmFyIGZvbGRNYXBNID0gZm9sZE1hcChNKTtcbiAgICByZXR1cm4gcGlwZShmYSwgZm9sZE1hcE0oZikpO1xufTsgfTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgX3JlZHVjZVJpZ2h0ID0gZnVuY3Rpb24gKGZhLCBiLCBmKSB7IHJldHVybiBwaXBlKGZhLCByZWR1Y2VSaWdodChiLCBmKSk7IH07XG52YXIgX3RyYXZlcnNlID0gZnVuY3Rpb24gKEYpIHtcbiAgICB2YXIgdHJhdmVyc2VGID0gdHJhdmVyc2UoRik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YSwgZikgeyByZXR1cm4gcGlwZSh0YSwgdHJhdmVyc2VGKGYpKTsgfTtcbn07XG52YXIgX2JpbWFwID0gZnVuY3Rpb24gKGZhLCBmLCBnKSB7IHJldHVybiBwaXBlKGZhLCBiaW1hcChmLCBnKSk7IH07XG52YXIgX21hcExlZnQgPSBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIG1hcExlZnQoZikpOyB9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciBfYWx0ID0gZnVuY3Rpb24gKGZhLCB0aGF0KSB7IHJldHVybiBwaXBlKGZhLCBhbHQodGhhdCkpOyB9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciBfZXh0ZW5kID0gZnVuY3Rpb24gKHdhLCBmKSB7IHJldHVybiBwaXBlKHdhLCBleHRlbmQoZikpOyB9O1xudmFyIF9jaGFpblJlYyA9IGZ1bmN0aW9uIChhLCBmKSB7XG4gICAgcmV0dXJuIHRhaWxSZWMoZihhKSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVmdChlKSA/IHJpZ2h0KGxlZnQoZS5sZWZ0KSkgOiBpc0xlZnQoZS5yaWdodCkgPyBsZWZ0KGYoZS5yaWdodC5sZWZ0KSkgOiByaWdodChyaWdodChlLnJpZ2h0LnJpZ2h0KSk7XG4gICAgfSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgdHlwZSBsYW1iZGFzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBVUkkgPSAnRWl0aGVyJztcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0U2hvdyA9IGZ1bmN0aW9uIChTRSwgU0EpIHsgcmV0dXJuICh7XG4gICAgc2hvdzogZnVuY3Rpb24gKG1hKSB7IHJldHVybiAoaXNMZWZ0KG1hKSA/IFwibGVmdChcIi5jb25jYXQoU0Uuc2hvdyhtYS5sZWZ0KSwgXCIpXCIpIDogXCJyaWdodChcIi5jb25jYXQoU0Euc2hvdyhtYS5yaWdodCksIFwiKVwiKSk7IH1cbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRFcSA9IGZ1bmN0aW9uIChFTCwgRUEpIHsgcmV0dXJuICh7XG4gICAgZXF1YWxzOiBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4geCA9PT0geSB8fCAoaXNMZWZ0KHgpID8gaXNMZWZ0KHkpICYmIEVMLmVxdWFscyh4LmxlZnQsIHkubGVmdCkgOiBpc1JpZ2h0KHkpICYmIEVBLmVxdWFscyh4LnJpZ2h0LCB5LnJpZ2h0KSk7XG4gICAgfVxufSk7IH07XG4vKipcbiAqIFNlbWlncm91cCByZXR1cm5pbmcgdGhlIGxlZnQtbW9zdCBub24tYExlZnRgIHZhbHVlLiBJZiBib3RoIG9wZXJhbmRzIGFyZSBgUmlnaHRgcyB0aGVuIHRoZSBpbm5lciB2YWx1ZXMgYXJlXG4gKiBjb25jYXRlbmF0ZWQgdXNpbmcgdGhlIHByb3ZpZGVkIGBTZW1pZ3JvdXBgXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IGdldFNlbWlncm91cCwgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBTZW1pZ3JvdXBTdW0gfSBmcm9tICdmcC10cy9udW1iZXInXG4gKlxuICogY29uc3QgUyA9IGdldFNlbWlncm91cDxzdHJpbmcsIG51bWJlcj4oU2VtaWdyb3VwU3VtKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChsZWZ0KCdhJyksIGxlZnQoJ2InKSksIGxlZnQoJ2EnKSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoUy5jb25jYXQobGVmdCgnYScpLCByaWdodCgyKSksIHJpZ2h0KDIpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChyaWdodCgxKSwgbGVmdCgnYicpKSwgcmlnaHQoMSkpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMuY29uY2F0KHJpZ2h0KDEpLCByaWdodCgyKSksIHJpZ2h0KDMpKVxuICpcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGdldFNlbWlncm91cCA9IGZ1bmN0aW9uIChTKSB7IHJldHVybiAoe1xuICAgIGNvbmNhdDogZnVuY3Rpb24gKHgsIHkpIHsgcmV0dXJuIChpc0xlZnQoeSkgPyB4IDogaXNMZWZ0KHgpID8geSA6IHJpZ2h0KFMuY29uY2F0KHgucmlnaHQsIHkucmlnaHQpKSk7IH1cbn0pOyB9O1xuLyoqXG4gKiBCdWlsZHMgYSBgQ29tcGFjdGFibGVgIGluc3RhbmNlIGZvciBgRWl0aGVyYCBnaXZlbiBgTW9ub2lkYCBmb3IgdGhlIGxlZnQgc2lkZS5cbiAqXG4gKiBAY2F0ZWdvcnkgZmlsdGVyaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0Q29tcGFjdGFibGUgPSBmdW5jdGlvbiAoTSkge1xuICAgIHZhciBlbXB0eSA9IGxlZnQoTS5lbXB0eSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVVJJOiBVUkksXG4gICAgICAgIF9FOiB1bmRlZmluZWQsXG4gICAgICAgIGNvbXBhY3Q6IGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gKGlzTGVmdChtYSkgPyBtYSA6IG1hLnJpZ2h0Ll90YWcgPT09ICdOb25lJyA/IGVtcHR5IDogcmlnaHQobWEucmlnaHQudmFsdWUpKTsgfSxcbiAgICAgICAgc2VwYXJhdGU6IGZ1bmN0aW9uIChtYSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTGVmdChtYSlcbiAgICAgICAgICAgICAgICA/IHNlcGFyYXRlZChtYSwgbWEpXG4gICAgICAgICAgICAgICAgOiBpc0xlZnQobWEucmlnaHQpXG4gICAgICAgICAgICAgICAgICAgID8gc2VwYXJhdGVkKHJpZ2h0KG1hLnJpZ2h0LmxlZnQpLCBlbXB0eSlcbiAgICAgICAgICAgICAgICAgICAgOiBzZXBhcmF0ZWQoZW1wdHksIHJpZ2h0KG1hLnJpZ2h0LnJpZ2h0KSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbi8qKlxuICogQnVpbGRzIGEgYEZpbHRlcmFibGVgIGluc3RhbmNlIGZvciBgRWl0aGVyYCBnaXZlbiBgTW9ub2lkYCBmb3IgdGhlIGxlZnQgc2lkZVxuICpcbiAqIEBjYXRlZ29yeSBmaWx0ZXJpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRGaWx0ZXJhYmxlID0gZnVuY3Rpb24gKE0pIHtcbiAgICB2YXIgZW1wdHkgPSBsZWZ0KE0uZW1wdHkpO1xuICAgIHZhciBfYSA9IGdldENvbXBhY3RhYmxlKE0pLCBjb21wYWN0ID0gX2EuY29tcGFjdCwgc2VwYXJhdGUgPSBfYS5zZXBhcmF0ZTtcbiAgICB2YXIgZmlsdGVyID0gZnVuY3Rpb24gKG1hLCBwcmVkaWNhdGUpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVmdChtYSkgPyBtYSA6IHByZWRpY2F0ZShtYS5yaWdodCkgPyBtYSA6IGVtcHR5O1xuICAgIH07XG4gICAgdmFyIHBhcnRpdGlvbiA9IGZ1bmN0aW9uIChtYSwgcCkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKVxuICAgICAgICAgICAgPyBzZXBhcmF0ZWQobWEsIG1hKVxuICAgICAgICAgICAgOiBwKG1hLnJpZ2h0KVxuICAgICAgICAgICAgICAgID8gc2VwYXJhdGVkKGVtcHR5LCByaWdodChtYS5yaWdodCkpXG4gICAgICAgICAgICAgICAgOiBzZXBhcmF0ZWQocmlnaHQobWEucmlnaHQpLCBlbXB0eSk7XG4gICAgfTtcbiAgICByZXR1cm4ge1xuICAgICAgICBVUkk6IFVSSSxcbiAgICAgICAgX0U6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFwOiBfbWFwLFxuICAgICAgICBjb21wYWN0OiBjb21wYWN0LFxuICAgICAgICBzZXBhcmF0ZTogc2VwYXJhdGUsXG4gICAgICAgIGZpbHRlcjogZmlsdGVyLFxuICAgICAgICBmaWx0ZXJNYXA6IGZ1bmN0aW9uIChtYSwgZikge1xuICAgICAgICAgICAgaWYgKGlzTGVmdChtYSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb2IgPSBmKG1hLnJpZ2h0KTtcbiAgICAgICAgICAgIHJldHVybiBvYi5fdGFnID09PSAnTm9uZScgPyBlbXB0eSA6IHJpZ2h0KG9iLnZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcGFydGl0aW9uOiBwYXJ0aXRpb24sXG4gICAgICAgIHBhcnRpdGlvbk1hcDogZnVuY3Rpb24gKG1hLCBmKSB7XG4gICAgICAgICAgICBpZiAoaXNMZWZ0KG1hKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZXBhcmF0ZWQobWEsIG1hKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBlID0gZihtYS5yaWdodCk7XG4gICAgICAgICAgICByZXR1cm4gaXNMZWZ0KGUpID8gc2VwYXJhdGVkKHJpZ2h0KGUubGVmdCksIGVtcHR5KSA6IHNlcGFyYXRlZChlbXB0eSwgcmlnaHQoZS5yaWdodCkpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4vKipcbiAqIEJ1aWxkcyBgV2l0aGVyYWJsZWAgaW5zdGFuY2UgZm9yIGBFaXRoZXJgIGdpdmVuIGBNb25vaWRgIGZvciB0aGUgbGVmdCBzaWRlXG4gKlxuICogQGNhdGVnb3J5IGZpbHRlcmluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0V2l0aGVyYWJsZSA9IGZ1bmN0aW9uIChNKSB7XG4gICAgdmFyIEZfID0gZ2V0RmlsdGVyYWJsZShNKTtcbiAgICB2YXIgQyA9IGdldENvbXBhY3RhYmxlKE0pO1xuICAgIHJldHVybiB7XG4gICAgICAgIFVSSTogVVJJLFxuICAgICAgICBfRTogdW5kZWZpbmVkLFxuICAgICAgICBtYXA6IF9tYXAsXG4gICAgICAgIGNvbXBhY3Q6IEZfLmNvbXBhY3QsXG4gICAgICAgIHNlcGFyYXRlOiBGXy5zZXBhcmF0ZSxcbiAgICAgICAgZmlsdGVyOiBGXy5maWx0ZXIsXG4gICAgICAgIGZpbHRlck1hcDogRl8uZmlsdGVyTWFwLFxuICAgICAgICBwYXJ0aXRpb246IEZfLnBhcnRpdGlvbixcbiAgICAgICAgcGFydGl0aW9uTWFwOiBGXy5wYXJ0aXRpb25NYXAsXG4gICAgICAgIHRyYXZlcnNlOiBfdHJhdmVyc2UsXG4gICAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSxcbiAgICAgICAgcmVkdWNlOiBfcmVkdWNlLFxuICAgICAgICBmb2xkTWFwOiBfZm9sZE1hcCxcbiAgICAgICAgcmVkdWNlUmlnaHQ6IF9yZWR1Y2VSaWdodCxcbiAgICAgICAgd2l0aGVyOiB3aXRoZXJEZWZhdWx0KFRyYXZlcnNhYmxlLCBDKSxcbiAgICAgICAgd2lsdDogd2lsdERlZmF1bHQoVHJhdmVyc2FibGUsIEMpXG4gICAgfTtcbn07XG4vKipcbiAqIFRoZSBkZWZhdWx0IFtgQXBwbGljYXRpdmVgXSgjYXBwbGljYXRpdmUpIGluc3RhbmNlIHJldHVybnMgdGhlIGZpcnN0IGVycm9yLCBpZiB5b3Ugd2FudCB0b1xuICogZ2V0IGFsbCBlcnJvcnMgeW91IG5lZWQgdG8gcHJvdmlkZSBhIHdheSB0byBjb25jYXRlbmF0ZSB0aGVtIHZpYSBhIGBTZW1pZ3JvdXBgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBBIGZyb20gJ2ZwLXRzL0FwcGx5J1xuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBTIGZyb20gJ2ZwLXRzL1NlbWlncm91cCdcbiAqIGltcG9ydCAqIGFzIHN0cmluZyBmcm9tICdmcC10cy9zdHJpbmcnXG4gKlxuICogY29uc3QgcGFyc2VTdHJpbmcgPSAodTogdW5rbm93bik6IEUuRWl0aGVyPHN0cmluZywgc3RyaW5nPiA9PlxuICogICB0eXBlb2YgdSA9PT0gJ3N0cmluZycgPyBFLnJpZ2h0KHUpIDogRS5sZWZ0KCdub3QgYSBzdHJpbmcnKVxuICpcbiAqIGNvbnN0IHBhcnNlTnVtYmVyID0gKHU6IHVua25vd24pOiBFLkVpdGhlcjxzdHJpbmcsIG51bWJlcj4gPT5cbiAqICAgdHlwZW9mIHUgPT09ICdudW1iZXInID8gRS5yaWdodCh1KSA6IEUubGVmdCgnbm90IGEgbnVtYmVyJylcbiAqXG4gKiBpbnRlcmZhY2UgUGVyc29uIHtcbiAqICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nXG4gKiAgIHJlYWRvbmx5IGFnZTogbnVtYmVyXG4gKiB9XG4gKlxuICogY29uc3QgcGFyc2VQZXJzb24gPSAoXG4gKiAgIGlucHV0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICogKTogRS5FaXRoZXI8c3RyaW5nLCBQZXJzb24+ID0+XG4gKiAgIHBpcGUoXG4gKiAgICAgRS5EbyxcbiAqICAgICBFLmFwUygnbmFtZScsIHBhcnNlU3RyaW5nKGlucHV0Lm5hbWUpKSxcbiAqICAgICBFLmFwUygnYWdlJywgcGFyc2VOdW1iZXIoaW5wdXQuYWdlKSlcbiAqICAgKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwocGFyc2VQZXJzb24oe30pLCBFLmxlZnQoJ25vdCBhIHN0cmluZycpKSAvLyA8PSBmaXJzdCBlcnJvclxuICpcbiAqIGNvbnN0IEFwcGxpY2F0aXZlID0gRS5nZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb24oXG4gKiAgIHBpcGUoc3RyaW5nLlNlbWlncm91cCwgUy5pbnRlcmNhbGF0ZSgnLCAnKSlcbiAqIClcbiAqXG4gKiBjb25zdCBhcFMgPSBBLmFwUyhBcHBsaWNhdGl2ZSlcbiAqXG4gKiBjb25zdCBwYXJzZVBlcnNvbkFsbCA9IChcbiAqICAgaW5wdXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gKiApOiBFLkVpdGhlcjxzdHJpbmcsIFBlcnNvbj4gPT5cbiAqICAgcGlwZShcbiAqICAgICBFLkRvLFxuICogICAgIGFwUygnbmFtZScsIHBhcnNlU3RyaW5nKGlucHV0Lm5hbWUpKSxcbiAqICAgICBhcFMoJ2FnZScsIHBhcnNlTnVtYmVyKGlucHV0LmFnZSkpXG4gKiAgIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKHBhcnNlUGVyc29uQWxsKHt9KSwgRS5sZWZ0KCdub3QgYSBzdHJpbmcsIG5vdCBhIG51bWJlcicpKSAvLyA8PSBhbGwgZXJyb3JzXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBnZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb24gPSBmdW5jdGlvbiAoU0UpIHsgcmV0dXJuICh7XG4gICAgVVJJOiBVUkksXG4gICAgX0U6IHVuZGVmaW5lZCxcbiAgICBtYXA6IF9tYXAsXG4gICAgYXA6IGZ1bmN0aW9uIChmYWIsIGZhKSB7XG4gICAgICAgIHJldHVybiBpc0xlZnQoZmFiKVxuICAgICAgICAgICAgPyBpc0xlZnQoZmEpXG4gICAgICAgICAgICAgICAgPyBsZWZ0KFNFLmNvbmNhdChmYWIubGVmdCwgZmEubGVmdCkpXG4gICAgICAgICAgICAgICAgOiBmYWJcbiAgICAgICAgICAgIDogaXNMZWZ0KGZhKVxuICAgICAgICAgICAgICAgID8gZmFcbiAgICAgICAgICAgICAgICA6IHJpZ2h0KGZhYi5yaWdodChmYS5yaWdodCkpO1xuICAgIH0sXG4gICAgb2Y6IG9mXG59KTsgfTtcbi8qKlxuICogVGhlIGRlZmF1bHQgW2BBbHRgXSgjYWx0KSBpbnN0YW5jZSByZXR1cm5zIHRoZSBsYXN0IGVycm9yLCBpZiB5b3Ugd2FudCB0b1xuICogZ2V0IGFsbCBlcnJvcnMgeW91IG5lZWQgdG8gcHJvdmlkZSBhIHdheSB0byBjb25jYXRlbmF0ZSB0aGVtIHZpYSBhIGBTZW1pZ3JvdXBgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIFMgZnJvbSAnZnAtdHMvU2VtaWdyb3VwJ1xuICogaW1wb3J0ICogYXMgc3RyaW5nIGZyb20gJ2ZwLXRzL3N0cmluZydcbiAqXG4gKiBjb25zdCBwYXJzZVN0cmluZyA9ICh1OiB1bmtub3duKTogRS5FaXRoZXI8c3RyaW5nLCBzdHJpbmc+ID0+XG4gKiAgIHR5cGVvZiB1ID09PSAnc3RyaW5nJyA/IEUucmlnaHQodSkgOiBFLmxlZnQoJ25vdCBhIHN0cmluZycpXG4gKlxuICogY29uc3QgcGFyc2VOdW1iZXIgPSAodTogdW5rbm93bik6IEUuRWl0aGVyPHN0cmluZywgbnVtYmVyPiA9PlxuICogICB0eXBlb2YgdSA9PT0gJ251bWJlcicgPyBFLnJpZ2h0KHUpIDogRS5sZWZ0KCdub3QgYSBudW1iZXInKVxuICpcbiAqIGNvbnN0IHBhcnNlID0gKHU6IHVua25vd24pOiBFLkVpdGhlcjxzdHJpbmcsIHN0cmluZyB8IG51bWJlcj4gPT5cbiAqICAgcGlwZShcbiAqICAgICBwYXJzZVN0cmluZyh1KSxcbiAqICAgICBFLmFsdDxzdHJpbmcsIHN0cmluZyB8IG51bWJlcj4oKCkgPT4gcGFyc2VOdW1iZXIodSkpXG4gKiAgIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKHBhcnNlKHRydWUpLCBFLmxlZnQoJ25vdCBhIG51bWJlcicpKSAvLyA8PSBsYXN0IGVycm9yXG4gKlxuICogY29uc3QgQWx0ID0gRS5nZXRBbHRWYWxpZGF0aW9uKHBpcGUoc3RyaW5nLlNlbWlncm91cCwgUy5pbnRlcmNhbGF0ZSgnLCAnKSkpXG4gKlxuICogY29uc3QgcGFyc2VBbGwgPSAodTogdW5rbm93bik6IEUuRWl0aGVyPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPiA9PlxuICogICBBbHQuYWx0PHN0cmluZyB8IG51bWJlcj4ocGFyc2VTdHJpbmcodSksICgpID0+IHBhcnNlTnVtYmVyKHUpKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwocGFyc2VBbGwodHJ1ZSksIEUubGVmdCgnbm90IGEgc3RyaW5nLCBub3QgYSBudW1iZXInKSkgLy8gPD0gYWxsIGVycm9yc1xuICpcbiAqIEBjYXRlZ29yeSBlcnJvciBoYW5kbGluZ1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0QWx0VmFsaWRhdGlvbiA9IGZ1bmN0aW9uIChTRSkgeyByZXR1cm4gKHtcbiAgICBVUkk6IFVSSSxcbiAgICBfRTogdW5kZWZpbmVkLFxuICAgIG1hcDogX21hcCxcbiAgICBhbHQ6IGZ1bmN0aW9uIChtZSwgdGhhdCkge1xuICAgICAgICBpZiAoaXNSaWdodChtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBtZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZWEgPSB0aGF0KCk7XG4gICAgICAgIHJldHVybiBpc0xlZnQoZWEpID8gbGVmdChTRS5jb25jYXQobWUubGVmdCwgZWEubGVmdCkpIDogZWE7XG4gICAgfVxufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBtYXBwaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBtYXAgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGlzTGVmdChmYSkgPyBmYSA6IHJpZ2h0KGYoZmEucmlnaHQpKTtcbn07IH07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIEZ1bmN0b3IgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBfbWFwXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBvZiA9IHJpZ2h0O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgUG9pbnRlZCA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBvZjogb2Zcbn07XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BhcGBdKCNhcCkuXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIGVycm9yIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBzaW5jZSAyLjguMFxuICovXG5leHBvcnQgdmFyIGFwVyA9IGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gZnVuY3Rpb24gKGZhYikge1xuICAgIHJldHVybiBpc0xlZnQoZmFiKSA/IGZhYiA6IGlzTGVmdChmYSkgPyBmYSA6IHJpZ2h0KGZhYi5yaWdodChmYS5yaWdodCkpO1xufTsgfTtcbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgYXAgPSBhcFc7XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBBcHBseSA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICBtYXA6IF9tYXAsXG4gICAgYXA6IF9hcFxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgQXBwbGljYXRpdmUgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBfbWFwLFxuICAgIGFwOiBfYXAsXG4gICAgb2Y6IG9mXG59O1xuLyoqXG4gKiBBbGlhcyBvZiBgZmxhdE1hcGAuXG4gKlxuICogQGNhdGVnb3J5IHNlcXVlbmNpbmdcbiAqIEBzaW5jZSAyLjYuMFxuICovXG5leHBvcnQgdmFyIGNoYWluVyA9IGZsYXRNYXA7XG4vKipcbiAqIEFsaWFzIG9mIGBmbGF0TWFwYC5cbiAqXG4gKiBAY2F0ZWdvcnkgc2VxdWVuY2luZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgY2hhaW4gPSBmbGF0TWFwO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgQ2hhaW4gPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBfbWFwLFxuICAgIGFwOiBfYXAsXG4gICAgY2hhaW46IGZsYXRNYXBcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIE1vbmFkID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcCxcbiAgICBhcDogX2FwLFxuICAgIG9mOiBvZixcbiAgICBjaGFpbjogZmxhdE1hcFxufTtcbi8qKlxuICogTGVmdC1hc3NvY2lhdGl2ZSBmb2xkIG9mIGEgc3RydWN0dXJlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBzdGFydFdpdGggPSAncHJlZml4J1xuICogY29uc3QgY29uY2F0ID0gKGE6IHN0cmluZywgYjogc3RyaW5nKSA9PiBgJHthfToke2J9YFxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodCgnYScpLCBFLnJlZHVjZShzdGFydFdpdGgsIGNvbmNhdCkpLFxuICogICAncHJlZml4OmEnXG4gKiApXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLmxlZnQoJ2UnKSwgRS5yZWR1Y2Uoc3RhcnRXaXRoLCBjb25jYXQpKSxcbiAqICAgJ3ByZWZpeCdcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgZm9sZGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgcmVkdWNlID0gZnVuY3Rpb24gKGIsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgIHJldHVybiBpc0xlZnQoZmEpID8gYiA6IGYoYiwgZmEucmlnaHQpO1xufTsgfTtcbi8qKlxuICogTWFwIGVhY2ggZWxlbWVudCBvZiB0aGUgc3RydWN0dXJlIHRvIGEgbW9ub2lkLCBhbmQgY29tYmluZSB0aGUgcmVzdWx0cy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgKiBhcyBTIGZyb20gJ2ZwLXRzL3N0cmluZydcbiAqXG4gKiBjb25zdCB5ZWxsID0gKGE6IHN0cmluZykgPT4gYCR7YX0hYFxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodCgnYScpLCBFLmZvbGRNYXAoUy5Nb25vaWQpKHllbGwpKSxcbiAqICAgJ2EhJ1xuICogKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5sZWZ0KCdlJyksIEUuZm9sZE1hcChTLk1vbm9pZCkoeWVsbCkpLFxuICogICBTLk1vbm9pZC5lbXB0eVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBmb2xkaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBmb2xkTWFwID0gZnVuY3Rpb24gKE0pIHsgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICByZXR1cm4gaXNMZWZ0KGZhKSA/IE0uZW1wdHkgOiBmKGZhLnJpZ2h0KTtcbn07IH07IH07XG4vKipcbiAqIFJpZ2h0LWFzc29jaWF0aXZlIGZvbGQgb2YgYSBzdHJ1Y3R1cmUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICpcbiAqIGNvbnN0IHN0YXJ0V2l0aCA9ICdwb3N0Zml4J1xuICogY29uc3QgY29uY2F0ID0gKGE6IHN0cmluZywgYjogc3RyaW5nKSA9PiBgJHthfToke2J9YFxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodCgnYScpLCBFLnJlZHVjZVJpZ2h0KHN0YXJ0V2l0aCwgY29uY2F0KSksXG4gKiAgICdhOnBvc3RmaXgnXG4gKiApXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLmxlZnQoJ2UnKSwgRS5yZWR1Y2VSaWdodChzdGFydFdpdGgsIGNvbmNhdCkpLFxuICogICAncG9zdGZpeCdcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgZm9sZGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgcmVkdWNlUmlnaHQgPSBmdW5jdGlvbiAoYiwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGlzTGVmdChmYSkgPyBiIDogZihmYS5yaWdodCwgYik7XG59OyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBGb2xkYWJsZSA9IHtcbiAgICBVUkk6IFVSSSxcbiAgICByZWR1Y2U6IF9yZWR1Y2UsXG4gICAgZm9sZE1hcDogX2ZvbGRNYXAsXG4gICAgcmVkdWNlUmlnaHQ6IF9yZWR1Y2VSaWdodFxufTtcbi8qKlxuICogTWFwIGVhY2ggZWxlbWVudCBvZiBhIHN0cnVjdHVyZSB0byBhbiBhY3Rpb24sIGV2YWx1YXRlIHRoZXNlIGFjdGlvbnMgZnJvbSBsZWZ0IHRvIHJpZ2h0LCBhbmQgY29sbGVjdCB0aGUgcmVzdWx0cy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgUkEgZnJvbSAnZnAtdHMvUmVhZG9ubHlBcnJheSdcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0ICogYXMgTyBmcm9tICdmcC10cy9PcHRpb24nXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KFsnYSddKSwgRS50cmF2ZXJzZShPLkFwcGxpY2F0aXZlKShSQS5oZWFkKSksXG4gKiAgIE8uc29tZShFLnJpZ2h0KCdhJykpXG4gKiAgKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodChbXSksIEUudHJhdmVyc2UoTy5BcHBsaWNhdGl2ZSkoUkEuaGVhZCkpLFxuICogICBPLm5vbmVcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgdHJhdmVyc2luZ1xuICogQHNpbmNlIDIuNi4zXG4gKi9cbmV4cG9ydCB2YXIgdHJhdmVyc2UgPSBmdW5jdGlvbiAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHRhKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMZWZ0KHRhKSA/IEYub2YobGVmdCh0YS5sZWZ0KSkgOiBGLm1hcChmKHRhLnJpZ2h0KSwgcmlnaHQpO1xuICAgICAgICB9O1xuICAgIH07XG59O1xuLyoqXG4gKiBFdmFsdWF0ZSBlYWNoIG1vbmFkaWMgYWN0aW9uIGluIHRoZSBzdHJ1Y3R1cmUgZnJvbSBsZWZ0IHRvIHJpZ2h0LCBhbmQgY29sbGVjdCB0aGUgcmVzdWx0cy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgKiBhcyBPIGZyb20gJ2ZwLXRzL09wdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUucmlnaHQoTy5zb21lKCdhJykpLCBFLnNlcXVlbmNlKE8uQXBwbGljYXRpdmUpKSxcbiAqICAgTy5zb21lKEUucmlnaHQoJ2EnKSlcbiAqICApXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KE8ubm9uZSksIEUuc2VxdWVuY2UoTy5BcHBsaWNhdGl2ZSkpLFxuICogICBPLm5vbmVcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgdHJhdmVyc2luZ1xuICogQHNpbmNlIDIuNi4zXG4gKi9cbmV4cG9ydCB2YXIgc2VxdWVuY2UgPSBmdW5jdGlvbiAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVmdChtYSkgPyBGLm9mKGxlZnQobWEubGVmdCkpIDogRi5tYXAobWEucmlnaHQsIHJpZ2h0KTtcbiAgICB9O1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgVHJhdmVyc2FibGUgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBfbWFwLFxuICAgIHJlZHVjZTogX3JlZHVjZSxcbiAgICBmb2xkTWFwOiBfZm9sZE1hcCxcbiAgICByZWR1Y2VSaWdodDogX3JlZHVjZVJpZ2h0LFxuICAgIHRyYXZlcnNlOiBfdHJhdmVyc2UsXG4gICAgc2VxdWVuY2U6IHNlcXVlbmNlXG59O1xuLyoqXG4gKiBNYXAgYSBwYWlyIG9mIGZ1bmN0aW9ucyBvdmVyIHRoZSB0d28gdHlwZSBhcmd1bWVudHMgb2YgdGhlIGJpZnVuY3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgbWFwcGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgYmltYXAgPSBmdW5jdGlvbiAoZiwgZykgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGlzTGVmdChmYSkgPyBsZWZ0KGYoZmEubGVmdCkpIDogcmlnaHQoZyhmYS5yaWdodCkpO1xufTsgfTtcbi8qKlxuICogTWFwIGEgZnVuY3Rpb24gb3ZlciB0aGUgZmlyc3QgdHlwZSBhcmd1bWVudCBvZiBhIGJpZnVuY3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgZXJyb3IgaGFuZGxpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIG1hcExlZnQgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGlzTGVmdChmYSkgPyBsZWZ0KGYoZmEubGVmdCkpIDogZmE7XG59OyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBCaWZ1bmN0b3IgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgYmltYXA6IF9iaW1hcCxcbiAgICBtYXBMZWZ0OiBfbWFwTGVmdFxufTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGFsdGBdKCNhbHQpLlxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciBhbmQgdGhlIHJldHVybiB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgZXJyb3IgaGFuZGxpbmdcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnQgdmFyIGFsdFcgPSBmdW5jdGlvbiAodGhhdCkgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGlzTGVmdChmYSkgPyB0aGF0KCkgOiBmYTtcbn07IH07XG4vKipcbiAqIElkZW50aWZpZXMgYW4gYXNzb2NpYXRpdmUgb3BlcmF0aW9uIG9uIGEgdHlwZSBjb25zdHJ1Y3Rvci4gSXQgaXMgc2ltaWxhciB0byBgU2VtaWdyb3VwYCwgZXhjZXB0IHRoYXQgaXQgYXBwbGllcyB0b1xuICogdHlwZXMgb2Yga2luZCBgKiAtPiAqYC5cbiAqXG4gKiBJbiBjYXNlIG9mIGBFaXRoZXJgIHJldHVybnMgdGhlIGxlZnQtbW9zdCBub24tYExlZnRgIHZhbHVlIChvciB0aGUgcmlnaHQtbW9zdCBgTGVmdGAgdmFsdWUgaWYgYm90aCB2YWx1ZXMgYXJlIGBMZWZ0YCkuXG4gKlxuICogfCB4ICAgICAgICB8IHkgICAgICAgIHwgcGlwZSh4LCBhbHQoKCkgPT4geSkgfFxuICogfCAtLS0tLS0tLSB8IC0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBsZWZ0KGEpICB8IGxlZnQoYikgIHwgbGVmdChiKSAgICAgICAgICAgICAgfFxuICogfCBsZWZ0KGEpICB8IHJpZ2h0KDIpIHwgcmlnaHQoMikgICAgICAgICAgICAgfFxuICogfCByaWdodCgxKSB8IGxlZnQoYikgIHwgcmlnaHQoMSkgICAgICAgICAgICAgfFxuICogfCByaWdodCgxKSB8IHJpZ2h0KDIpIHwgcmlnaHQoMSkgICAgICAgICAgICAgfFxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIEUubGVmdCgnYScpLFxuICogICAgIEUuYWx0KCgpID0+IEUubGVmdCgnYicpKVxuICogICApLFxuICogICBFLmxlZnQoJ2InKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBFLmxlZnQoJ2EnKSxcbiAqICAgICBFLmFsdCgoKSA9PiBFLnJpZ2h0KDIpKVxuICogICApLFxuICogICBFLnJpZ2h0KDIpXG4gKiApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIEUucmlnaHQoMSksXG4gKiAgICAgRS5hbHQoKCkgPT4gRS5sZWZ0KCdiJykpXG4gKiAgICksXG4gKiAgIEUucmlnaHQoMSlcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgRS5yaWdodCgxKSxcbiAqICAgICBFLmFsdCgoKSA9PiBFLnJpZ2h0KDIpKVxuICogICApLFxuICogICBFLnJpZ2h0KDEpXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBhbHQgPSBhbHRXO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBBbHQgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBfbWFwLFxuICAgIGFsdDogX2FsdFxufTtcbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZXh0ZW5kID0gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uICh3YSkge1xuICAgIHJldHVybiBpc0xlZnQod2EpID8gd2EgOiByaWdodChmKHdhKSk7XG59OyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IHZhciBFeHRlbmQgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBfbWFwLFxuICAgIGV4dGVuZDogX2V4dGVuZFxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCB2YXIgQ2hhaW5SZWMgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBfbWFwLFxuICAgIGFwOiBfYXAsXG4gICAgY2hhaW46IGZsYXRNYXAsXG4gICAgY2hhaW5SZWM6IF9jaGFpblJlY1xufTtcbi8qKlxuICogQHNpbmNlIDIuNi4zXG4gKi9cbmV4cG9ydCB2YXIgdGhyb3dFcnJvciA9IGxlZnQ7XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIE1vbmFkVGhyb3cgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBfbWFwLFxuICAgIGFwOiBfYXAsXG4gICAgb2Y6IG9mLFxuICAgIGNoYWluOiBmbGF0TWFwLFxuICAgIHRocm93RXJyb3I6IHRocm93RXJyb3Jcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBGcm9tRWl0aGVyID0ge1xuICAgIFVSSTogVVJJLFxuICAgIGZyb21FaXRoZXI6IGlkZW50aXR5XG59O1xuLyoqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZnJvbVByZWRpY2F0ZSwgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICAxLFxuICogICAgIGZyb21QcmVkaWNhdGUoXG4gKiAgICAgICAobikgPT4gbiA+IDAsXG4gKiAgICAgICAoKSA9PiAnZXJyb3InXG4gKiAgICAgKVxuICogICApLFxuICogICByaWdodCgxKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICAtMSxcbiAqICAgICBmcm9tUHJlZGljYXRlKFxuICogICAgICAgKG4pID0+IG4gPiAwLFxuICogICAgICAgKCkgPT4gJ2Vycm9yJ1xuICogICAgIClcbiAqICAgKSxcbiAqICAgbGVmdCgnZXJyb3InKVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBsaWZ0aW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBmcm9tUHJlZGljYXRlID0gLyojX19QVVJFX18qLyBmcm9tUHJlZGljYXRlXyhGcm9tRWl0aGVyKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbnZlcnNpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIE8gZnJvbSAnZnAtdHMvT3B0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgTy5zb21lKDEpLFxuICogICAgIEUuZnJvbU9wdGlvbigoKSA9PiAnZXJyb3InKVxuICogICApLFxuICogICBFLnJpZ2h0KDEpXG4gKiApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIE8ubm9uZSxcbiAqICAgICBFLmZyb21PcHRpb24oKCkgPT4gJ2Vycm9yJylcbiAqICAgKSxcbiAqICAgRS5sZWZ0KCdlcnJvcicpXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGNvbnZlcnNpb25zXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBmcm9tT3B0aW9uID0gXG4vKiNfX1BVUkVfXyovIGZyb21PcHRpb25fKEZyb21FaXRoZXIpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcmVmaW5lbWVudHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVpdGhlciBpcyBhbiBpbnN0YW5jZSBvZiBgTGVmdGAsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICpcbiAqIEBjYXRlZ29yeSByZWZpbmVtZW50c1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgaXNMZWZ0ID0gXy5pc0xlZnQ7XG4vKipcbiAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBlaXRoZXIgaXMgYW4gaW5zdGFuY2Ugb2YgYFJpZ2h0YCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKlxuICogQGNhdGVnb3J5IHJlZmluZW1lbnRzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBpc1JpZ2h0ID0gXy5pc1JpZ2h0O1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgbWF0Y2hgXSgjbWF0Y2gpLlxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBoYW5kbGVyIHJldHVybiB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgcGF0dGVybiBtYXRjaGluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIG1hdGNoVyA9IGZ1bmN0aW9uIChvbkxlZnQsIG9uUmlnaHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG1hKSB7XG4gICAgICAgIHJldHVybiBpc0xlZnQobWEpID8gb25MZWZ0KG1hLmxlZnQpIDogb25SaWdodChtYS5yaWdodCk7XG4gICAgfTtcbn07XG4vKipcbiAqIEFsaWFzIG9mIFtgbWF0Y2hXYF0oI21hdGNodykuXG4gKlxuICogQGNhdGVnb3J5IHBhdHRlcm4gbWF0Y2hpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBmb2xkVyA9IG1hdGNoVztcbi8qKlxuICogVGFrZXMgdHdvIGZ1bmN0aW9ucyBhbmQgYW4gYEVpdGhlcmAgdmFsdWUsIGlmIHRoZSB2YWx1ZSBpcyBhIGBMZWZ0YCB0aGUgaW5uZXIgdmFsdWUgaXMgYXBwbGllZCB0byB0aGUgZmlyc3QgZnVuY3Rpb24sXG4gKiBpZiB0aGUgdmFsdWUgaXMgYSBgUmlnaHRgIHRoZSBpbm5lciB2YWx1ZSBpcyBhcHBsaWVkIHRvIHRoZSBzZWNvbmQgZnVuY3Rpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IG1hdGNoLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBmdW5jdGlvbiBvbkxlZnQoZXJyb3JzOiBBcnJheTxzdHJpbmc+KTogc3RyaW5nIHtcbiAqICAgcmV0dXJuIGBFcnJvcnM6ICR7ZXJyb3JzLmpvaW4oJywgJyl9YFxuICogfVxuICpcbiAqIGZ1bmN0aW9uIG9uUmlnaHQodmFsdWU6IG51bWJlcik6IHN0cmluZyB7XG4gKiAgIHJldHVybiBgT2s6ICR7dmFsdWV9YFxuICogfVxuICpcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICByaWdodCgxKSxcbiAqICAgICBtYXRjaChvbkxlZnQsIG9uUmlnaHQpXG4gKiAgICksXG4gKiAgICdPazogMSdcbiAqIClcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBsZWZ0KFsnZXJyb3IgMScsICdlcnJvciAyJ10pLFxuICogICAgIG1hdGNoKG9uTGVmdCwgb25SaWdodClcbiAqICAgKSxcbiAqICAgJ0Vycm9yczogZXJyb3IgMSwgZXJyb3IgMidcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgcGF0dGVybiBtYXRjaGluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIG1hdGNoID0gbWF0Y2hXO1xuLyoqXG4gKiBBbGlhcyBvZiBbYG1hdGNoYF0oI21hdGNoKS5cbiAqXG4gKiBAY2F0ZWdvcnkgcGF0dGVybiBtYXRjaGluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZm9sZCA9IG1hdGNoO1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgZ2V0T3JFbHNlYF0oI2dldG9yZWxzZSkuXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIGhhbmRsZXIgcmV0dXJuIHR5cGUgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi42LjBcbiAqL1xuZXhwb3J0IHZhciBnZXRPckVsc2VXID0gZnVuY3Rpb24gKG9uTGVmdCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVmdChtYSkgPyBvbkxlZnQobWEubGVmdCkgOiBtYS5yaWdodDtcbiAgICB9O1xufTtcbi8qKlxuICogUmV0dXJucyB0aGUgd3JhcHBlZCB2YWx1ZSBpZiBpdCdzIGEgYFJpZ2h0YCBvciBhIGRlZmF1bHQgdmFsdWUgaWYgaXMgYSBgTGVmdGAuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IGdldE9yRWxzZSwgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICByaWdodCgxKSxcbiAqICAgICBnZXRPckVsc2UoKCkgPT4gMClcbiAqICAgKSxcbiAqICAgMVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBsZWZ0KCdlcnJvcicpLFxuICogICAgIGdldE9yRWxzZSgoKSA9PiAwKVxuICogICApLFxuICogICAwXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRPckVsc2UgPSBnZXRPckVsc2VXO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gY29tYmluYXRvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IG1hcHBpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBmbGFwID0gLyojX19QVVJFX18qLyBmbGFwXyhGdW5jdG9yKTtcbi8qKlxuICogQ29tYmluZSB0d28gZWZmZWN0ZnVsIGFjdGlvbnMsIGtlZXBpbmcgb25seSB0aGUgcmVzdWx0IG9mIHRoZSBmaXJzdC5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBhcEZpcnN0ID0gLyojX19QVVJFX18qLyBhcEZpcnN0XyhBcHBseSk7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BhcEZpcnN0YF0oI2FwZmlyc3QpXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIGVycm9yIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBzaW5jZSAyLjEyLjBcbiAqL1xuZXhwb3J0IHZhciBhcEZpcnN0VyA9IGFwRmlyc3Q7XG4vKipcbiAqIENvbWJpbmUgdHdvIGVmZmVjdGZ1bCBhY3Rpb25zLCBrZWVwaW5nIG9ubHkgdGhlIHJlc3VsdCBvZiB0aGUgc2Vjb25kLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGFwU2Vjb25kID0gLyojX19QVVJFX18qLyBhcFNlY29uZF8oQXBwbHkpO1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgYXBTZWNvbmRgXSgjYXBzZWNvbmQpXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIGVycm9yIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBzaW5jZSAyLjEyLjBcbiAqL1xuZXhwb3J0IHZhciBhcFNlY29uZFcgPSBhcFNlY29uZDtcbi8qKlxuICogQ29tcG9zZXMgY29tcHV0YXRpb25zIGluIHNlcXVlbmNlLCB1c2luZyB0aGUgcmV0dXJuIHZhbHVlIG9mIG9uZSBjb21wdXRhdGlvbiB0byBkZXRlcm1pbmUgdGhlIG5leHQgY29tcHV0YXRpb24gYW5kXG4gKiBrZWVwaW5nIG9ubHkgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QuXG4gKlxuICogQGNhdGVnb3J5IHNlcXVlbmNpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGNoYWluRmlyc3QgPSBcbi8qI19fUFVSRV9fKi8gY2hhaW5GaXJzdF8oQ2hhaW4pO1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgY2hhaW5GaXJzdGBdKCNjaGFpbmZpcnN0KVxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgc2VxdWVuY2luZ1xuICogQHNpbmNlIDIuOC4wXG4gKi9cbmV4cG9ydCB2YXIgY2hhaW5GaXJzdFcgPSBjaGFpbkZpcnN0O1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgZmxhdHRlbmBdKCNmbGF0dGVuKS5cbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgZXJyb3IgdHlwZXMgd2lsbCBiZSBtZXJnZWQuXG4gKlxuICogQGNhdGVnb3J5IHNlcXVlbmNpbmdcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciBmbGF0dGVuVyA9IFxuLyojX19QVVJFX18qLyBjaGFpblcoaWRlbnRpdHkpO1xuLyoqXG4gKiBUaGUgYGZsYXR0ZW5gIGZ1bmN0aW9uIGlzIHRoZSBjb252ZW50aW9uYWwgbW9uYWQgam9pbiBvcGVyYXRvci4gSXQgaXMgdXNlZCB0byByZW1vdmUgb25lIGxldmVsIG9mIG1vbmFkaWMgc3RydWN0dXJlLCBwcm9qZWN0aW5nIGl0cyBib3VuZCBhcmd1bWVudCBpbnRvIHRoZSBvdXRlciBsZXZlbC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChFLmZsYXR0ZW4oRS5yaWdodChFLnJpZ2h0KCdhJykpKSwgRS5yaWdodCgnYScpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChFLmZsYXR0ZW4oRS5yaWdodChFLmxlZnQoJ2UnKSkpLCBFLmxlZnQoJ2UnKSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoRS5mbGF0dGVuKEUubGVmdCgnZScpKSwgRS5sZWZ0KCdlJykpXG4gKlxuICogQGNhdGVnb3J5IHNlcXVlbmNpbmdcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGZsYXR0ZW4gPSBmbGF0dGVuVztcbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZHVwbGljYXRlID0gLyojX19QVVJFX18qLyBleHRlbmQoaWRlbnRpdHkpO1xuLyoqXG4gKiBAY2F0ZWdvcnkgbGlmdGluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIGZyb21PcHRpb25LID0gXG4vKiNfX1BVUkVfXyovIGZyb21PcHRpb25LXyhGcm9tRWl0aGVyKTtcbi8qKlxuICogQGNhdGVnb3J5IHNlcXVlbmNpbmdcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciBjaGFpbk9wdGlvbksgPSAvKiNfX1BVUkVfXyovIGNoYWluT3B0aW9uS18oRnJvbUVpdGhlciwgQ2hhaW4pO1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgY2hhaW5PcHRpb25LYF0oI2NoYWlub3B0aW9uaykuXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIGVycm9yIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBjYXRlZ29yeSBzZXF1ZW5jaW5nXG4gKiBAc2luY2UgMi4xMy4yXG4gKi9cbmV4cG9ydCB2YXIgY2hhaW5PcHRpb25LVyA9IC8qI19fUFVSRV9fKi8gY2hhaW5PcHRpb25LO1xuLyoqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBFLnJpZ2h0KDEpLFxuICogICAgIEUuZmlsdGVyT3JFbHNlKFxuICogICAgICAgKG4pID0+IG4gPiAwLFxuICogICAgICAgKCkgPT4gJ2Vycm9yJ1xuICogICAgIClcbiAqICAgKSxcbiAqICAgRS5yaWdodCgxKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBFLnJpZ2h0KC0xKSxcbiAqICAgICBFLmZpbHRlck9yRWxzZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIEUubGVmdCgnZXJyb3InKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBFLmxlZnQoJ2EnKSxcbiAqICAgICBFLmZpbHRlck9yRWxzZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIEUubGVmdCgnYScpXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGZpbHRlcmluZ1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZmlsdGVyT3JFbHNlID0gLyojX19QVVJFX18qLyBmaWx0ZXJPckVsc2VfKEZyb21FaXRoZXIsIENoYWluKTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGZpbHRlck9yRWxzZWBdKCNmaWx0ZXJvcmVsc2UpLlxuICpcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgZmlsdGVyaW5nXG4gKiBAc2luY2UgMi45LjBcbiAqL1xuZXhwb3J0IHZhciBmaWx0ZXJPckVsc2VXID0gZmlsdGVyT3JFbHNlO1xuLyoqXG4gKiBSZXR1cm5zIGEgYFJpZ2h0YCBpZiBpcyBhIGBMZWZ0YCAoYW5kIHZpY2UgdmVyc2EpLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIHN3YXAgPSBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIChpc0xlZnQobWEpID8gcmlnaHQobWEubGVmdCkgOiBsZWZ0KG1hLnJpZ2h0KSk7IH07XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BvckVsc2VgXSgjb3JlbHNlKS5cbiAqXG4gKiBUaGUgYFdgIHN1ZmZpeCAoc2hvcnQgZm9yICoqVyoqaWRlbmluZykgbWVhbnMgdGhhdCB0aGUgcmV0dXJuIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBjYXRlZ29yeSBlcnJvciBoYW5kbGluZ1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIG9yRWxzZVcgPSBmdW5jdGlvbiAob25MZWZ0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKSA/IG9uTGVmdChtYS5sZWZ0KSA6IG1hO1xuICAgIH07XG59O1xuLyoqXG4gKiBVc2VmdWwgZm9yIHJlY292ZXJpbmcgZnJvbSBlcnJvcnMuXG4gKlxuICogQGNhdGVnb3J5IGVycm9yIGhhbmRsaW5nXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBvckVsc2UgPSBvckVsc2VXO1xuLyoqXG4gKiBUYWtlcyBhIGRlZmF1bHQgYW5kIGEgbnVsbGFibGUgdmFsdWUsIGlmIHRoZSB2YWx1ZSBpcyBub3QgbnVsbHksIHR1cm4gaXQgaW50byBhIGBSaWdodGAsIGlmIHRoZSB2YWx1ZSBpcyBudWxseSB1c2VcbiAqIHRoZSBwcm92aWRlZCBkZWZhdWx0IGFzIGEgYExlZnRgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBmcm9tTnVsbGFibGUsIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICpcbiAqIGNvbnN0IHBhcnNlID0gZnJvbU51bGxhYmxlKCdudWxseScpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwYXJzZSgxKSwgcmlnaHQoMSkpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKHBhcnNlKG51bGwpLCBsZWZ0KCdudWxseScpKVxuICpcbiAqIEBjYXRlZ29yeSBjb252ZXJzaW9uc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgZnJvbU51bGxhYmxlID0gZnVuY3Rpb24gKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIGEgPT0gbnVsbCA/IGxlZnQoZSkgOiByaWdodChhKTtcbiAgICB9O1xufTtcbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgRWl0aGVyYCBmcm9tIGEgZnVuY3Rpb24gdGhhdCBtaWdodCB0aHJvdy5cbiAqXG4gKiBTZWUgYWxzbyBbYHRyeUNhdGNoS2BdKCN0cnljYXRjaGspLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCB1bnNhZmVIZWFkID0gPEE+KGFzOiBSZWFkb25seUFycmF5PEE+KTogQSA9PiB7XG4gKiAgIGlmIChhcy5sZW5ndGggPiAwKSB7XG4gKiAgICAgcmV0dXJuIGFzWzBdXG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgdGhyb3cgbmV3IEVycm9yKCdlbXB0eSBhcnJheScpXG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBoZWFkID0gPEE+KGFzOiBSZWFkb25seUFycmF5PEE+KTogRS5FaXRoZXI8RXJyb3IsIEE+ID0+XG4gKiAgIEUudHJ5Q2F0Y2goKCkgPT4gdW5zYWZlSGVhZChhcyksIGUgPT4gKGUgaW5zdGFuY2VvZiBFcnJvciA/IGUgOiBuZXcgRXJyb3IoJ3Vua25vd24gZXJyb3InKSkpXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChoZWFkKFtdKSwgRS5sZWZ0KG5ldyBFcnJvcignZW1wdHkgYXJyYXknKSkpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKGhlYWQoWzEsIDIsIDNdKSwgRS5yaWdodCgxKSlcbiAqXG4gKiBAY2F0ZWdvcnkgaW50ZXJvcFxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgdHJ5Q2F0Y2ggPSBmdW5jdGlvbiAoZiwgb25UaHJvdykge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiByaWdodChmKCkpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gbGVmdChvblRocm93KGUpKTtcbiAgICB9XG59O1xuLyoqXG4gKiBDb252ZXJ0cyBhIGZ1bmN0aW9uIHRoYXQgbWF5IHRocm93IHRvIG9uZSByZXR1cm5pbmcgYSBgRWl0aGVyYC5cbiAqXG4gKiBAY2F0ZWdvcnkgaW50ZXJvcFxuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIHRyeUNhdGNoSyA9IGZ1bmN0aW9uIChmLCBvblRocm93KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ5Q2F0Y2goZnVuY3Rpb24gKCkgeyByZXR1cm4gZi5hcHBseSh2b2lkIDAsIGEpOyB9LCBvblRocm93KTtcbiAgICB9O1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGxpZnRpbmdcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnQgdmFyIGZyb21OdWxsYWJsZUsgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBmcm9tID0gZnJvbU51bGxhYmxlKGUpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZmxvdyhmLCBmcm9tKTsgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBzZXF1ZW5jaW5nXG4gKiBAc2luY2UgMi45LjBcbiAqL1xuZXhwb3J0IHZhciBjaGFpbk51bGxhYmxlSyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGZyb20gPSBmcm9tTnVsbGFibGVLKGUpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gY2hhaW4oZnJvbShmKSk7IH07XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29udmVyc2lvbnNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciB0b1VuaW9uID0gLyojX19QVVJFX18qLyBmb2xkVyhpZGVudGl0eSwgaWRlbnRpdHkpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gdXRpbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogRGVmYXVsdCB2YWx1ZSBmb3IgdGhlIGBvbkVycm9yYCBhcmd1bWVudCBvZiBgdHJ5Q2F0Y2hgXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0Vycm9yKGUpIHtcbiAgICByZXR1cm4gZSBpbnN0YW5jZW9mIEVycm9yID8gZSA6IG5ldyBFcnJvcihTdHJpbmcoZSkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGVsZW0oRSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSwgbWEpIHtcbiAgICAgICAgaWYgKG1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBlbGVtRV8xID0gZWxlbShFKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIGVsZW1FXzEoYSwgbWEpOyB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0xlZnQobWEpID8gZmFsc2UgOiBFLmVxdWFscyhhLCBtYS5yaWdodCk7XG4gICAgfTtcbn1cbi8qKlxuICogUmV0dXJucyBgZmFsc2VgIGlmIGBMZWZ0YCBvciByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGFwcGxpY2F0aW9uIG9mIHRoZSBnaXZlbiBwcmVkaWNhdGUgdG8gdGhlIGBSaWdodGAgdmFsdWUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IGV4aXN0cywgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKlxuICogY29uc3QgZ3QyID0gZXhpc3RzKChuOiBudW1iZXIpID0+IG4gPiAyKVxuICpcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChndDIobGVmdCgnYScpKSwgZmFsc2UpXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoZ3QyKHJpZ2h0KDEpKSwgZmFsc2UpXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoZ3QyKHJpZ2h0KDMpKSwgdHJ1ZSlcbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBleGlzdHMgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgICAgICByZXR1cm4gaXNMZWZ0KG1hKSA/IGZhbHNlIDogcHJlZGljYXRlKG1hLnJpZ2h0KTtcbiAgICB9O1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGRvIG5vdGF0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBkbyBub3RhdGlvblxuICogQHNpbmNlIDIuOS4wXG4gKi9cbmV4cG9ydCB2YXIgRG8gPSAvKiNfX1BVUkVfXyovIG9mKF8uZW1wdHlSZWNvcmQpO1xuLyoqXG4gKiBAY2F0ZWdvcnkgZG8gbm90YXRpb25cbiAqIEBzaW5jZSAyLjguMFxuICovXG5leHBvcnQgdmFyIGJpbmRUbyA9IC8qI19fUFVSRV9fKi8gYmluZFRvXyhGdW5jdG9yKTtcbnZhciBsZXRfID0gLyojX19QVVJFX18qLyBsZXRfXyhGdW5jdG9yKTtcbmV4cG9ydCB7IFxuLyoqXG4gKiBAY2F0ZWdvcnkgZG8gbm90YXRpb25cbiAqIEBzaW5jZSAyLjEzLjBcbiAqL1xubGV0XyBhcyBsZXQgfTtcbi8qKlxuICogQGNhdGVnb3J5IGRvIG5vdGF0aW9uXG4gKiBAc2luY2UgMi44LjBcbiAqL1xuZXhwb3J0IHZhciBiaW5kID0gLyojX19QVVJFX18qLyBiaW5kXyhDaGFpbik7XG4vKipcbiAqIFRoZSBgV2Agc3VmZml4IChzaG9ydCBmb3IgKipXKippZGVuaW5nKSBtZWFucyB0aGF0IHRoZSBlcnJvciB0eXBlcyB3aWxsIGJlIG1lcmdlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgZG8gbm90YXRpb25cbiAqIEBzaW5jZSAyLjguMFxuICovXG5leHBvcnQgdmFyIGJpbmRXID0gYmluZDtcbi8qKlxuICogQGNhdGVnb3J5IGRvIG5vdGF0aW9uXG4gKiBAc2luY2UgMi44LjBcbiAqL1xuZXhwb3J0IHZhciBhcFMgPSAvKiNfX1BVUkVfXyovIGFwU18oQXBwbHkpO1xuLyoqXG4gKiBMZXNzIHN0cmljdCB2ZXJzaW9uIG9mIFtgYXBTYF0oI2FwcykuXG4gKlxuICogVGhlIGBXYCBzdWZmaXggKHNob3J0IGZvciAqKlcqKmlkZW5pbmcpIG1lYW5zIHRoYXQgdGhlIGVycm9yIHR5cGVzIHdpbGwgYmUgbWVyZ2VkLlxuICpcbiAqIEBjYXRlZ29yeSBkbyBub3RhdGlvblxuICogQHNpbmNlIDIuOC4wXG4gKi9cbmV4cG9ydCB2YXIgYXBTVyA9IGFwUztcbi8qKlxuICogQHNpbmNlIDIuMTEuMFxuICovXG5leHBvcnQgdmFyIEFwVCA9IC8qI19fUFVSRV9fKi8gb2YoXy5lbXB0eVJlYWRvbmx5QXJyYXkpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gYXJyYXkgdXRpbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogRXF1aXZhbGVudCB0byBgUmVhZG9ubHlOb25FbXB0eUFycmF5I3RyYXZlcnNlV2l0aEluZGV4KEFwcGxpY2F0aXZlKWAuXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciB0cmF2ZXJzZVJlYWRvbmx5Tm9uRW1wdHlBcnJheVdpdGhJbmRleCA9IGZ1bmN0aW9uIChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcykge1xuICAgICAgICB2YXIgZSA9IGYoMCwgXy5oZWFkKGFzKSk7XG4gICAgICAgIGlmIChpc0xlZnQoZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvdXQgPSBbZS5yaWdodF07XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlXzEgPSBmKGksIGFzW2ldKTtcbiAgICAgICAgICAgIGlmIChpc0xlZnQoZV8xKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlXzE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQucHVzaChlXzEucmlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByaWdodChvdXQpO1xuICAgIH07XG59O1xuLyoqXG4gKiBFcXVpdmFsZW50IHRvIGBSZWFkb25seUFycmF5I3RyYXZlcnNlV2l0aEluZGV4KEFwcGxpY2F0aXZlKWAuXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciB0cmF2ZXJzZVJlYWRvbmx5QXJyYXlXaXRoSW5kZXggPSBmdW5jdGlvbiAoZikge1xuICAgIHZhciBnID0gdHJhdmVyc2VSZWFkb25seU5vbkVtcHR5QXJyYXlXaXRoSW5kZXgoZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcykgeyByZXR1cm4gKF8uaXNOb25FbXB0eShhcykgPyBnKGFzKSA6IEFwVCk7IH07XG59O1xuLyoqXG4gKiBFcXVpdmFsZW50IHRvIGBSZWFkb25seUFycmF5I3RyYXZlcnNlV2l0aEluZGV4KEFwcGxpY2F0aXZlKWAuXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnQgdmFyIHRyYXZlcnNlQXJyYXlXaXRoSW5kZXggPSB0cmF2ZXJzZVJlYWRvbmx5QXJyYXlXaXRoSW5kZXg7XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gYFJlYWRvbmx5QXJyYXkjdHJhdmVyc2UoQXBwbGljYXRpdmUpYC5cbiAqXG4gKiBAY2F0ZWdvcnkgdHJhdmVyc2luZ1xuICogQHNpbmNlIDIuOS4wXG4gKi9cbmV4cG9ydCB2YXIgdHJhdmVyc2VBcnJheSA9IGZ1bmN0aW9uIChmKSB7IHJldHVybiB0cmF2ZXJzZVJlYWRvbmx5QXJyYXlXaXRoSW5kZXgoZnVuY3Rpb24gKF8sIGEpIHsgcmV0dXJuIGYoYSk7IH0pOyB9O1xuLyoqXG4gKiBFcXVpdmFsZW50IHRvIGBSZWFkb25seUFycmF5I3NlcXVlbmNlKEFwcGxpY2F0aXZlKWAuXG4gKlxuICogQGNhdGVnb3J5IHRyYXZlcnNpbmdcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnQgdmFyIHNlcXVlbmNlQXJyYXkgPSBcbi8qI19fUFVSRV9fKi8gdHJhdmVyc2VBcnJheShpZGVudGl0eSk7XG4vKipcbiAqIFVzZSBbYHBhcnNlYF0oLi9Kc29uLnRzLmh0bWwjcGFyc2UpIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSlNPTihzLCBvbkVycm9yKSB7XG4gICAgcmV0dXJuIHRyeUNhdGNoKGZ1bmN0aW9uICgpIHsgcmV0dXJuIEpTT04ucGFyc2Uocyk7IH0sIG9uRXJyb3IpO1xufVxuLyoqXG4gKiBVc2UgW2BzdHJpbmdpZnlgXSguL0pzb24udHMuaHRtbCNzdHJpbmdpZnkpIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciBzdHJpbmdpZnlKU09OID0gZnVuY3Rpb24gKHUsIG9uRXJyb3IpIHtcbiAgICByZXR1cm4gdHJ5Q2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcyA9IEpTT04uc3RyaW5naWZ5KHUpO1xuICAgICAgICBpZiAodHlwZW9mIHMgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnZlcnRpbmcgdW5zdXBwb3J0ZWQgc3RydWN0dXJlIHRvIEpTT04nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcztcbiAgICB9LCBvbkVycm9yKTtcbn07XG4vKipcbiAqIFRoaXMgaW5zdGFuY2UgaXMgZGVwcmVjYXRlZCwgdXNlIHNtYWxsLCBzcGVjaWZpYyBpbnN0YW5jZXMgaW5zdGVhZC5cbiAqIEZvciBleGFtcGxlIGlmIGEgZnVuY3Rpb24gbmVlZHMgYSBgRnVuY3RvcmAgaW5zdGFuY2UsIHBhc3MgYEUuRnVuY3RvcmAgaW5zdGVhZCBvZiBgRS5laXRoZXJgXG4gKiAod2hlcmUgYEVgIGlzIGZyb20gYGltcG9ydCBFIGZyb20gJ2ZwLXRzL0VpdGhlcidgKVxuICpcbiAqIEBjYXRlZ29yeSB6b25lIG9mIGRlYXRoXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZWl0aGVyID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcCxcbiAgICBvZjogb2YsXG4gICAgYXA6IF9hcCxcbiAgICBjaGFpbjogZmxhdE1hcCxcbiAgICByZWR1Y2U6IF9yZWR1Y2UsXG4gICAgZm9sZE1hcDogX2ZvbGRNYXAsXG4gICAgcmVkdWNlUmlnaHQ6IF9yZWR1Y2VSaWdodCxcbiAgICB0cmF2ZXJzZTogX3RyYXZlcnNlLFxuICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSxcbiAgICBiaW1hcDogX2JpbWFwLFxuICAgIG1hcExlZnQ6IF9tYXBMZWZ0LFxuICAgIGFsdDogX2FsdCxcbiAgICBleHRlbmQ6IF9leHRlbmQsXG4gICAgY2hhaW5SZWM6IF9jaGFpblJlYyxcbiAgICB0aHJvd0Vycm9yOiB0aHJvd0Vycm9yXG59O1xuLyoqXG4gKiBVc2UgW2BnZXRBcHBseVNlbWlncm91cGBdKC4vQXBwbHkudHMuaHRtbCNnZXRhcHBseXNlbWlncm91cCkgaW5zdGVhZC5cbiAqXG4gKiBTZW1pZ3JvdXAgcmV0dXJuaW5nIHRoZSBsZWZ0LW1vc3QgYExlZnRgIHZhbHVlLiBJZiBib3RoIG9wZXJhbmRzIGFyZSBgUmlnaHRgcyB0aGVuIHRoZSBpbm5lciB2YWx1ZXNcbiAqIGFyZSBjb25jYXRlbmF0ZWQgdXNpbmcgdGhlIHByb3ZpZGVkIGBTZW1pZ3JvdXBgXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciBnZXRBcHBseVNlbWlncm91cCA9IFxuLyojX19QVVJFX18qLyBnZXRBcHBseVNlbWlncm91cF8oQXBwbHkpO1xuLyoqXG4gKiBVc2UgW2BnZXRBcHBsaWNhdGl2ZU1vbm9pZGBdKC4vQXBwbGljYXRpdmUudHMuaHRtbCNnZXRhcHBsaWNhdGl2ZW1vbm9pZCkgaW5zdGVhZC5cbiAqXG4gKiBAY2F0ZWdvcnkgem9uZSBvZiBkZWF0aFxuICogQHNpbmNlIDIuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgdmFyIGdldEFwcGx5TW9ub2lkID0gXG4vKiNfX1BVUkVfXyovIGdldEFwcGxpY2F0aXZlTW9ub2lkKEFwcGxpY2F0aXZlKTtcbi8qKlxuICogVXNlIFtgZ2V0QXBwbHlTZW1pZ3JvdXBgXSguL0FwcGx5LnRzLmh0bWwjZ2V0YXBwbHlzZW1pZ3JvdXApIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciBnZXRWYWxpZGF0aW9uU2VtaWdyb3VwID0gZnVuY3Rpb24gKFNFLCBTQSkge1xuICAgIHJldHVybiBnZXRBcHBseVNlbWlncm91cF8oZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uKFNFKSkoU0EpO1xufTtcbi8qKlxuICogVXNlIFtgZ2V0QXBwbGljYXRpdmVNb25vaWRgXSguL0FwcGxpY2F0aXZlLnRzLmh0bWwjZ2V0YXBwbGljYXRpdmVtb25vaWQpIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciBnZXRWYWxpZGF0aW9uTW9ub2lkID0gZnVuY3Rpb24gKFNFLCBNQSkge1xuICAgIHJldHVybiBnZXRBcHBsaWNhdGl2ZU1vbm9pZChnZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb24oU0UpKShNQSk7XG59O1xuLyoqXG4gKiBVc2UgW2BnZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb25gXSgjZ2V0YXBwbGljYXRpdmV2YWxpZGF0aW9uKSBhbmQgW2BnZXRBbHRWYWxpZGF0aW9uYF0oI2dldGFsdHZhbGlkYXRpb24pIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbGlkYXRpb24oU0UpIHtcbiAgICB2YXIgYXAgPSBnZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb24oU0UpLmFwO1xuICAgIHZhciBhbHQgPSBnZXRBbHRWYWxpZGF0aW9uKFNFKS5hbHQ7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVVJJOiBVUkksXG4gICAgICAgIF9FOiB1bmRlZmluZWQsXG4gICAgICAgIG1hcDogX21hcCxcbiAgICAgICAgb2Y6IG9mLFxuICAgICAgICBjaGFpbjogZmxhdE1hcCxcbiAgICAgICAgYmltYXA6IF9iaW1hcCxcbiAgICAgICAgbWFwTGVmdDogX21hcExlZnQsXG4gICAgICAgIHJlZHVjZTogX3JlZHVjZSxcbiAgICAgICAgZm9sZE1hcDogX2ZvbGRNYXAsXG4gICAgICAgIHJlZHVjZVJpZ2h0OiBfcmVkdWNlUmlnaHQsXG4gICAgICAgIGV4dGVuZDogX2V4dGVuZCxcbiAgICAgICAgdHJhdmVyc2U6IF90cmF2ZXJzZSxcbiAgICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlLFxuICAgICAgICBjaGFpblJlYzogX2NoYWluUmVjLFxuICAgICAgICB0aHJvd0Vycm9yOiB0aHJvd0Vycm9yLFxuICAgICAgICBhcDogYXAsXG4gICAgICAgIGFsdDogYWx0XG4gICAgfTtcbn1cbiIsIi8qKlxuICogVGhlIGBGcm9tRWl0aGVyYCB0eXBlIGNsYXNzIHJlcHJlc2VudHMgdGhvc2UgZGF0YSB0eXBlcyB3aGljaCBzdXBwb3J0IGVycm9ycy5cbiAqXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmltcG9ydCB7IGNoYWluRmlyc3QgfSBmcm9tICcuL0NoYWluJztcbmltcG9ydCB7IGZsb3cgfSBmcm9tICcuL2Z1bmN0aW9uJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnLi9pbnRlcm5hbCc7XG5leHBvcnQgZnVuY3Rpb24gZnJvbU9wdGlvbihGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbk5vbmUpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gRi5mcm9tRWl0aGVyKF8uaXNOb25lKG1hKSA/IF8ubGVmdChvbk5vbmUoKSkgOiBfLnJpZ2h0KG1hLnZhbHVlKSk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbVByZWRpY2F0ZShGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwcmVkaWNhdGUsIG9uRmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gRi5mcm9tRWl0aGVyKHByZWRpY2F0ZShhKSA/IF8ucmlnaHQoYSkgOiBfLmxlZnQob25GYWxzZShhKSkpO1xuICAgICAgICB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbU9wdGlvbksoRikge1xuICAgIHZhciBmcm9tT3B0aW9uRiA9IGZyb21PcHRpb24oRik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbk5vbmUpIHtcbiAgICAgICAgdmFyIGZyb20gPSBmcm9tT3B0aW9uRihvbk5vbmUpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZsb3coZiwgZnJvbSk7IH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjaGFpbk9wdGlvbksoRiwgTSkge1xuICAgIHZhciBmcm9tT3B0aW9uS0YgPSBmcm9tT3B0aW9uSyhGKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uTm9uZSkge1xuICAgICAgICB2YXIgZnJvbSA9IGZyb21PcHRpb25LRihvbk5vbmUpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gTS5jaGFpbihtYSwgZnJvbShmKSk7IH07IH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRWl0aGVySyhGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmbG93KGYsIEYuZnJvbUVpdGhlcik7IH07XG59XG5leHBvcnQgZnVuY3Rpb24gY2hhaW5FaXRoZXJLKEYsIE0pIHtcbiAgICB2YXIgZnJvbUVpdGhlcktGID0gZnJvbUVpdGhlcksoRik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIE0uY2hhaW4obWEsIGZyb21FaXRoZXJLRihmKSk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gY2hhaW5GaXJzdEVpdGhlcksoRiwgTSkge1xuICAgIHJldHVybiBmbG93KGZyb21FaXRoZXJLKEYpLCBjaGFpbkZpcnN0KE0pKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJPckVsc2UoRiwgTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocHJlZGljYXRlLCBvbkZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgICAgIHJldHVybiBNLmNoYWluKG1hLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gRi5mcm9tRWl0aGVyKHByZWRpY2F0ZShhKSA/IF8ucmlnaHQoYSkgOiBfLmxlZnQob25GYWxzZShhKSkpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9O1xufVxuIiwiLyoqXG4gKiBBIGBGdW5jdG9yYCBpcyBhIHR5cGUgY29uc3RydWN0b3Igd2hpY2ggc3VwcG9ydHMgYSBtYXBwaW5nIG9wZXJhdGlvbiBgbWFwYC5cbiAqXG4gKiBgbWFwYCBjYW4gYmUgdXNlZCB0byB0dXJuIGZ1bmN0aW9ucyBgYSAtPiBiYCBpbnRvIGZ1bmN0aW9ucyBgZiBhIC0+IGYgYmAgd2hvc2UgYXJndW1lbnQgYW5kIHJldHVybiB0eXBlcyB1c2UgdGhlIHR5cGVcbiAqIGNvbnN0cnVjdG9yIGBmYCB0byByZXByZXNlbnQgc29tZSBjb21wdXRhdGlvbmFsIGNvbnRleHQuXG4gKlxuICogSW5zdGFuY2VzIG11c3Qgc2F0aXNmeSB0aGUgZm9sbG93aW5nIGxhd3M6XG4gKlxuICogMS4gSWRlbnRpdHk6IGBGLm1hcChmYSwgYSA9PiBhKSA8LT4gZmFgXG4gKiAyLiBDb21wb3NpdGlvbjogYEYubWFwKGZhLCBhID0+IGJjKGFiKGEpKSkgPC0+IEYubWFwKEYubWFwKGZhLCBhYiksIGJjKWBcbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJy4vZnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIG1hcChGLCBHKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYubWFwKGZhLCBmdW5jdGlvbiAoZ2EpIHsgcmV0dXJuIEcubWFwKGdhLCBmKTsgfSk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmxhcChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBmdW5jdGlvbiAoZmFiKSB7IHJldHVybiBGLm1hcChmYWIsIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmKGEpOyB9KTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBiaW5kVG8oRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLm1hcChmYSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0ge30sIF9hW25hbWVdID0gYSwgX2EpO1xuICAgIH0pOyB9OyB9O1xufVxuZnVuY3Rpb24gbGV0XyhGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lLCBmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYubWFwKGZhLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBhLCAoX2EgPSB7fSwgX2FbbmFtZV0gPSBmKGEpLCBfYSkpO1xuICAgIH0pOyB9OyB9O1xufVxuZXhwb3J0IHsgXG4vKipcbiAqIEBzaW5jZSAyLjEzLjBcbiAqL1xubGV0XyBhcyBsZXQgfTtcbi8qKiBAZGVwcmVjYXRlZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0b3JDb21wb3NpdGlvbihGLCBHKSB7XG4gICAgdmFyIF9tYXAgPSBtYXAoRiwgRyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWFwOiBmdW5jdGlvbiAoZmdhLCBmKSB7IHJldHVybiBwaXBlKGZnYSwgX21hcChmKSk7IH1cbiAgICB9O1xufVxuIiwiLyoqXG4gKiBgYGB0c1xuICogaW50ZXJmYWNlIFNlcGFyYXRlZDxFLCBBPiB7XG4gKiAgICByZWFkb25seSBsZWZ0OiBFXG4gKiAgICByZWFkb25seSByaWdodDogQVxuICogfVxuICogYGBgXG4gKlxuICogUmVwcmVzZW50cyBhIHJlc3VsdCBvZiBzZXBhcmF0aW5nIGEgd2hvbGUgaW50byB0d28gcGFydHMuXG4gKlxuICogQHNpbmNlIDIuMTAuMFxuICovXG5pbXBvcnQgeyBwaXBlIH0gZnJvbSAnLi9mdW5jdGlvbic7XG5pbXBvcnQgeyBmbGFwIGFzIGZsYXBfIH0gZnJvbSAnLi9GdW5jdG9yJztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbnN0cnVjdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgc2VwYXJhdGVkID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiAoeyBsZWZ0OiBsZWZ0LCByaWdodDogcmlnaHQgfSk7IH07XG52YXIgX21hcCA9IGZ1bmN0aW9uIChmYSwgZikgeyByZXR1cm4gcGlwZShmYSwgbWFwKGYpKTsgfTtcbnZhciBfbWFwTGVmdCA9IGZ1bmN0aW9uIChmYSwgZikgeyByZXR1cm4gcGlwZShmYSwgbWFwTGVmdChmKSk7IH07XG52YXIgX2JpbWFwID0gZnVuY3Rpb24gKGZhLCBnLCBmKSB7IHJldHVybiBwaXBlKGZhLCBiaW1hcChnLCBmKSk7IH07XG4vKipcbiAqIGBtYXBgIGNhbiBiZSB1c2VkIHRvIHR1cm4gZnVuY3Rpb25zIGAoYTogQSkgPT4gQmAgaW50byBmdW5jdGlvbnMgYChmYTogRjxBPikgPT4gRjxCPmAgd2hvc2UgYXJndW1lbnQgYW5kIHJldHVybiB0eXBlc1xuICogdXNlIHRoZSB0eXBlIGNvbnN0cnVjdG9yIGBGYCB0byByZXByZXNlbnQgc29tZSBjb21wdXRhdGlvbmFsIGNvbnRleHQuXG4gKlxuICogQGNhdGVnb3J5IG1hcHBpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBtYXAgPSBmdW5jdGlvbiAoZikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICAgICAgcmV0dXJuIHNlcGFyYXRlZChsZWZ0KGZhKSwgZihyaWdodChmYSkpKTtcbiAgICB9O1xufTtcbi8qKlxuICogTWFwIGEgZnVuY3Rpb24gb3ZlciB0aGUgZmlyc3QgdHlwZSBhcmd1bWVudCBvZiBhIGJpZnVuY3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgZXJyb3IgaGFuZGxpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBtYXBMZWZ0ID0gZnVuY3Rpb24gKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgICAgIHJldHVybiBzZXBhcmF0ZWQoZihsZWZ0KGZhKSksIHJpZ2h0KGZhKSk7XG4gICAgfTtcbn07XG4vKipcbiAqIE1hcCBhIHBhaXIgb2YgZnVuY3Rpb25zIG92ZXIgdGhlIHR3byB0eXBlIGFyZ3VtZW50cyBvZiB0aGUgYmlmdW5jdG9yLlxuICpcbiAqIEBjYXRlZ29yeSBtYXBwaW5nXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgYmltYXAgPSBmdW5jdGlvbiAoZiwgZykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZmEpIHtcbiAgICAgICAgcmV0dXJuIHNlcGFyYXRlZChmKGxlZnQoZmEpKSwgZyhyaWdodChmYSkpKTtcbiAgICB9O1xufTtcbi8qKlxuICogQGNhdGVnb3J5IHR5cGUgbGFtYmRhc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIFVSSSA9ICdTZXBhcmF0ZWQnO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgQmlmdW5jdG9yID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcExlZnQ6IF9tYXBMZWZ0LFxuICAgIGJpbWFwOiBfYmltYXBcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBGdW5jdG9yID0ge1xuICAgIFVSSTogVVJJLFxuICAgIG1hcDogX21hcFxufTtcbi8qKlxuICogQGNhdGVnb3J5IG1hcHBpbmdcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBmbGFwID0gLyojX19QVVJFX18qLyBmbGFwXyhGdW5jdG9yKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBsZWZ0ID0gZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMubGVmdDsgfTtcbi8qKlxuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIHJpZ2h0ID0gZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMucmlnaHQ7IH07XG4iLCJpbXBvcnQgKiBhcyBfIGZyb20gJy4vaW50ZXJuYWwnO1xuZXhwb3J0IGZ1bmN0aW9uIHdpbHREZWZhdWx0KFQsIEMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKEYpIHtcbiAgICAgICAgdmFyIHRyYXZlcnNlRiA9IFQudHJhdmVyc2UoRik7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAod2EsIGYpIHsgcmV0dXJuIEYubWFwKHRyYXZlcnNlRih3YSwgZiksIEMuc2VwYXJhdGUpOyB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gd2l0aGVyRGVmYXVsdChULCBDKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChGKSB7XG4gICAgICAgIHZhciB0cmF2ZXJzZUYgPSBULnRyYXZlcnNlKEYpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHdhLCBmKSB7IHJldHVybiBGLm1hcCh0cmF2ZXJzZUYod2EsIGYpLCBDLmNvbXBhY3QpOyB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyRShXKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChGKSB7XG4gICAgICAgIHZhciB3aXRoZXJGID0gVy53aXRoZXIoRik7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAocHJlZGljYXRlKSB7IHJldHVybiBmdW5jdGlvbiAoZ2EpIHsgcmV0dXJuIHdpdGhlckYoZ2EsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBGLm1hcChwcmVkaWNhdGUoYSksIGZ1bmN0aW9uIChiKSB7IHJldHVybiAoYiA/IF8uc29tZShhKSA6IF8ubm9uZSk7IH0pOyB9KTsgfTsgfTtcbiAgICB9O1xufVxuIiwidmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gaW5zdGFuY2VzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRCb29sZWFuQWxnZWJyYSA9IGZ1bmN0aW9uIChCKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7XG4gICAgICAgIG1lZXQ6IGZ1bmN0aW9uICh4LCB5KSB7IHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gQi5tZWV0KHgoYSksIHkoYSkpOyB9OyB9LFxuICAgICAgICBqb2luOiBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIEIuam9pbih4KGEpLCB5KGEpKTsgfTsgfSxcbiAgICAgICAgemVybzogZnVuY3Rpb24gKCkgeyByZXR1cm4gQi56ZXJvOyB9LFxuICAgICAgICBvbmU6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEIub25lOyB9LFxuICAgICAgICBpbXBsaWVzOiBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIEIuaW1wbGllcyh4KGEpLCB5KGEpKTsgfTsgfSxcbiAgICAgICAgbm90OiBmdW5jdGlvbiAoeCkgeyByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIEIubm90KHgoYSkpOyB9OyB9XG4gICAgfSk7IH07XG59O1xuLyoqXG4gKiBVbmFyeSBmdW5jdGlvbnMgZm9ybSBhIHNlbWlncm91cCBhcyBsb25nIGFzIHlvdSBjYW4gcHJvdmlkZSBhIHNlbWlncm91cCBmb3IgdGhlIGNvZG9tYWluLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBQcmVkaWNhdGUsIGdldFNlbWlncm91cCB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgQiBmcm9tICdmcC10cy9ib29sZWFuJ1xuICpcbiAqIGNvbnN0IGY6IFByZWRpY2F0ZTxudW1iZXI+ID0gKG4pID0+IG4gPD0gMlxuICogY29uc3QgZzogUHJlZGljYXRlPG51bWJlcj4gPSAobikgPT4gbiA+PSAwXG4gKlxuICogY29uc3QgUzEgPSBnZXRTZW1pZ3JvdXAoQi5TZW1pZ3JvdXBBbGwpPG51bWJlcj4oKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoUzEuY29uY2F0KGYsIGcpKDEpLCB0cnVlKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTMS5jb25jYXQoZiwgZykoMyksIGZhbHNlKVxuICpcbiAqIGNvbnN0IFMyID0gZ2V0U2VtaWdyb3VwKEIuU2VtaWdyb3VwQW55KTxudW1iZXI+KClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMyLmNvbmNhdChmLCBnKSgxKSwgdHJ1ZSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoUzIuY29uY2F0KGYsIGcpKDMpLCB0cnVlKVxuICpcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRTZW1pZ3JvdXAgPSBmdW5jdGlvbiAoUykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgICAgICBjb25jYXQ6IGZ1bmN0aW9uIChmLCBnKSB7IHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gUy5jb25jYXQoZihhKSwgZyhhKSk7IH07IH1cbiAgICB9KTsgfTtcbn07XG4vKipcbiAqIFVuYXJ5IGZ1bmN0aW9ucyBmb3JtIGEgbW9ub2lkIGFzIGxvbmcgYXMgeW91IGNhbiBwcm92aWRlIGEgbW9ub2lkIGZvciB0aGUgY29kb21haW4uXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IFByZWRpY2F0ZSB9IGZyb20gJ2ZwLXRzL1ByZWRpY2F0ZSdcbiAqIGltcG9ydCB7IGdldE1vbm9pZCB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgQiBmcm9tICdmcC10cy9ib29sZWFuJ1xuICpcbiAqIGNvbnN0IGY6IFByZWRpY2F0ZTxudW1iZXI+ID0gKG4pID0+IG4gPD0gMlxuICogY29uc3QgZzogUHJlZGljYXRlPG51bWJlcj4gPSAobikgPT4gbiA+PSAwXG4gKlxuICogY29uc3QgTTEgPSBnZXRNb25vaWQoQi5Nb25vaWRBbGwpPG51bWJlcj4oKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoTTEuY29uY2F0KGYsIGcpKDEpLCB0cnVlKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChNMS5jb25jYXQoZiwgZykoMyksIGZhbHNlKVxuICpcbiAqIGNvbnN0IE0yID0gZ2V0TW9ub2lkKEIuTW9ub2lkQW55KTxudW1iZXI+KClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKE0yLmNvbmNhdChmLCBnKSgxKSwgdHJ1ZSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoTTIuY29uY2F0KGYsIGcpKDMpLCB0cnVlKVxuICpcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjEwLjBcbiAqL1xuZXhwb3J0IHZhciBnZXRNb25vaWQgPSBmdW5jdGlvbiAoTSkge1xuICAgIHZhciBnZXRTZW1pZ3JvdXBNID0gZ2V0U2VtaWdyb3VwKE0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgICAgICBjb25jYXQ6IGdldFNlbWlncm91cE0oKS5jb25jYXQsXG4gICAgICAgIGVtcHR5OiBmdW5jdGlvbiAoKSB7IHJldHVybiBNLmVtcHR5OyB9XG4gICAgfSk7IH07XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4xMC4wXG4gKi9cbmV4cG9ydCB2YXIgZ2V0U2VtaXJpbmcgPSBmdW5jdGlvbiAoUykgeyByZXR1cm4gKHtcbiAgICBhZGQ6IGZ1bmN0aW9uIChmLCBnKSB7IHJldHVybiBmdW5jdGlvbiAoeCkgeyByZXR1cm4gUy5hZGQoZih4KSwgZyh4KSk7IH07IH0sXG4gICAgemVybzogZnVuY3Rpb24gKCkgeyByZXR1cm4gUy56ZXJvOyB9LFxuICAgIG11bDogZnVuY3Rpb24gKGYsIGcpIHsgcmV0dXJuIGZ1bmN0aW9uICh4KSB7IHJldHVybiBTLm11bChmKHgpLCBnKHgpKTsgfTsgfSxcbiAgICBvbmU6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFMub25lOyB9XG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMTAuMFxuICovXG5leHBvcnQgdmFyIGdldFJpbmcgPSBmdW5jdGlvbiAoUikge1xuICAgIHZhciBTID0gZ2V0U2VtaXJpbmcoUik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWRkOiBTLmFkZCxcbiAgICAgICAgbXVsOiBTLm11bCxcbiAgICAgICAgb25lOiBTLm9uZSxcbiAgICAgICAgemVybzogUy56ZXJvLFxuICAgICAgICBzdWI6IGZ1bmN0aW9uIChmLCBnKSB7IHJldHVybiBmdW5jdGlvbiAoeCkgeyByZXR1cm4gUi5zdWIoZih4KSwgZyh4KSk7IH07IH1cbiAgICB9O1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciBhcHBseSA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7XG4gICAgICAgIHJldHVybiBmKGEpO1xuICAgIH07XG59O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlkZW50aXR5KGEpIHtcbiAgICByZXR1cm4gYTtcbn1cbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgdW5zYWZlQ29lcmNlID0gaWRlbnRpdHk7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29uc3RhbnQoYSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBhOyB9O1xufVxuLyoqXG4gKiBBIHRodW5rIHRoYXQgcmV0dXJucyBhbHdheXMgYHRydWVgLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGNvbnN0VHJ1ZSA9IC8qI19fUFVSRV9fKi8gY29uc3RhbnQodHJ1ZSk7XG4vKipcbiAqIEEgdGh1bmsgdGhhdCByZXR1cm5zIGFsd2F5cyBgZmFsc2VgLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgdmFyIGNvbnN0RmFsc2UgPSAvKiNfX1BVUkVfXyovIGNvbnN0YW50KGZhbHNlKTtcbi8qKlxuICogQSB0aHVuayB0aGF0IHJldHVybnMgYWx3YXlzIGBudWxsYC5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0IHZhciBjb25zdE51bGwgPSAvKiNfX1BVUkVfXyovIGNvbnN0YW50KG51bGwpO1xuLyoqXG4gKiBBIHRodW5rIHRoYXQgcmV0dXJucyBhbHdheXMgYHVuZGVmaW5lZGAuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgY29uc3RVbmRlZmluZWQgPSAvKiNfX1BVUkVfXyovIGNvbnN0YW50KHVuZGVmaW5lZCk7XG4vKipcbiAqIEEgdGh1bmsgdGhhdCByZXR1cm5zIGFsd2F5cyBgdm9pZGAuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCB2YXIgY29uc3RWb2lkID0gY29uc3RVbmRlZmluZWQ7XG5leHBvcnQgZnVuY3Rpb24gZmxpcChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZihhcmdzWzFdLCBhcmdzWzBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGYoYSkoYXJnc1swXSk7IH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmbG93KGFiLCBiYywgY2QsIGRlLCBlZiwgZmcsIGdoLCBoaSwgaWopIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIGFiO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZnKGVmKGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdoKGZnKGVmKGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoaShnaChmZyhlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlqKGhpKGdoKGZnKGVmKGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSkpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybjtcbn1cbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0dXBsZSgpIHtcbiAgICB2YXIgdCA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHRbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG59XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5jcmVtZW50KG4pIHtcbiAgICByZXR1cm4gbiArIDE7XG59XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVjcmVtZW50KG4pIHtcbiAgICByZXR1cm4gbiAtIDE7XG59XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWJzdXJkKF8pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbGxlZCBgYWJzdXJkYCBmdW5jdGlvbiB3aGljaCBzaG91bGQgYmUgdW5jYWxsYWJsZScpO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgdHVwbGVkIHZlcnNpb24gb2YgdGhpcyBmdW5jdGlvbjogaW5zdGVhZCBvZiBgbmAgYXJndW1lbnRzLCBpdCBhY2NlcHRzIGEgc2luZ2xlIHR1cGxlIGFyZ3VtZW50LlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyB0dXBsZWQgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBjb25zdCBhZGQgPSB0dXBsZWQoKHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyID0+IHggKyB5KVxuICpcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChhZGQoWzEsIDJdKSwgMylcbiAqXG4gKiBAc2luY2UgMi40LjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHR1cGxlZChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7IHJldHVybiBmLmFwcGx5KHZvaWQgMCwgYSk7IH07XG59XG4vKipcbiAqIEludmVyc2UgZnVuY3Rpb24gb2YgYHR1cGxlZGBcbiAqXG4gKiBAc2luY2UgMi40LjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVudHVwbGVkKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYVtfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmKGEpO1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gcGlwZShhLCBhYiwgYmMsIGNkLCBkZSwgZWYsIGZnLCBnaCwgaGkpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJldHVybiBhYihhKTtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmV0dXJuIGJjKGFiKGEpKTtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuIGNkKGJjKGFiKGEpKSk7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJldHVybiBkZShjZChiYyhhYihhKSkpKTtcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgcmV0dXJuIGVmKGRlKGNkKGJjKGFiKGEpKSkpKTtcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgcmV0dXJuIGZnKGVmKGRlKGNkKGJjKGFiKGEpKSkpKSk7XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiBnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKTtcbiAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgcmV0dXJuIGhpKGdoKGZnKGVmKGRlKGNkKGJjKGFiKGEpKSkpKSkpKTtcbiAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgdmFyIHJldCA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXJndW1lbnRzW2ldKHJldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBUeXBlIGhvbGUgc2ltdWxhdGlvblxuICpcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgdmFyIGhvbGUgPSBhYnN1cmQ7XG4vKipcbiAqIEBzaW5jZSAyLjExLjBcbiAqL1xuZXhwb3J0IHZhciBTSyA9IGZ1bmN0aW9uIChfLCBiKSB7IHJldHVybiBiOyB9O1xuLyoqXG4gKiBVc2UgYFByZWRpY2F0ZWAgbW9kdWxlIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IHpvbmUgb2YgZGVhdGhcbiAqIEBzaW5jZSAyLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vdChwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuICFwcmVkaWNhdGUoYSk7IH07XG59XG4vKipcbiAqIFVzZSBgRW5kb21vcnBoaXNtYCBtb2R1bGUgaW5zdGVhZC5cbiAqXG4gKiBAY2F0ZWdvcnkgem9uZSBvZiBkZWF0aFxuICogQHNpbmNlIDIuMTAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciBnZXRFbmRvbW9ycGhpc21Nb25vaWQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgIGNvbmNhdDogZnVuY3Rpb24gKGZpcnN0LCBzZWNvbmQpIHsgcmV0dXJuIGZsb3coZmlyc3QsIHNlY29uZCk7IH0sXG4gICAgZW1wdHk6IGlkZW50aXR5XG59KTsgfTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgZHVhbCA9IGZ1bmN0aW9uIChhcml0eSwgYm9keSkge1xuICAgIHZhciBpc0RhdGFGaXJzdCA9IHR5cGVvZiBhcml0eSA9PT0gJ251bWJlcicgPyBmdW5jdGlvbiAoYXJncykgeyByZXR1cm4gYXJncy5sZW5ndGggPj0gYXJpdHk7IH0gOiBhcml0eTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKGlzRGF0YUZpcnN0KGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIHJldHVybiBib2R5LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoc2VsZikgeyByZXR1cm4gYm9keS5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW3NlbGZdLCBhcmdzLCBmYWxzZSkpOyB9O1xuICAgIH07XG59O1xuIiwidmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3B0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGlzTm9uZSA9IGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gZmEuX3RhZyA9PT0gJ05vbmUnOyB9O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBpc1NvbWUgPSBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIGZhLl90YWcgPT09ICdTb21lJzsgfTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgbm9uZSA9IHsgX3RhZzogJ05vbmUnIH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIHNvbWUgPSBmdW5jdGlvbiAoYSkgeyByZXR1cm4gKHsgX3RhZzogJ1NvbWUnLCB2YWx1ZTogYSB9KTsgfTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEVpdGhlclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBpc0xlZnQgPSBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIG1hLl90YWcgPT09ICdMZWZ0JzsgfTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgaXNSaWdodCA9IGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gbWEuX3RhZyA9PT0gJ1JpZ2h0JzsgfTtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCB2YXIgbGVmdCA9IGZ1bmN0aW9uIChlKSB7IHJldHVybiAoeyBfdGFnOiAnTGVmdCcsIGxlZnQ6IGUgfSk7IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIHJpZ2h0ID0gZnVuY3Rpb24gKGEpIHsgcmV0dXJuICh7IF90YWc6ICdSaWdodCcsIHJpZ2h0OiBhIH0pOyB9O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmVhZG9ubHlOb25FbXB0eUFycmF5XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIHNpbmdsZXRvbiA9IGZ1bmN0aW9uIChhKSB7IHJldHVybiBbYV07IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGlzTm9uRW1wdHkgPSBmdW5jdGlvbiAoYXMpIHsgcmV0dXJuIGFzLmxlbmd0aCA+IDA7IH07XG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGhlYWQgPSBmdW5jdGlvbiAoYXMpIHsgcmV0dXJuIGFzWzBdOyB9O1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciB0YWlsID0gZnVuY3Rpb24gKGFzKSB7IHJldHVybiBhcy5zbGljZSgxKTsgfTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGVtcHR5XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGVtcHR5UmVhZG9ubHlBcnJheSA9IFtdO1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IHZhciBlbXB0eVJlY29yZCA9IHt9O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmVjb3JkXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBOb25FbXB0eUFycmF5XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKiogQGludGVybmFsICovXG5leHBvcnQgdmFyIGZyb21SZWFkb25seU5vbkVtcHR5QXJyYXkgPSBmdW5jdGlvbiAoYXMpIHsgcmV0dXJuIF9fc3ByZWFkQXJyYXkoW2FzWzBdXSwgYXMuc2xpY2UoMSksIHRydWUpOyB9O1xuIiwiaW1wb3J0IHsgYXBGaXJzdCBhcyBhcEZpcnN0XywgYXBTZWNvbmQgYXMgYXBTZWNvbmRfIH0gZnJvbSAnLi9BcHBseSc7XG5pbXBvcnQgeyBjaGFpbkZpcnN0IGFzIGNoYWluRmlyc3RfIH0gZnJvbSAnLi9DaGFpbic7XG5pbXBvcnQgeyBpZGVudGl0eSwgcGlwZSBhcyBwaXBlRnJvbUZ1bmN0aW9uTW9kdWxlIH0gZnJvbSAnLi9mdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gbWFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5tYXAoZmEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRyYW1hcChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYuY29udHJhbWFwKGZhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtYXBXaXRoSW5kZXgoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLm1hcFdpdGhJbmRleChmYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gYXAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYWIpIHsgcmV0dXJuIEYuYXAoZmFiLCBmYSk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gY2hhaW4oRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLmNoYWluKGZhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBiaW1hcChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmLCBnKSB7IHJldHVybiBmdW5jdGlvbiAoZmVhKSB7IHJldHVybiBGLmJpbWFwKGZlYSwgZiwgZyk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gbWFwTGVmdChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmVhKSB7IHJldHVybiBGLm1hcExlZnQoZmVhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKHdhKSB7IHJldHVybiBGLmV4dGVuZCh3YSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGIsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5yZWR1Y2UoZmEsIGIsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvbGRNYXAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoTSkge1xuICAgICAgICB2YXIgZm9sZE1hcE0gPSBGLmZvbGRNYXAoTSk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBmb2xkTWFwTShmYSwgZik7IH07IH07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VSaWdodChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChiLCBmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYucmVkdWNlUmlnaHQoZmEsIGIsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZVdpdGhJbmRleChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChiLCBmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYucmVkdWNlV2l0aEluZGV4KGZhLCBiLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb2xkTWFwV2l0aEluZGV4KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKE0pIHtcbiAgICAgICAgdmFyIGZvbGRNYXBXaXRoSW5kZXhNID0gRi5mb2xkTWFwV2l0aEluZGV4KE0pO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gZm9sZE1hcFdpdGhJbmRleE0oZmEsIGYpOyB9OyB9O1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlUmlnaHRXaXRoSW5kZXgoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYiwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLnJlZHVjZVJpZ2h0V2l0aEluZGV4KGZhLCBiLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhbHQoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGhhdCkgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLmFsdChmYSwgdGhhdCk7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHByZWRpY2F0ZSkgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLmZpbHRlcihmYSwgcHJlZGljYXRlKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJNYXAoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLmZpbHRlck1hcChmYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gcGFydGl0aW9uKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5wYXJ0aXRpb24oZmEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpdGlvbk1hcChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYucGFydGl0aW9uTWFwKGZhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJXaXRoSW5kZXgoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAocHJlZGljYXRlKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYuZmlsdGVyV2l0aEluZGV4KGZhLCBwcmVkaWNhdGUpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlck1hcFdpdGhJbmRleChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZmEpIHsgcmV0dXJuIEYuZmlsdGVyTWFwV2l0aEluZGV4KGZhLCBmKTsgfTsgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aXRpb25XaXRoSW5kZXgoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiBGLnBhcnRpdGlvbldpdGhJbmRleChmYSwgZik7IH07IH07XG59XG5leHBvcnQgZnVuY3Rpb24gcGFydGl0aW9uTWFwV2l0aEluZGV4KEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gRi5wYXJ0aXRpb25NYXBXaXRoSW5kZXgoZmEsIGYpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByb21hcChGKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmLCBnKSB7IHJldHVybiBmdW5jdGlvbiAoZmJjKSB7IHJldHVybiBGLnByb21hcChmYmMsIGYsIGcpOyB9OyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2UoRikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZWEpIHsgcmV0dXJuIGZ1bmN0aW9uIChhYikgeyByZXR1cm4gRi5jb21wb3NlKGFiLCBlYSk7IH07IH07XG59XG52YXIgaXNGdW5jdG9yID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLm1hcCA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0NvbnRyYXZhcmlhbnQgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkuY29udHJhbWFwID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzRnVuY3RvcldpdGhJbmRleCA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5tYXBXaXRoSW5kZXggPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNBcHBseSA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5hcCA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0NoYWluID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLmNoYWluID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzQmlmdW5jdG9yID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLmJpbWFwID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzRXh0ZW5kID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLmV4dGVuZCA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0ZvbGRhYmxlID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLnJlZHVjZSA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0ZvbGRhYmxlV2l0aEluZGV4ID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLnJlZHVjZVdpdGhJbmRleCA9PT0gJ2Z1bmN0aW9uJzsgfTtcbnZhciBpc0FsdCA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5hbHQgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNDb21wYWN0YWJsZSA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5jb21wYWN0ID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzRmlsdGVyYWJsZSA9IGZ1bmN0aW9uIChJKSB7IHJldHVybiB0eXBlb2YgSS5maWx0ZXIgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNGaWx0ZXJhYmxlV2l0aEluZGV4ID0gZnVuY3Rpb24gKEkpIHtcbiAgICByZXR1cm4gdHlwZW9mIEkuZmlsdGVyV2l0aEluZGV4ID09PSAnZnVuY3Rpb24nO1xufTtcbnZhciBpc1Byb2Z1bmN0b3IgPSBmdW5jdGlvbiAoSSkgeyByZXR1cm4gdHlwZW9mIEkucHJvbWFwID09PSAnZnVuY3Rpb24nOyB9O1xudmFyIGlzU2VtaWdyb3Vwb2lkID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLmNvbXBvc2UgPT09ICdmdW5jdGlvbic7IH07XG52YXIgaXNNb25hZFRocm93ID0gZnVuY3Rpb24gKEkpIHsgcmV0dXJuIHR5cGVvZiBJLnRocm93RXJyb3IgPT09ICdmdW5jdGlvbic7IH07XG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBwaXBlYWJsZShJKSB7XG4gICAgdmFyIHIgPSB7fTtcbiAgICBpZiAoaXNGdW5jdG9yKEkpKSB7XG4gICAgICAgIHIubWFwID0gbWFwKEkpO1xuICAgIH1cbiAgICBpZiAoaXNDb250cmF2YXJpYW50KEkpKSB7XG4gICAgICAgIHIuY29udHJhbWFwID0gY29udHJhbWFwKEkpO1xuICAgIH1cbiAgICBpZiAoaXNGdW5jdG9yV2l0aEluZGV4KEkpKSB7XG4gICAgICAgIHIubWFwV2l0aEluZGV4ID0gbWFwV2l0aEluZGV4KEkpO1xuICAgIH1cbiAgICBpZiAoaXNBcHBseShJKSkge1xuICAgICAgICByLmFwID0gYXAoSSk7XG4gICAgICAgIHIuYXBGaXJzdCA9IGFwRmlyc3RfKEkpO1xuICAgICAgICByLmFwU2Vjb25kID0gYXBTZWNvbmRfKEkpO1xuICAgIH1cbiAgICBpZiAoaXNDaGFpbihJKSkge1xuICAgICAgICByLmNoYWluID0gY2hhaW4oSSk7XG4gICAgICAgIHIuY2hhaW5GaXJzdCA9IGNoYWluRmlyc3RfKEkpO1xuICAgICAgICByLmZsYXR0ZW4gPSByLmNoYWluKGlkZW50aXR5KTtcbiAgICB9XG4gICAgaWYgKGlzQmlmdW5jdG9yKEkpKSB7XG4gICAgICAgIHIuYmltYXAgPSBiaW1hcChJKTtcbiAgICAgICAgci5tYXBMZWZ0ID0gbWFwTGVmdChJKTtcbiAgICB9XG4gICAgaWYgKGlzRXh0ZW5kKEkpKSB7XG4gICAgICAgIHIuZXh0ZW5kID0gZXh0ZW5kKEkpO1xuICAgICAgICByLmR1cGxpY2F0ZSA9IHIuZXh0ZW5kKGlkZW50aXR5KTtcbiAgICB9XG4gICAgaWYgKGlzRm9sZGFibGUoSSkpIHtcbiAgICAgICAgci5yZWR1Y2UgPSByZWR1Y2UoSSk7XG4gICAgICAgIHIuZm9sZE1hcCA9IGZvbGRNYXAoSSk7XG4gICAgICAgIHIucmVkdWNlUmlnaHQgPSByZWR1Y2VSaWdodChJKTtcbiAgICB9XG4gICAgaWYgKGlzRm9sZGFibGVXaXRoSW5kZXgoSSkpIHtcbiAgICAgICAgci5yZWR1Y2VXaXRoSW5kZXggPSByZWR1Y2VXaXRoSW5kZXgoSSk7XG4gICAgICAgIHIuZm9sZE1hcFdpdGhJbmRleCA9IGZvbGRNYXBXaXRoSW5kZXgoSSk7XG4gICAgICAgIHIucmVkdWNlUmlnaHRXaXRoSW5kZXggPSByZWR1Y2VSaWdodFdpdGhJbmRleChJKTtcbiAgICB9XG4gICAgaWYgKGlzQWx0KEkpKSB7XG4gICAgICAgIHIuYWx0ID0gYWx0KEkpO1xuICAgIH1cbiAgICBpZiAoaXNDb21wYWN0YWJsZShJKSkge1xuICAgICAgICByLmNvbXBhY3QgPSBJLmNvbXBhY3Q7XG4gICAgICAgIHIuc2VwYXJhdGUgPSBJLnNlcGFyYXRlO1xuICAgIH1cbiAgICBpZiAoaXNGaWx0ZXJhYmxlKEkpKSB7XG4gICAgICAgIHIuZmlsdGVyID0gZmlsdGVyKEkpO1xuICAgICAgICByLmZpbHRlck1hcCA9IGZpbHRlck1hcChJKTtcbiAgICAgICAgci5wYXJ0aXRpb24gPSBwYXJ0aXRpb24oSSk7XG4gICAgICAgIHIucGFydGl0aW9uTWFwID0gcGFydGl0aW9uTWFwKEkpO1xuICAgIH1cbiAgICBpZiAoaXNGaWx0ZXJhYmxlV2l0aEluZGV4KEkpKSB7XG4gICAgICAgIHIuZmlsdGVyV2l0aEluZGV4ID0gZmlsdGVyV2l0aEluZGV4KEkpO1xuICAgICAgICByLmZpbHRlck1hcFdpdGhJbmRleCA9IGZpbHRlck1hcFdpdGhJbmRleChJKTtcbiAgICAgICAgci5wYXJ0aXRpb25XaXRoSW5kZXggPSBwYXJ0aXRpb25XaXRoSW5kZXgoSSk7XG4gICAgICAgIHIucGFydGl0aW9uTWFwV2l0aEluZGV4ID0gcGFydGl0aW9uTWFwV2l0aEluZGV4KEkpO1xuICAgIH1cbiAgICBpZiAoaXNQcm9mdW5jdG9yKEkpKSB7XG4gICAgICAgIHIucHJvbWFwID0gcHJvbWFwKEkpO1xuICAgIH1cbiAgICBpZiAoaXNTZW1pZ3JvdXBvaWQoSSkpIHtcbiAgICAgICAgci5jb21wb3NlID0gY29tcG9zZShJKTtcbiAgICB9XG4gICAgaWYgKGlzTW9uYWRUaHJvdyhJKSkge1xuICAgICAgICB2YXIgZnJvbU9wdGlvbiA9IGZ1bmN0aW9uIChvbk5vbmUpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgICAgICAgICAgcmV0dXJuIG1hLl90YWcgPT09ICdOb25lJyA/IEkudGhyb3dFcnJvcihvbk5vbmUoKSkgOiBJLm9mKG1hLnZhbHVlKTtcbiAgICAgICAgfTsgfTtcbiAgICAgICAgdmFyIGZyb21FaXRoZXIgPSBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgICAgIHJldHVybiBtYS5fdGFnID09PSAnTGVmdCcgPyBJLnRocm93RXJyb3IobWEubGVmdCkgOiBJLm9mKG1hLnJpZ2h0KTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGZyb21QcmVkaWNhdGUgPSBmdW5jdGlvbiAocHJlZGljYXRlLCBvbkZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZGljYXRlKGEpID8gSS5vZihhKSA6IEkudGhyb3dFcnJvcihvbkZhbHNlKGEpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHZhciBmaWx0ZXJPckVsc2UgPSBmdW5jdGlvbiAocHJlZGljYXRlLCBvbkZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1hKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEkuY2hhaW4obWEsIGZ1bmN0aW9uIChhKSB7IHJldHVybiAocHJlZGljYXRlKGEpID8gSS5vZihhKSA6IEkudGhyb3dFcnJvcihvbkZhbHNlKGEpKSk7IH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgci5mcm9tT3B0aW9uID0gZnJvbU9wdGlvbjtcbiAgICAgICAgci5mcm9tRWl0aGVyID0gZnJvbUVpdGhlcjtcbiAgICAgICAgci5mcm9tUHJlZGljYXRlID0gZnJvbVByZWRpY2F0ZTtcbiAgICAgICAgci5maWx0ZXJPckVsc2UgPSBmaWx0ZXJPckVsc2U7XG4gICAgfVxuICAgIHJldHVybiByO1xufVxuLyoqXG4gKiBVc2UgW2BwaXBlYF0oaHR0cHM6Ly9nY2FudGkuZ2l0aHViLmlvL2ZwLXRzL21vZHVsZXMvZnVuY3Rpb24udHMuaHRtbCNwaXBlKSBmcm9tIGBmdW5jdGlvbmAgbW9kdWxlIGluc3RlYWQuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgdmFyIHBpcGUgPSBwaXBlRnJvbUZ1bmN0aW9uTW9kdWxlO1xuIiwiaW1wb3J0ICogYXMgRlMgZnJvbSAnLi9GcmVlU2VtaWdyb3VwJztcbi8qKlxuICogQGNhdGVnb3J5IG1vZGVsXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9wcmVmZXItYXMtY29uc3RcbmV4cG9ydCB2YXIgcmVxdWlyZWQgPSAncmVxdWlyZWQnO1xuLyoqXG4gKiBAY2F0ZWdvcnkgbW9kZWxcbiAqIEBzaW5jZSAyLjIuN1xuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3ByZWZlci1hcy1jb25zdFxuZXhwb3J0IHZhciBvcHRpb25hbCA9ICdvcHRpb25hbCc7XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGxlYWYgPSBmdW5jdGlvbiAoYWN0dWFsLCBlcnJvcikgeyByZXR1cm4gKHsgX3RhZzogJ0xlYWYnLCBhY3R1YWw6IGFjdHVhbCwgZXJyb3I6IGVycm9yIH0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBrZXkgPSBmdW5jdGlvbiAoa2V5LCBraW5kLCBlcnJvcnMpIHsgcmV0dXJuICh7XG4gICAgX3RhZzogJ0tleScsXG4gICAga2V5OiBrZXksXG4gICAga2luZDoga2luZCxcbiAgICBlcnJvcnM6IGVycm9yc1xufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGluZGV4ID0gZnVuY3Rpb24gKGluZGV4LCBraW5kLCBlcnJvcnMpIHsgcmV0dXJuICh7XG4gICAgX3RhZzogJ0luZGV4JyxcbiAgICBpbmRleDogaW5kZXgsXG4gICAga2luZDoga2luZCxcbiAgICBlcnJvcnM6IGVycm9yc1xufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIG1lbWJlciA9IGZ1bmN0aW9uIChpbmRleCwgZXJyb3JzKSB7IHJldHVybiAoe1xuICAgIF90YWc6ICdNZW1iZXInLFxuICAgIGluZGV4OiBpbmRleCxcbiAgICBlcnJvcnM6IGVycm9yc1xufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGxhenkgPSBmdW5jdGlvbiAoaWQsIGVycm9ycykgeyByZXR1cm4gKHtcbiAgICBfdGFnOiAnTGF6eScsXG4gICAgaWQ6IGlkLFxuICAgIGVycm9yczogZXJyb3JzXG59KTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi45XG4gKi9cbmV4cG9ydCB2YXIgd3JhcCA9IGZ1bmN0aW9uIChlcnJvciwgZXJyb3JzKSB7IHJldHVybiAoe1xuICAgIF90YWc6ICdXcmFwJyxcbiAgICBlcnJvcjogZXJyb3IsXG4gICAgZXJyb3JzOiBlcnJvcnNcbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVzdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGZvbGQgPSBmdW5jdGlvbiAocGF0dGVybnMpIHtcbiAgICB2YXIgZiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHN3aXRjaCAoZS5fdGFnKSB7XG4gICAgICAgICAgICBjYXNlICdMZWFmJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0dGVybnMuTGVhZihlLmFjdHVhbCwgZS5lcnJvcik7XG4gICAgICAgICAgICBjYXNlICdLZXknOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXR0ZXJucy5LZXkoZS5rZXksIGUua2luZCwgZS5lcnJvcnMpO1xuICAgICAgICAgICAgY2FzZSAnSW5kZXgnOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXR0ZXJucy5JbmRleChlLmluZGV4LCBlLmtpbmQsIGUuZXJyb3JzKTtcbiAgICAgICAgICAgIGNhc2UgJ01lbWJlcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm5zLk1lbWJlcihlLmluZGV4LCBlLmVycm9ycyk7XG4gICAgICAgICAgICBjYXNlICdMYXp5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0dGVybnMuTGF6eShlLmlkLCBlLmVycm9ycyk7XG4gICAgICAgICAgICBjYXNlICdXcmFwJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0dGVybnMuV3JhcChlLmVycm9yLCBlLmVycm9ycyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBmO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZW1pZ3JvdXAoKSB7XG4gICAgcmV0dXJuIEZTLmdldFNlbWlncm91cCgpO1xufVxuIiwiaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9lczYvRWl0aGVyJztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnZnAtdHMvZXM2L2Z1bmN0aW9uJztcbmltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9lczYvcGlwZWFibGUnO1xuaW1wb3J0ICogYXMgREUgZnJvbSAnLi9EZWNvZGVFcnJvcic7XG5pbXBvcnQgKiBhcyBGUyBmcm9tICcuL0ZyZWVTZW1pZ3JvdXAnO1xuaW1wb3J0ICogYXMgRyBmcm9tICcuL0d1YXJkJztcbmltcG9ydCAqIGFzIEsgZnJvbSAnLi9LbGVpc2xpJztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEtsZWlzbGkgY29uZmlnXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgdmFyIFNFID0gXG4vKiNfX1BVUkVfXyovXG5ERS5nZXRTZW1pZ3JvdXAoKTtcbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCB2YXIgYXAgPSBmdW5jdGlvbiAoZmFiLCBmYSkge1xuICAgIHJldHVybiBFLmlzTGVmdChmYWIpXG4gICAgICAgID8gRS5pc0xlZnQoZmEpXG4gICAgICAgICAgICA/IEUubGVmdChTRS5jb25jYXQoZmFiLmxlZnQsIGZhLmxlZnQpKVxuICAgICAgICAgICAgOiBmYWJcbiAgICAgICAgOiBFLmlzTGVmdChmYSlcbiAgICAgICAgICAgID8gZmFcbiAgICAgICAgICAgIDogRS5yaWdodChmYWIucmlnaHQoZmEucmlnaHQpKTtcbn07XG52YXIgTSA9IHtcbiAgICBVUkk6IEUuVVJJLFxuICAgIF9FOiB1bmRlZmluZWQsXG4gICAgbWFwOiBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIHBpcGUoZmEsIEUubWFwKGYpKTsgfSxcbiAgICBhcDogYXAsXG4gICAgb2Y6IEUucmlnaHQsXG4gICAgY2hhaW46IGZ1bmN0aW9uIChtYSwgZikgeyByZXR1cm4gcGlwZShtYSwgRS5jaGFpbihmKSk7IH0sXG4gICAgdGhyb3dFcnJvcjogRS5sZWZ0LFxuICAgIGJpbWFwOiBmdW5jdGlvbiAoZmEsIGYsIGcpIHsgcmV0dXJuIHBpcGUoZmEsIEUuYmltYXAoZiwgZykpOyB9LFxuICAgIG1hcExlZnQ6IGZ1bmN0aW9uIChmYSwgZikgeyByZXR1cm4gcGlwZShmYSwgRS5tYXBMZWZ0KGYpKTsgfSxcbiAgICBhbHQ6IGZ1bmN0aW9uIChtZSwgdGhhdCkge1xuICAgICAgICBpZiAoRS5pc1JpZ2h0KG1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1lO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlYSA9IHRoYXQoKTtcbiAgICAgICAgcmV0dXJuIEUuaXNMZWZ0KGVhKSA/IEUubGVmdChTRS5jb25jYXQobWUubGVmdCwgZWEubGVmdCkpIDogZWE7XG4gICAgfVxufTtcbi8qKlxuICogQGNhdGVnb3J5IERlY29kZUVycm9yXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBlcnJvciA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHsgcmV0dXJuIEZTLm9mKERFLmxlYWYoYWN0dWFsLCBtZXNzYWdlKSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBEZWNvZGVFcnJvclxuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgc3VjY2VzcyA9IEUucmlnaHQ7XG4vKipcbiAqIEBjYXRlZ29yeSBEZWNvZGVFcnJvclxuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgZmFpbHVyZSA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gRS5sZWZ0KGVycm9yKGFjdHVhbCwgbWVzc2FnZSkpO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbnN0cnVjdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBmcm9tUmVmaW5lbWVudCA9IGZ1bmN0aW9uIChyZWZpbmVtZW50LCBleHBlY3RlZCkge1xuICAgIHJldHVybiBLLmZyb21SZWZpbmVtZW50KE0pKHJlZmluZW1lbnQsIGZ1bmN0aW9uICh1KSB7IHJldHVybiBlcnJvcih1LCBleHBlY3RlZCk7IH0pO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgZnJvbUd1YXJkID0gZnVuY3Rpb24gKGd1YXJkLCBleHBlY3RlZCkge1xuICAgIHJldHVybiBmcm9tUmVmaW5lbWVudChndWFyZC5pcywgZXhwZWN0ZWQpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgbGl0ZXJhbCA9IFxuLyojX19QVVJFX18qL1xuSy5saXRlcmFsKE0pKGZ1bmN0aW9uICh1LCB2YWx1ZXMpIHsgcmV0dXJuIGVycm9yKHUsIHZhbHVlcy5tYXAoZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7IH0pLmpvaW4oJyB8ICcpKTsgfSk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBwcmltaXRpdmVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBwcmltaXRpdmVzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBzdHJpbmcgPSBcbi8qI19fUFVSRV9fKi9cbmZyb21HdWFyZChHLnN0cmluZywgJ3N0cmluZycpO1xuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgbnVtYmVyID0gXG4vKiNfX1BVUkVfXyovXG5mcm9tR3VhcmQoRy5udW1iZXIsICdudW1iZXInKTtcbi8qKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGJvb2xlYW4gPSBcbi8qI19fUFVSRV9fKi9cbmZyb21HdWFyZChHLmJvb2xlYW4sICdib29sZWFuJyk7XG4vKipcbiAqIEBjYXRlZ29yeSBwcmltaXRpdmVzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBVbmtub3duQXJyYXkgPSBcbi8qI19fUFVSRV9fKi9cbmZyb21HdWFyZChHLlVua25vd25BcnJheSwgJ0FycmF5PHVua25vd24+Jyk7XG4vKipcbiAqIEBjYXRlZ29yeSBwcmltaXRpdmVzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBVbmtub3duUmVjb3JkID0gXG4vKiNfX1BVUkVfXyovXG5mcm9tR3VhcmQoRy5Vbmtub3duUmVjb3JkLCAnUmVjb3JkPHN0cmluZywgdW5rbm93bj4nKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbWJpbmF0b3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgbWFwTGVmdFdpdGhJbnB1dCA9IFxuLyojX19QVVJFX18qL1xuSy5tYXBMZWZ0V2l0aElucHV0KE0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOVxuICovXG5leHBvcnQgdmFyIHdpdGhNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbWFwTGVmdFdpdGhJbnB1dChmdW5jdGlvbiAoaW5wdXQsIGUpIHsgcmV0dXJuIEZTLm9mKERFLndyYXAobWVzc2FnZShpbnB1dCwgZSksIGUpKTsgfSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIHJlZmluZSA9IGZ1bmN0aW9uIChyZWZpbmVtZW50LCBpZCkgeyByZXR1cm4gSy5yZWZpbmUoTSkocmVmaW5lbWVudCwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGVycm9yKGEsIGlkKTsgfSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgcGFyc2UgPSBcbi8qI19fUFVSRV9fKi9cbksucGFyc2UoTSk7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgbnVsbGFibGUgPSBcbi8qI19fUFVSRV9fKi9cbksubnVsbGFibGUoTSkoZnVuY3Rpb24gKHUsIGUpIHsgcmV0dXJuIEZTLmNvbmNhdChGUy5vZihERS5tZW1iZXIoMCwgZXJyb3IodSwgJ251bGwnKSkpLCBGUy5vZihERS5tZW1iZXIoMSwgZSkpKTsgfSk7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4xNVxuICovXG5leHBvcnQgdmFyIGZyb21TdHJ1Y3QgPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xuICAgIHJldHVybiBLLmZyb21TdHJ1Y3QoTSkoZnVuY3Rpb24gKGssIGUpIHsgcmV0dXJuIEZTLm9mKERFLmtleShrLCBERS5yZXF1aXJlZCwgZSkpOyB9KShwcm9wZXJ0aWVzKTtcbn07XG4vKipcbiAqIFVzZSBgZnJvbVN0cnVjdGAgaW5zdGVhZC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciBmcm9tVHlwZSA9IGZyb21TdHJ1Y3Q7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4xNVxuICovXG5leHBvcnQgdmFyIHN0cnVjdCA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7IHJldHVybiBwaXBlKFVua25vd25SZWNvcmQsIGNvbXBvc2UoZnJvbVN0cnVjdChwcm9wZXJ0aWVzKSkpOyB9O1xuLyoqXG4gKiBVc2UgYHN0cnVjdGAgaW5zdGVhZC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciB0eXBlID0gc3RydWN0O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGZyb21QYXJ0aWFsID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICByZXR1cm4gSy5mcm9tUGFydGlhbChNKShmdW5jdGlvbiAoaywgZSkgeyByZXR1cm4gRlMub2YoREUua2V5KGssIERFLm9wdGlvbmFsLCBlKSk7IH0pKHByb3BlcnRpZXMpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBwYXJ0aWFsID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHsgcmV0dXJuIHBpcGUoVW5rbm93blJlY29yZCwgY29tcG9zZShmcm9tUGFydGlhbChwcm9wZXJ0aWVzKSkpOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGZyb21BcnJheSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIEsuZnJvbUFycmF5KE0pKGZ1bmN0aW9uIChpLCBlKSB7IHJldHVybiBGUy5vZihERS5pbmRleChpLCBERS5vcHRpb25hbCwgZSkpOyB9KShpdGVtKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgYXJyYXkgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBwaXBlKFVua25vd25BcnJheSwgY29tcG9zZShmcm9tQXJyYXkoaXRlbSkpKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgZnJvbVJlY29yZCA9IGZ1bmN0aW9uIChjb2RvbWFpbikge1xuICAgIHJldHVybiBLLmZyb21SZWNvcmQoTSkoZnVuY3Rpb24gKGssIGUpIHsgcmV0dXJuIEZTLm9mKERFLmtleShrLCBERS5vcHRpb25hbCwgZSkpOyB9KShjb2RvbWFpbik7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIHJlY29yZCA9IGZ1bmN0aW9uIChjb2RvbWFpbikge1xuICAgIHJldHVybiBwaXBlKFVua25vd25SZWNvcmQsIGNvbXBvc2UoZnJvbVJlY29yZChjb2RvbWFpbikpKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgZnJvbVR1cGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb21wb25lbnRzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgY29tcG9uZW50c1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICByZXR1cm4gSy5mcm9tVHVwbGUoTSkoZnVuY3Rpb24gKGksIGUpIHsgcmV0dXJuIEZTLm9mKERFLmluZGV4KGksIERFLnJlcXVpcmVkLCBlKSk7IH0pLmFwcGx5KHZvaWQgMCwgY29tcG9uZW50cyk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIHR1cGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb21wb25lbnRzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgY29tcG9uZW50c1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICByZXR1cm4gcGlwZShVbmtub3duQXJyYXksIGNvbXBvc2UoZnJvbVR1cGxlLmFwcGx5KHZvaWQgMCwgY29tcG9uZW50cykpKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgdW5pb24gPSBcbi8qI19fUFVSRV9fKi9cbksudW5pb24oTSkoZnVuY3Rpb24gKGksIGUpIHsgcmV0dXJuIEZTLm9mKERFLm1lbWJlcihpLCBlKSk7IH0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGludGVyc2VjdCA9IFxuLyojX19QVVJFX18qL1xuSy5pbnRlcnNlY3QoTSk7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgZnJvbVN1bSA9IGZ1bmN0aW9uICh0YWcpIHsgcmV0dXJuIGZ1bmN0aW9uIChtZW1iZXJzKSB7XG4gICAgcmV0dXJuIEsuZnJvbVN1bShNKShmdW5jdGlvbiAodGFnLCB2YWx1ZSwga2V5cykge1xuICAgICAgICByZXR1cm4gRlMub2YoREUua2V5KHRhZywgREUucmVxdWlyZWQsIGVycm9yKHZhbHVlLCBrZXlzLmxlbmd0aCA9PT0gMCA/ICduZXZlcicgOiBrZXlzLm1hcChmdW5jdGlvbiAoaykgeyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoayk7IH0pLmpvaW4oJyB8ICcpKSkpO1xuICAgIH0pKHRhZykobWVtYmVycyk7XG59OyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIHN1bSA9IGZ1bmN0aW9uICh0YWcpIHsgcmV0dXJuIGZ1bmN0aW9uIChtZW1iZXJzKSB7IHJldHVybiBwaXBlKFVua25vd25SZWNvcmQsIGNvbXBvc2UoZnJvbVN1bSh0YWcpKG1lbWJlcnMpKSk7IH07IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgbGF6eSA9IFxuLyojX19QVVJFX18qL1xuSy5sYXp5KE0pKGZ1bmN0aW9uIChpZCwgZSkgeyByZXR1cm4gRlMub2YoREUubGF6eShpZCwgZSkpOyB9KTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjE1XG4gKi9cbmV4cG9ydCB2YXIgcmVhZG9ubHkgPSBpZGVudGl0eTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIG5vbi1waXBlYWJsZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBtYXBfID0gZnVuY3Rpb24gKGZhLCBmKSB7IHJldHVybiBwaXBlKGZhLCBtYXAoZikpOyB9O1xudmFyIGFsdF8gPSBmdW5jdGlvbiAobWUsIHRoYXQpIHsgcmV0dXJuIHBpcGUobWUsIGFsdCh0aGF0KSk7IH07XG52YXIgY29tcG9zZV8gPSBmdW5jdGlvbiAoYWIsIGxhKSB7IHJldHVybiBwaXBlKGxhLCBjb21wb3NlKGFiKSk7IH07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBwaXBlYWJsZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IEZ1bmN0b3JcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIG1hcCA9IFxuLyojX19QVVJFX18qL1xuSy5tYXAoTSk7XG4vKipcbiAqIEBjYXRlZ29yeSBBbHRcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGFsdCA9IFxuLyojX19QVVJFX18qL1xuSy5hbHQoTSk7XG4vKipcbiAqIEBjYXRlZ29yeSBTZW1pZ3JvdXBvaWRcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIGNvbXBvc2UgPSBcbi8qI19fUFVSRV9fKi9cbksuY29tcG9zZShNKTtcbi8qKlxuICogQGNhdGVnb3J5IENhdGVnb3J5XG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBpZCA9IFxuLyojX19QVVJFX18qL1xuSy5pZChNKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGluc3RhbmNlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IHZhciBVUkkgPSAnaW8tdHMvRGVjb2Rlcic7XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIEZ1bmN0b3IgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBtYXBfXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBBbHQgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIGFsdDogYWx0X1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgQ2F0ZWdvcnkgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgY29tcG9zZTogY29tcG9zZV8sXG4gICAgaWQ6IGlkXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBTY2hlbWFibGUgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbGl0ZXJhbDogbGl0ZXJhbCxcbiAgICBzdHJpbmc6IHN0cmluZyxcbiAgICBudW1iZXI6IG51bWJlcixcbiAgICBib29sZWFuOiBib29sZWFuLFxuICAgIG51bGxhYmxlOiBudWxsYWJsZSxcbiAgICB0eXBlOiB0eXBlLFxuICAgIHN0cnVjdDogc3RydWN0LFxuICAgIHBhcnRpYWw6IHBhcnRpYWwsXG4gICAgcmVjb3JkOiByZWNvcmQsXG4gICAgYXJyYXk6IGFycmF5LFxuICAgIHR1cGxlOiB0dXBsZSxcbiAgICBpbnRlcnNlY3Q6IGludGVyc2VjdCxcbiAgICBzdW06IHN1bSxcbiAgICBsYXp5OiBsYXp5LFxuICAgIHJlYWRvbmx5OiByZWFkb25seVxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgV2l0aFVua25vd25Db250YWluZXJzID0ge1xuICAgIFVua25vd25BcnJheTogVW5rbm93bkFycmF5LFxuICAgIFVua25vd25SZWNvcmQ6IFVua25vd25SZWNvcmRcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIFdpdGhVbmlvbiA9IHtcbiAgICB1bmlvbjogdW5pb25cbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIFdpdGhSZWZpbmUgPSB7XG4gICAgcmVmaW5lOiByZWZpbmVcbn07XG52YXIgZW1wdHkgPSBbXTtcbnZhciBtYWtlID0gZnVuY3Rpb24gKHZhbHVlLCBmb3Jlc3QpIHtcbiAgICBpZiAoZm9yZXN0ID09PSB2b2lkIDApIHsgZm9yZXN0ID0gZW1wdHk7IH1cbiAgICByZXR1cm4gKHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBmb3Jlc3Q6IGZvcmVzdFxuICAgIH0pO1xufTtcbnZhciBkcmF3VHJlZSA9IGZ1bmN0aW9uICh0cmVlKSB7IHJldHVybiB0cmVlLnZhbHVlICsgZHJhd0ZvcmVzdCgnXFxuJywgdHJlZS5mb3Jlc3QpOyB9O1xudmFyIGRyYXdGb3Jlc3QgPSBmdW5jdGlvbiAoaW5kZW50YXRpb24sIGZvcmVzdCkge1xuICAgIHZhciByID0gJyc7XG4gICAgdmFyIGxlbiA9IGZvcmVzdC5sZW5ndGg7XG4gICAgdmFyIHRyZWU7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB0cmVlID0gZm9yZXN0W2ldO1xuICAgICAgICB2YXIgaXNMYXN0ID0gaSA9PT0gbGVuIC0gMTtcbiAgICAgICAgciArPSBpbmRlbnRhdGlvbiArIChpc0xhc3QgPyAn4pSUJyA6ICfilJwnKSArICfilIAgJyArIHRyZWUudmFsdWU7XG4gICAgICAgIHIgKz0gZHJhd0ZvcmVzdChpbmRlbnRhdGlvbiArIChsZW4gPiAxICYmICFpc0xhc3QgPyAn4pSCICAnIDogJyAgICcpLCB0cmVlLmZvcmVzdCk7XG4gICAgfVxuICAgIHJldHVybiByO1xufTtcbnZhciB0b1RyZWUgPSBERS5mb2xkKHtcbiAgICBMZWFmOiBmdW5jdGlvbiAoaW5wdXQsIGVycm9yKSB7IHJldHVybiBtYWtlKFwiY2Fubm90IGRlY29kZSBcIi5jb25jYXQoSlNPTi5zdHJpbmdpZnkoaW5wdXQpLCBcIiwgc2hvdWxkIGJlIFwiKS5jb25jYXQoZXJyb3IpKTsgfSxcbiAgICBLZXk6IGZ1bmN0aW9uIChrZXksIGtpbmQsIGVycm9ycykgeyByZXR1cm4gbWFrZShcIlwiLmNvbmNhdChraW5kLCBcIiBwcm9wZXJ0eSBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KGtleSkpLCB0b0ZvcmVzdChlcnJvcnMpKTsgfSxcbiAgICBJbmRleDogZnVuY3Rpb24gKGluZGV4LCBraW5kLCBlcnJvcnMpIHsgcmV0dXJuIG1ha2UoXCJcIi5jb25jYXQoa2luZCwgXCIgaW5kZXggXCIpLmNvbmNhdChpbmRleCksIHRvRm9yZXN0KGVycm9ycykpOyB9LFxuICAgIE1lbWJlcjogZnVuY3Rpb24gKGluZGV4LCBlcnJvcnMpIHsgcmV0dXJuIG1ha2UoXCJtZW1iZXIgXCIuY29uY2F0KGluZGV4KSwgdG9Gb3Jlc3QoZXJyb3JzKSk7IH0sXG4gICAgTGF6eTogZnVuY3Rpb24gKGlkLCBlcnJvcnMpIHsgcmV0dXJuIG1ha2UoXCJsYXp5IHR5cGUgXCIuY29uY2F0KGlkKSwgdG9Gb3Jlc3QoZXJyb3JzKSk7IH0sXG4gICAgV3JhcDogZnVuY3Rpb24gKGVycm9yLCBlcnJvcnMpIHsgcmV0dXJuIG1ha2UoZXJyb3IsIHRvRm9yZXN0KGVycm9ycykpOyB9XG59KTtcbnZhciB0b0ZvcmVzdCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHN0YWNrID0gW107XG4gICAgdmFyIGZvY3VzID0gZTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHN3aXRjaCAoZm9jdXMuX3RhZykge1xuICAgICAgICAgICAgY2FzZSAnT2YnOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2godG9UcmVlKGZvY3VzLnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0bXAgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRtcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXMgPSB0bXA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdDb25jYXQnOlxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goZm9jdXMucmlnaHQpO1xuICAgICAgICAgICAgICAgIGZvY3VzID0gZm9jdXMubGVmdDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn07XG4vKipcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGRyYXcgPSBmdW5jdGlvbiAoZSkgeyByZXR1cm4gdG9Gb3Jlc3QoZSkubWFwKGRyYXdUcmVlKS5qb2luKCdcXG4nKTsgfTtcbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCB2YXIgc3RyaW5naWZ5ID0gXG4vKiNfX1BVUkVfXyovXG5FLmZvbGQoZHJhdywgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGEsIG51bGwsIDIpOyB9KTtcbiIsIi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgb2YgPSBmdW5jdGlvbiAoYSkgeyByZXR1cm4gKHsgX3RhZzogJ09mJywgdmFsdWU6IGEgfSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgdmFyIGNvbmNhdCA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gKHtcbiAgICBfdGFnOiAnQ29uY2F0JyxcbiAgICBsZWZ0OiBsZWZ0LFxuICAgIHJpZ2h0OiByaWdodFxufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBkZXN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCB2YXIgZm9sZCA9IGZ1bmN0aW9uIChvbk9mLCBvbkNvbmNhdCkgeyByZXR1cm4gZnVuY3Rpb24gKGYpIHtcbiAgICBzd2l0Y2ggKGYuX3RhZykge1xuICAgICAgICBjYXNlICdPZic6XG4gICAgICAgICAgICByZXR1cm4gb25PZihmLnZhbHVlKTtcbiAgICAgICAgY2FzZSAnQ29uY2F0JzpcbiAgICAgICAgICAgIHJldHVybiBvbkNvbmNhdChmLmxlZnQsIGYucmlnaHQpO1xuICAgIH1cbn07IH07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VtaWdyb3VwKCkge1xuICAgIHJldHVybiB7IGNvbmNhdDogY29uY2F0IH07XG59XG4iLCIvKipcbiAqICoqVGhpcyBtb2R1bGUgaXMgZXhwZXJpbWVudGFsKipcbiAqXG4gKiBFeHBlcmltZW50YWwgZmVhdHVyZXMgYXJlIHB1Ymxpc2hlZCBpbiBvcmRlciB0byBnZXQgZWFybHkgZmVlZGJhY2sgZnJvbSB0aGUgY29tbXVuaXR5LCBzZWUgdGhlc2UgdHJhY2tpbmdcbiAqIFtpc3N1ZXNdKGh0dHBzOi8vZ2l0aHViLmNvbS9nY2FudGkvaW8tdHMvaXNzdWVzP3E9bGFiZWwlM0F2Mi4yKykgZm9yIGZ1cnRoZXIgZGlzY3Vzc2lvbnMgYW5kIGVuaGFuY2VtZW50cy5cbiAqXG4gKiBBIGZlYXR1cmUgdGFnZ2VkIGFzIF9FeHBlcmltZW50YWxfIGlzIGluIGEgaGlnaCBzdGF0ZSBvZiBmbHV4LCB5b3UncmUgYXQgcmlzayBvZiBpdCBjaGFuZ2luZyB3aXRob3V0IG5vdGljZS5cbiAqXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICdmcC10cy9lczYvZnVuY3Rpb24nO1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2VzNi9waXBlYWJsZSc7XG5pbXBvcnQgKiBhcyBTIGZyb20gJy4vU2NoZW1hYmxlJztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbnN0cnVjdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciBsaXRlcmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YWx1ZXNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuICh7XG4gICAgICAgIGlzOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gdmFsdWVzLmZpbmRJbmRleChmdW5jdGlvbiAoYSkgeyByZXR1cm4gYSA9PT0gdTsgfSkgIT09IC0xOyB9XG4gICAgfSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcHJpbWl0aXZlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgc3RyaW5nID0ge1xuICAgIGlzOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gdHlwZW9mIHUgPT09ICdzdHJpbmcnOyB9XG59O1xuLyoqXG4gKiBOb3RlOiBgTmFOYCBpcyBleGNsdWRlZC5cbiAqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgbnVtYmVyID0ge1xuICAgIGlzOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gdHlwZW9mIHUgPT09ICdudW1iZXInICYmICFpc05hTih1KTsgfVxufTtcbi8qKlxuICogQGNhdGVnb3J5IHByaW1pdGl2ZXNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIGJvb2xlYW4gPSB7XG4gICAgaXM6IGZ1bmN0aW9uICh1KSB7IHJldHVybiB0eXBlb2YgdSA9PT0gJ2Jvb2xlYW4nOyB9XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgVW5rbm93bkFycmF5ID0ge1xuICAgIGlzOiBBcnJheS5pc0FycmF5XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgcHJpbWl0aXZlc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgVW5rbm93blJlY29yZCA9IHtcbiAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHUgIT09IG51bGwgJiYgdHlwZW9mIHUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHUpOyB9XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gY29tYmluYXRvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciByZWZpbmUgPSBmdW5jdGlvbiAocmVmaW5lbWVudCkgeyByZXR1cm4gZnVuY3Rpb24gKGZyb20pIHsgcmV0dXJuICh7XG4gICAgaXM6IGZ1bmN0aW9uIChpKSB7IHJldHVybiBmcm9tLmlzKGkpICYmIHJlZmluZW1lbnQoaSk7IH1cbn0pOyB9OyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIG51bGxhYmxlID0gZnVuY3Rpb24gKG9yKSB7IHJldHVybiAoe1xuICAgIGlzOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gaSA9PT0gbnVsbCB8fCBvci5pcyhpKTsgfVxufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4xNVxuICovXG5leHBvcnQgdmFyIHN0cnVjdCA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgcmV0dXJuIHBpcGUoVW5rbm93blJlY29yZCwgcmVmaW5lKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIGZvciAodmFyIGsgaW4gcHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKCEoayBpbiByKSB8fCAhcHJvcGVydGllc1trXS5pcyhyW2tdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KSk7XG59O1xuLyoqXG4gKiBVc2UgYHN0cnVjdGAgaW5zdGVhZC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IHZhciB0eXBlID0gc3RydWN0O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIHBhcnRpYWwgPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xuICAgIHJldHVybiBwaXBlKFVua25vd25SZWNvcmQsIHJlZmluZShmdW5jdGlvbiAocikge1xuICAgICAgICBmb3IgKHZhciBrIGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHZhciB2ID0gcltrXTtcbiAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQgJiYgIXByb3BlcnRpZXNba10uaXModikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSkpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciBhcnJheSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIHBpcGUoVW5rbm93bkFycmF5LCByZWZpbmUoZnVuY3Rpb24gKHVzKSB7IHJldHVybiB1cy5ldmVyeShpdGVtLmlzKTsgfSkpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciByZWNvcmQgPSBmdW5jdGlvbiAoY29kb21haW4pIHtcbiAgICByZXR1cm4gcGlwZShVbmtub3duUmVjb3JkLCByZWZpbmUoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgZm9yICh2YXIgayBpbiByKSB7XG4gICAgICAgICAgICBpZiAoIWNvZG9tYWluLmlzKHJba10pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgdHVwbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbXBvbmVudHMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBjb21wb25lbnRzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiAoe1xuICAgICAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkodSkgJiYgdS5sZW5ndGggPT09IGNvbXBvbmVudHMubGVuZ3RoICYmIGNvbXBvbmVudHMuZXZlcnkoZnVuY3Rpb24gKGMsIGkpIHsgcmV0dXJuIGMuaXModVtpXSk7IH0pOyB9XG4gICAgfSk7XG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgdmFyIGludGVyc2VjdCA9IGZ1bmN0aW9uIChyaWdodCkgeyByZXR1cm4gZnVuY3Rpb24gKGxlZnQpIHsgcmV0dXJuICh7XG4gICAgaXM6IGZ1bmN0aW9uICh1KSB7IHJldHVybiBsZWZ0LmlzKHUpICYmIHJpZ2h0LmlzKHUpOyB9XG59KTsgfTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciB1bmlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWVtYmVycyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIG1lbWJlcnNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuICh7XG4gICAgICAgIGlzOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gbWVtYmVycy5zb21lKGZ1bmN0aW9uIChtKSB7IHJldHVybiBtLmlzKHUpOyB9KTsgfVxuICAgIH0pO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciBzdW0gPSBmdW5jdGlvbiAodGFnKSB7IHJldHVybiBmdW5jdGlvbiAobWVtYmVycykge1xuICAgIHJldHVybiBwaXBlKFVua25vd25SZWNvcmQsIHJlZmluZShmdW5jdGlvbiAocikge1xuICAgICAgICB2YXIgdiA9IHJbdGFnXTtcbiAgICAgICAgaWYgKHYgaW4gbWVtYmVycykge1xuICAgICAgICAgICAgcmV0dXJuIG1lbWJlcnNbdl0uaXMocik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pKTtcbn07IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4wXG4gKi9cbmV4cG9ydCB2YXIgbGF6eSA9IGZ1bmN0aW9uIChmKSB7XG4gICAgdmFyIGdldCA9IFMubWVtb2l6ZShmKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBpczogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIGdldCgpLmlzKHUpOyB9XG4gICAgfTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi4xNVxuICovXG5leHBvcnQgdmFyIHJlYWRvbmx5ID0gaWRlbnRpdHk7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgYWx0ID0gZnVuY3Rpb24gKHRoYXQpIHsgcmV0dXJuIGZ1bmN0aW9uIChtZSkgeyByZXR1cm4gKHtcbiAgICBpczogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIG1lLmlzKGkpIHx8IHRoYXQoKS5pcyhpKTsgfVxufSk7IH07IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgemVybyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7XG4gICAgaXM6IGZ1bmN0aW9uIChfKSB7IHJldHVybiBmYWxzZTsgfVxufSk7IH07XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCB2YXIgY29tcG9zZSA9IGZ1bmN0aW9uICh0bykgeyByZXR1cm4gZnVuY3Rpb24gKGZyb20pIHsgcmV0dXJuICh7XG4gICAgaXM6IGZ1bmN0aW9uIChpKSB7IHJldHVybiBmcm9tLmlzKGkpICYmIHRvLmlzKGkpOyB9XG59KTsgfTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBpZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7XG4gICAgaXM6IGZ1bmN0aW9uIChfKSB7IHJldHVybiB0cnVlOyB9XG59KTsgfTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGluc3RhbmNlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuZXhwb3J0IHZhciBVUkkgPSAnaW8tdHMvR3VhcmQnO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBTY2hlbWFibGUgPSB7XG4gICAgVVJJOiBVUkksXG4gICAgbGl0ZXJhbDogbGl0ZXJhbCxcbiAgICBzdHJpbmc6IHN0cmluZyxcbiAgICBudW1iZXI6IG51bWJlcixcbiAgICBib29sZWFuOiBib29sZWFuLFxuICAgIG51bGxhYmxlOiBudWxsYWJsZSxcbiAgICB0eXBlOiB0eXBlLFxuICAgIHN0cnVjdDogc3RydWN0LFxuICAgIHBhcnRpYWw6IHBhcnRpYWwsXG4gICAgcmVjb3JkOiByZWNvcmQsXG4gICAgYXJyYXk6IGFycmF5LFxuICAgIHR1cGxlOiB0dXBsZSxcbiAgICBpbnRlcnNlY3Q6IGludGVyc2VjdCxcbiAgICBzdW06IHN1bSxcbiAgICBsYXp5OiBmdW5jdGlvbiAoXywgZikgeyByZXR1cm4gbGF6eShmKTsgfSxcbiAgICByZWFkb25seTogcmVhZG9ubHlcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjIuOFxuICovXG5leHBvcnQgdmFyIFdpdGhVbmtub3duQ29udGFpbmVycyA9IHtcbiAgICBVbmtub3duQXJyYXk6IFVua25vd25BcnJheSxcbiAgICBVbmtub3duUmVjb3JkOiBVbmtub3duUmVjb3JkXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBXaXRoVW5pb24gPSB7XG4gICAgdW5pb246IHVuaW9uXG59O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4yLjhcbiAqL1xuZXhwb3J0IHZhciBXaXRoUmVmaW5lID0ge1xuICAgIHJlZmluZTogcmVmaW5lXG59O1xuIiwiaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9lczYvRWl0aGVyJztcbmltcG9ydCAqIGFzIEcgZnJvbSAnLi9HdWFyZCc7XG5pbXBvcnQgKiBhcyBTIGZyb20gJy4vU2NoZW1hYmxlJztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbnN0cnVjdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21SZWZpbmVtZW50KE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJlZmluZW1lbnQsIG9uRXJyb3IpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIChyZWZpbmVtZW50KGkpID8gTS5vZihpKSA6IE0udGhyb3dFcnJvcihvbkVycm9yKGkpKSk7IH1cbiAgICB9KTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXRlcmFsKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uRXJyb3IpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFsdWVzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh7XG4gICAgICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpKSB7IHJldHVybiAoRy5saXRlcmFsLmFwcGx5KEcsIHZhbHVlcykuaXMoaSkgPyBNLm9mKGkpIDogTS50aHJvd0Vycm9yKG9uRXJyb3IoaSwgdmFsdWVzKSkpOyB9XG4gICAgICAgIH0pO1xuICAgIH07IH07XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb21iaW5hdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTGVmdFdpdGhJbnB1dChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmdW5jdGlvbiAoZGVjb2RlcikgeyByZXR1cm4gKHtcbiAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gTS5tYXBMZWZ0KGRlY29kZXIuZGVjb2RlKGkpLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gZihpLCBlKTsgfSk7IH1cbiAgICB9KTsgfTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZmluZShNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyZWZpbmVtZW50LCBvbkVycm9yKSB7IHJldHVybiBmdW5jdGlvbiAoZnJvbSkgeyByZXR1cm4gY29tcG9zZShNKShmcm9tUmVmaW5lbWVudChNKShyZWZpbmVtZW50LCBvbkVycm9yKSkoZnJvbSk7IH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkZWNvZGUpIHsgcmV0dXJuIGZ1bmN0aW9uIChmcm9tKSB7IHJldHVybiBjb21wb3NlKE0pKHsgZGVjb2RlOiBkZWNvZGUgfSkoZnJvbSk7IH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBudWxsYWJsZShNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbkVycm9yKSB7IHJldHVybiBmdW5jdGlvbiAob3IpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpID09PSBudWxsXG4gICAgICAgICAgICAgICAgPyBNLm9mKG51bGwpXG4gICAgICAgICAgICAgICAgOiBNLmJpbWFwKG9yLmRlY29kZShpKSwgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIG9uRXJyb3IoaSwgZSk7IH0sIGZ1bmN0aW9uIChhKSB7IHJldHVybiBhOyB9KTtcbiAgICAgICAgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuMTVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21TdHJ1Y3QoTSkge1xuICAgIHZhciB0cmF2ZXJzZSA9IHRyYXZlcnNlUmVjb3JkV2l0aEluZGV4KE0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAob25Qcm9wZXJ0eUVycm9yKSB7IHJldHVybiBmdW5jdGlvbiAocHJvcGVydGllcykgeyByZXR1cm4gKHtcbiAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIHRyYXZlcnNlKHByb3BlcnRpZXMsIGZ1bmN0aW9uIChrZXksIGRlY29kZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTS5tYXBMZWZ0KGRlY29kZXIuZGVjb2RlKGlba2V5XSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBvblByb3BlcnR5RXJyb3Ioa2V5LCBlKTsgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBVc2UgYGZyb21TdHJ1Y3RgIGluc3RlYWQuXG4gKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCB2YXIgZnJvbVR5cGUgPSBmcm9tU3RydWN0O1xuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbVBhcnRpYWwoTSkge1xuICAgIHZhciB0cmF2ZXJzZSA9IHRyYXZlcnNlUmVjb3JkV2l0aEluZGV4KE0pO1xuICAgIHZhciB1bmRlZmluZWRQcm9wZXJ0eSA9IE0ub2YoRS5yaWdodCh1bmRlZmluZWQpKTtcbiAgICB2YXIgc2tpcFByb3BlcnR5ID0gTS5vZihFLmxlZnQodW5kZWZpbmVkKSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvblByb3BlcnR5RXJyb3IpIHsgcmV0dXJuIGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7IHJldHVybiAoe1xuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gTS5tYXAodHJhdmVyc2UocHJvcGVydGllcywgZnVuY3Rpb24gKGtleSwgZGVjb2Rlcikge1xuICAgICAgICAgICAgICAgIHZhciBpa2V5ID0gaVtrZXldO1xuICAgICAgICAgICAgICAgIGlmIChpa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleSBpbiBpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IC8vIGRvbid0IHN0cmlwIHVuZGVmaW5lZCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkUHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogLy8gZG9uJ3QgYWRkIG1pc3NpbmcgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNraXBQcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIE0uYmltYXAoZGVjb2Rlci5kZWNvZGUoaWtleSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBvblByb3BlcnR5RXJyb3Ioa2V5LCBlKTsgfSwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIEUucmlnaHQoYSk7IH0pO1xuICAgICAgICAgICAgfSksIGNvbXBhY3RSZWNvcmQpO1xuICAgICAgICB9XG4gICAgfSk7IH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tQXJyYXkoTSkge1xuICAgIHZhciB0cmF2ZXJzZSA9IHRyYXZlcnNlQXJyYXlXaXRoSW5kZXgoTSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbkl0ZW1FcnJvcikgeyByZXR1cm4gZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGlzKSB7IHJldHVybiB0cmF2ZXJzZShpcywgZnVuY3Rpb24gKGluZGV4LCBpKSB7IHJldHVybiBNLm1hcExlZnQoaXRlbS5kZWNvZGUoaSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBvbkl0ZW1FcnJvcihpbmRleCwgZSk7IH0pOyB9KTsgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbVJlY29yZChNKSB7XG4gICAgdmFyIHRyYXZlcnNlID0gdHJhdmVyc2VSZWNvcmRXaXRoSW5kZXgoTSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbktleUVycm9yKSB7IHJldHVybiBmdW5jdGlvbiAoY29kb21haW4pIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGlyKSB7IHJldHVybiB0cmF2ZXJzZShpciwgZnVuY3Rpb24gKGtleSwgaSkgeyByZXR1cm4gTS5tYXBMZWZ0KGNvZG9tYWluLmRlY29kZShpKSwgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIG9uS2V5RXJyb3Ioa2V5LCBlKTsgfSk7IH0pOyB9XG4gICAgfSk7IH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tVHVwbGUoTSkge1xuICAgIHZhciB0cmF2ZXJzZSA9IHRyYXZlcnNlQXJyYXlXaXRoSW5kZXgoTSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvbkluZGV4RXJyb3IpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGNvbXBvbmVudHNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHtcbiAgICAgICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGlzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYXZlcnNlKGNvbXBvbmVudHMsIGZ1bmN0aW9uIChpbmRleCwgZGVjb2Rlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTS5tYXBMZWZ0KGRlY29kZXIuZGVjb2RlKGlzW2luZGV4XSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBvbkluZGV4RXJyb3IoaW5kZXgsIGUpOyB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaW9uKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uTWVtYmVyRXJyb3IpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1lbWJlcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIG1lbWJlcnNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHtcbiAgICAgICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0ID0gTS5tYXBMZWZ0KG1lbWJlcnNbMF0uZGVjb2RlKGkpLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25NZW1iZXJFcnJvcigwLCBlKTsgfSk7XG4gICAgICAgICAgICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ID0gTS5hbHQob3V0LCBmdW5jdGlvbiAoKSB7IHJldHVybiBNLm1hcExlZnQobWVtYmVyc1tpbmRleF0uZGVjb2RlKGkpLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gb25NZW1iZXJFcnJvcihpbmRleCwgZSk7IH0pOyB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBtZW1iZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBfbG9vcF8xKGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyaWdodCkgeyByZXR1cm4gZnVuY3Rpb24gKGxlZnQpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBNLmFwKE0ubWFwKGxlZnQuZGVjb2RlKGkpLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHsgcmV0dXJuIFMuaW50ZXJzZWN0XyhhLCBiKTsgfTsgfSksIHJpZ2h0LmRlY29kZShpKSk7XG4gICAgICAgIH1cbiAgICB9KTsgfTsgfTtcbn1cbi8qKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4yLjdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21TdW0oTSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAob25UYWdFcnJvcikgeyByZXR1cm4gZnVuY3Rpb24gKHRhZykgeyByZXR1cm4gZnVuY3Rpb24gKG1lbWJlcnMpIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhtZW1iZXJzKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGlyKSB7XG4gICAgICAgICAgICAgICAgdmFyIHYgPSBpclt0YWddO1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobWVtYmVycywgdikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lbWJlcnNbdl0uZGVjb2RlKGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIE0udGhyb3dFcnJvcihvblRhZ0Vycm9yKHRhZywgdiwga2V5cykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07IH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXp5KE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9uRXJyb3IpIHsgcmV0dXJuIGZ1bmN0aW9uIChpZCwgZikge1xuICAgICAgICB2YXIgZ2V0ID0gUy5tZW1vaXplKGYpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gTS5tYXBMZWZ0KGdldCgpLmRlY29kZSh1KSwgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIG9uRXJyb3IoaWQsIGUpOyB9KTsgfVxuICAgICAgICB9O1xuICAgIH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi43XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKE0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFiKSB7IHJldHVybiBmdW5jdGlvbiAoaWEpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIE0uY2hhaW4oaWEuZGVjb2RlKGkpLCBhYi5kZWNvZGUpOyB9XG4gICAgfSk7IH07IH07XG59XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMi44XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZChNKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7XG4gICAgICAgIGRlY29kZTogTS5vZlxuICAgIH0pOyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwKEYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChpYSkgeyByZXR1cm4gKHtcbiAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gRi5tYXAoaWEuZGVjb2RlKGkpLCBmKTsgfVxuICAgIH0pOyB9OyB9O1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjIuN1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWx0KEEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRoYXQpIHsgcmV0dXJuIGZ1bmN0aW9uIChtZSkgeyByZXR1cm4gKHtcbiAgICAgICAgZGVjb2RlOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gQS5hbHQobWUuZGVjb2RlKGkpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGF0KCkuZGVjb2RlKGkpOyB9KTsgfVxuICAgIH0pOyB9OyB9O1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gdXRpbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciB0cmF2ZXJzZUFycmF5V2l0aEluZGV4ID0gZnVuY3Rpb24gKE0pIHsgcmV0dXJuIGZ1bmN0aW9uIChhcywgZikge1xuICAgIHJldHVybiBhcy5yZWR1Y2UoZnVuY3Rpb24gKG1icywgYSwgaSkge1xuICAgICAgICByZXR1cm4gTS5hcChNLm1hcChtYnMsIGZ1bmN0aW9uIChicykgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgIGJzLnB1c2goYik7XG4gICAgICAgICAgICByZXR1cm4gYnM7XG4gICAgICAgIH07IH0pLCBmKGksIGEpKTtcbiAgICB9LCBNLm9mKFtdKSk7XG59OyB9O1xudmFyIHRyYXZlcnNlUmVjb3JkV2l0aEluZGV4ID0gZnVuY3Rpb24gKE0pIHsgcmV0dXJuIGZ1bmN0aW9uIChyLCBmKSB7XG4gICAgdmFyIGtzID0gT2JqZWN0LmtleXMocik7XG4gICAgaWYgKGtzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gTS5vZih7fSk7XG4gICAgfVxuICAgIHZhciBmciA9IE0ub2Yoe30pO1xuICAgIHZhciBfbG9vcF8yID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBmciA9IE0uYXAoTS5tYXAoZnIsIGZ1bmN0aW9uIChyKSB7IHJldHVybiBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgcltrZXldID0gYjtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9OyB9KSwgZihrZXksIHJba2V5XSkpO1xuICAgIH07XG4gICAgZm9yICh2YXIgX2kgPSAwLCBrc18xID0ga3M7IF9pIDwga3NfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGtleSA9IGtzXzFbX2ldO1xuICAgICAgICBfbG9vcF8yKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBmcjtcbn07IH07XG52YXIgY29tcGFjdFJlY29yZCA9IGZ1bmN0aW9uIChyKSB7XG4gICAgdmFyIG91dCA9IHt9O1xuICAgIGZvciAodmFyIGsgaW4gcikge1xuICAgICAgICB2YXIgcmsgPSByW2tdO1xuICAgICAgICBpZiAoRS5pc1JpZ2h0KHJrKSkge1xuICAgICAgICAgICAgb3V0W2tdID0gcmsucmlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn07XG4iLCIvKipcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVtb2l6ZShmKSB7XG4gICAgdmFyIGNhY2hlID0gbmV3IE1hcCgpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgICBpZiAoIWNhY2hlLmhhcyhhKSkge1xuICAgICAgICAgICAgdmFyIGIgPSBmKGEpO1xuICAgICAgICAgICAgY2FjaGUuc2V0KGEsIGIpO1xuICAgICAgICAgICAgcmV0dXJuIGI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhY2hlLmdldChhKTtcbiAgICB9O1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gdXRpbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciB0eXBlT2YgPSBmdW5jdGlvbiAoeCkgeyByZXR1cm4gKHggPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgeCk7IH07XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgdmFyIGludGVyc2VjdF8gPSBmdW5jdGlvbiAoYSwgYikge1xuICAgIGlmIChhICE9PSB1bmRlZmluZWQgJiYgYiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciB0eCA9IHR5cGVPZihhKTtcbiAgICAgICAgdmFyIHR5ID0gdHlwZU9mKGIpO1xuICAgICAgICBpZiAodHggPT09ICdvYmplY3QnIHx8IHR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGEsIGIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93W1wiVGhpbmtpbmdIb21lVWlcIl07IiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3dbXCJ0aFJlYWN0XCJdOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNyZWF0ZU1vZHVsZSwgTG9nTGV2ZWwsIHVzZUFwcENvbnRleHQsIHVzZUxvZ2dlciB9IGZyb20gJ0B0aGlua2luZy1ob21lL3VpJztcbmltcG9ydCAqIGFzIGQgZnJvbSAnaW8tdHMvRGVjb2Rlcic7XG5jb25zdCB1cmwgPSAnL2FwaS90bXAvcGlncyc7XG5jb25zdCB0bXBQaWdEZWNvZGVyID0gZC5zdHJ1Y3Qoe1xuICAgIGlkOiBkLnN0cmluZyxcbiAgICBuYW1lOiBkLnN0cmluZyxcbiAgICBzaXplOiBkLm51bWJlcixcbn0pO1xuY29uc3QgdG1wUmVzcG9uc2VEZWNvZGVyID0gZC5hcnJheSh0bXBQaWdEZWNvZGVyKTtcbmNvbnN0IFRtcFNlY3Rpb24gPSAoKSA9PiB7XG4gICAgY29uc3QgW2xpc3QsIHNldExpc3RdID0gdXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IHsgYXBpIH0gPSB1c2VBcHBDb250ZXh0KCk7XG4gICAgY29uc3QgY29udHJvbGxlciA9IHVzZU1lbW8oKCkgPT4gbmV3IEFib3J0Q29udHJvbGxlcigpLCBbXSk7XG4gICAgY29uc3QgbG9nZ2VyID0gdXNlTG9nZ2VyKCk7XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgYXBpLmdldCh0bXBSZXNwb25zZURlY29kZXIsIHsgdXJsLCBzaWduYWw6IGNvbnRyb2xsZXIuc2lnbmFsIH0pXG4gICAgICAgICAgICAudGhlbihzZXRMaXN0LCAoZSkgPT4gbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogJ2Vycm9yJykpO1xuICAgICAgICByZXR1cm4gKCkgPT4gY29udHJvbGxlci5hYm9ydCgpO1xuICAgIH0sIFtjb250cm9sbGVyLCBsb2dnZXJdKTtcbiAgICBjb25zdCBjYW5jZWwgPSB1c2VDYWxsYmFjaygoKSA9PiBjb250cm9sbGVyLmFib3J0KCksIFtjb250cm9sbGVyXSk7XG4gICAgY29uc3QgY29udGVudCA9IGxpc3QubGVuZ3RoID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLCBsaXN0Lm1hcChwaWcgPT4gUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsXG4gICAgICAgIHBpZy5uYW1lLFxuICAgICAgICBcIiAoXCIsXG4gICAgICAgIHBpZy5zaXplLFxuICAgICAgICBcIilcIikpKSkgOiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiTE9BRElORy4uLlwiKTtcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBsaXN0Lmxlbmd0aCA/IHVuZGVmaW5lZCA6IChSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgb25DbGljazogY2FuY2VsIH0sIFwiQ2FuY2VsIHJlcXVlc3RcIikpKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCxcbiAgICAgICAgICAgIFwiVGhpcyBpcyB0aGUgXCIsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIFwiVGVzdCBwYWdlIDJcIiksXG4gICAgICAgICAgICBcIiAoZnJvbSBcIixcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjb2RlXCIsIG51bGwsIFwiVG1wIHBsdWdpblwiKSxcbiAgICAgICAgICAgIFwiKVwiKSxcbiAgICAgICAgY2FuY2VsQnV0dG9uLFxuICAgICAgICBjb250ZW50KSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTW9kdWxlKFRtcFNlY3Rpb24pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9