<template>
    <button class="btn">
        <slot>
            test test 
        </slot>
    </button>
</template>

<style scoped>
.btn {
    background-color: #42b983;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 8px;
}
.btn:hover {
    background-color: #369870;
}
.btn:active {
    background-color: #2c6e5c;
}
.btn:focus {
    outline: none;
}
.btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>