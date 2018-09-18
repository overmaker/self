/**
 * @author 劉一童
 * @param {Object} 应用全局对象。如果是在浏览器中运行，就是window对象
 * @param {String} 用作命名特定的命名空间，例如"com.msnmo.edss"。
 * @param {Boolean} 是否开启调试模式。true表示开启，否则关闭。调试模式是程序 指定的运行时标记，在开发阶段可以开启，这时调试级别的日志将输出到浏览器控制台上。
 *            程序正式部署后，应该关闭调试模式，这时调试级别的日志将不会输出到浏览器控制台上。
 * @since 1.0
 */
((window, namespace, rootName, isDebug) => {
    "use strict";
    window[rootName] = window[rootName] || ((window, rootName) => {
        /**
         * 定义命名空间函数
         * 
         * @param {String} 完整命名空间字符串，各个对象标识用“.”号分隔。 例如"com.msnmo.edss"
         * @return 命名空间最后一个对象的引用
         */
        const createNS = fullNS => {
            let obj = window; // 定义命名空间遍历对象。初始化指向全局对象，依次向后遍历
            for (let item of fullNS.split('.')) {
                /*
                 * 遍历命名空间字符串中“.”号分隔的各个对象「item」。 如果obj[item]不存在，创建空对象并返回。否则直接返回obj[item]。
                 * 利用或运算符「||」的短路特性，在不破坏原有命名空间的情况下创建命名空间
                 */
                obj = (obj[item] = obj[item] || {});
            }
            return obj; // 返回命名空间中最后一级对象
        },
        /**
         * 定义调用映射。 调用映射是「操作码」与「函数列表」的映射关系集合，数据结构如下所示： <code>
         * "OP-Code1" -> [func_ref_1_0, func_ref_1_1, func_ref_1_2]
         * "OP-Code2" -> [func_ref_2_0, func_ref_2_1, ...]
         * "OP-Code3" -> [func_ref_3_0]
         * "OP-Code4" -> [func_ref_4_0, func_ref_4_1, func_ref_4_2, ...]
         * ... ...
         * </code>
         * 当发起对某一「操作码」进行广播时，「操作码」对应的所有函数列表依次被调用。 这样可以实现函数调用方与函数实现方的松散耦合。
         */
        invokeMapping = {},
        /**
         * 添加调用监听器
         * 
         * @param {String} 操作码。有意义的业务描述字符串
         * @param {Function} 回调函数引用。与指定的操作码关联
         */
        addInvokeListener = (opCode, func) => {
            /*
             * 如果invokeMapping[opCode]不存在，创建空数组并返回。否则直接返回invokeMapping[opCode]。 然后把传入的回调函数引用添加到数组末尾
             */
            (invokeMapping[opCode] = invokeMapping[opCode] || []).push(func);
            return addInvokeListener;
        },
        /**
         * 执行「操作码」并等待「函数列表」中所有函数执行完毕。
         * 
         * @param {String} 操作码。有意义的业务描述字符串。
         * @param {Object} 函数执行时的输入参数，可以是任意JavaScript对象。
         * @param {Object} 函数执行后的输出结果，可以是任意JavaScript对象。但是如果需要函数返回结果，传入时应是非空的对象。
         * @param {Function} 回调函数引用。所有监听函数执行完成后被调用。
         */
        invokeAndWait = (opCode, inParam, outParam, callback) => {
            const listeners = invokeMapping[opCode]; // 得到「操作码」对应的回调函数列表
            if (listeners) {
                /*
                 * 如果列表非空，依次执行每个函数
                 */
                for (let func of listeners) {
                    func(inParam, outParam);
                }
            }
            if (callback) {
                callback();
            }
            return invokeAndWait;
        }, // 消息分发定义结束
        /*
         * 创建命名空间，然后再定义ns变量命名空间最后一层对象
         */
        ns = createNS(namespace);
        [ns.namespace,
            ns.publish,
            ns.subscribe,
            ns.invokeMapping] = [createNS,
                                 invokeAndWait,
                                 addInvokeListener,
                                 (isDebug === true
                                             ? invokeMapping
                                             : undefined)];
        return ns;
    })(window, rootName);
})(this, "cn.kepu.self", "SELF", true);
