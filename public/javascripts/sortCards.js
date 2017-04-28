/**
 * Created by Porter on 4/25/2017.
 */
function sortByCount(a, b) {
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;
    return 0;
}
function defaultSort(a, b) {
    return (a - b)
}
sortByRank = function () {
    var s = [];
    jQuery.each(jQuery(".card"), function (key, value) {

        s.push([jQuery(value).prop('id'), jQuery(value).data('rank')])

    })
    s.sort(sortByCount);
    //s.reverse();

    jQuery.each(s, function (index, value) {

        jQuery('#cards').prepend(jQuery("#" + value[0]).parent().parent())


    })
};

sortByDate = function (type) {

    var s = [];
    jQuery.each(jQuery(".card"), function (key, value) {

        s.push(Number(jQuery(value).prop('id')))

    })
    s.sort(defaultSort);
    if (type == "oldest") {
        s.reverse()
    }

    console.log(s);
    jQuery.each(s, function (index, value) {

        jQuery('#cards').prepend(jQuery("#" + value).parent().parent())


    })


};
