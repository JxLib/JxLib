<?php
/* recursively convert a variable to its json representation */
function var2json($var) {
    $result = "";
    if (is_object($var)) {
        $result .= "{";
        $sep = "";
        foreach($var as $key => $val) {
            $result .= $sep.'"'.$key.'":'.var2json($val);
            $sep = ",";
        }
        $result .= "}";
    } else if (is_array($var)) {
        $result .= "[";
        $sep = "";
        for($i=0; $i<count($var); $i++) {
            $result .= $sep.var2json($var[$i]);
            $sep = ",";
        }
        $result .= "]";
    } else if (is_string($var)) {
        //$tmpStr = str_replace("'", "\'", $var);
        $tmpStr = str_replace('<![CDATA[','', $var);
        $tmpStr = str_replace(']]>','', $tmpStr);
        $tmpStr = str_replace('"', '\"', $tmpStr);
        $result = '"'.str_replace("\n", '\n', $tmpStr).'"';
    } else if (is_bool($var)) {
        $result = $var ? 'true' : 'false';
    } else if (is_null($var)) {
        $result = 'null';
    }else {
        $result = $var;
    }
    return $result;
}
?>